import express from 'express';
import fs from 'fs';
import { findAll, findById, create, update, remove } from './services/users.js';

const app = express();
const PORT = 3000;

app.use(express.json());

const readProducts = () => {
  try {
    const data = fs.readFileSync('./products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeProducts = (data) => {
  fs.writeFileSync('./products.json', JSON.stringify(data, null, 2), 'utf-8');
};

const validateUserPayload = (req, res, next) => {
  const { nome, preco } = req.body || {};
  
  if (typeof nome !== 'string' || nome.trim() === '' || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ erro: 'nome e preco válidos são obrigatórios' });
  }
  
  next();
};

app.get('/products', (req, res) => {
  const products = readProducts();
  const activeProducts = findAll(products);
  res.json(activeProducts);
});

app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  const product = findById(products, id);
  
  if (!product) {
    return res.status(404).json({ erro: 'Produto não encontrado ou excluído' });
  }
  
  res.json(product);
});

app.post('/products', validateUserPayload, (req, res) => {
  const products = readProducts();
  const result = create(products, req.body);
  
  writeProducts(result.updatedList);
  res.status(201).json(result.createdEntity);
});

app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const forceDelete = req.query.force === 'true';
  const products = readProducts(); 

  const result = remove(products, id, forceDelete);
  
  if (!result) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }
  
  writeProducts(result.updatedList);
  res.status(204).end();
});

app.put('/products/:id', validateUserPayload, (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  
  const result = update(products, id, req.body);
  
  if (!result) {
    return res.status(404).json({ erro: 'Produto não encontrado ou excluído' });
  }

  writeProducts(result.updatedList);
  res.json(result.updatedEntity);
});

app.patch('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  
  const idx = products.findIndex(patchProducts => patchProducts.id === id && !patchProducts.deletedAt); 
  if (idx === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado ou excluído' });
  }
  
  const product = products[idx];
  const { nome, preco } = req.body || {};
  
  if (nome !== undefined && (typeof nome !== 'string' || nome.trim() === '')) {
    return res.status(400).json({ erro: 'nome deve ser uma string não vazia' });
  }
  
  if (preco !== undefined && (typeof preco !== 'number' || preco <= 0)) {
    return res.status(400).json({ erro: 'preco deve ser um número maior que 0' });
  }
  
  product.nome = nome !== undefined ? nome : product.nome;
  product.preco = preco !== undefined ? preco : product.preco;
  product.updatedAt = new Date().toISOString();
  
  writeProducts(products);
  res.json(product);
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

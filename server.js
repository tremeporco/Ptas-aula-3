import express from 'express';
import fs from 'fs';

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

app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts(); 
  
  const idx = products.findIndex(p => p.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }
  
  products.splice(idx, 1); 
  writeProducts(products);
  
  res.status(204).end();
});

app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nome, preco } = req.body || {};
  
  if (typeof nome !== 'string' || nome.trim() === '' || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ erro: 'nome e preco válidos são obrigatórios para PUT' });
  }
  
  const products = readProducts();
  const idx = products.findIndex(p => p.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const oldProduct = products[idx];
  
  products[idx] = { 
    id, 
    nome, 
    preco,
    createdAt: oldProduct.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  writeProducts(products);
  res.json(products[idx]);
});


app.patch('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
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

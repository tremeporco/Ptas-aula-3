  import express from 'express';
  import fs from 'fs';

  const app = express();
  const PORT = 3000;


  app.use(express.json());

      const readProducts = () => {
          const data1 = fs.readFileSync('./products.json', 'utf-8');
          return JSON.parse(data1);
      };

  const writeData = (fileName, data) => {
      fs.writeFileSync(`./${fileName}`, JSON.stringify(data, null, 2), 'utf-8');
  };


  app.put('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    
    const { nome, preco } = req.body || {}

  if (
    typeof nome !== 'string' ||
    nome.trim() === '' ||
    typeof preco !== 'number' ||
    preco <= 0
  ) {
    return res.status(400).json({
      erro: 'nome e preco são obrigatórios para PUT (substituição completa)' 
    })
  }


    const products = await readProducts()
    const idx = products.findIndex(u => u.id === id)
    if (idx === -1) return res.status(404).json({ erro: 'produtos não encontrado' })

    products[idx] = { id, nome, preco }
    
    writeData('products.json', products)
    res.json(products[idx])  
  })

  app.patch('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    const products = await readProducts()
    const product = products.find(p => p.id === id)
    if (!product) return res.status(404).json({ erro: 'Produto não encontrado' })


      
const {
  id: _,
  createdAt: __,
  updatedAt: ___,
  nome,
  preco
} = req.body || {}

if (nome !== undefined && (typeof nome !== 'string' || nome.trim() === '')) {
  return res.status(400).json({
    erro: 'nome deve ser uma string não vazia'
  })
}

if (preco !== undefined && (typeof preco !== 'number' || preco <= 0)) {
  return res.status(400).json({
    erro: 'preco deve ser um número maior que 0'
  })
}


      product.nome = nome !== undefined ? nome : product.nome 
product.preco = preco !== undefined ? preco : product.preco
    product.updatedAt = new Date().toISOString()
    
    writeData('products.json', products)
    res.json(product)  
  })

  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

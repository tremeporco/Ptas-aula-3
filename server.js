import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;


app.use(express.json());

    const readProducts = (id) => {
        const data1 = fs.readFileSync('./products.json', 'utf-8');
        return JSON.parse(data1);
    };

const writeData = (fileName, data) => {
    fs.writeFileSync(`./${fileName}`, JSON.stringify(data, null, 2), 'utf-8');
};


app.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id)
  
  const { nome, preco } = req.body || {}

  if (!nome || !preco) {
    return res.status(400).json({ 
      erro: 'nome e preco são obrigatórios para PUT (substituição completa)' 
    })
  }

  // 3. Busca o índice (não o objeto) para poder substituir no array
  const products = await readProducts()
  const idx = products.findIndex(u => u.id === id)
  if (idx === -1) return res.status(404).json({ erro: 'produtos não encontrado' })

  // 4. SUBSTITUI o objeto inteiro — mantém id da URL, descarta o do body
  products[idx] = { id, nome, preco }
  
  // 5. Persiste e responde com recurso atualizado
   writeData('products.json', products)
  res.json(products[idx])  // 200 OK
})

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

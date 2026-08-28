import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;


app.use(express.json());

const readData = (fileName) => {
    const data = fs.readFileSync(`./${fileName}`, 'utf-8');
    return JSON.parse(data);
};

const writeData = (fileName, data) => {
    fs.writeFileSync(`./${fileName}`, JSON.stringify(data, null, 2), 'utf-8');
};

// 1. 
app.post('/products', (req, res) => {
    try {
        const { nome, preco } = req.body;
        if (!nome || preco === undefined) {
            return res.status(400).json({ message: "Campos 'nome' e 'preco' são obrigatórios." });
        }
        const products = readData('products.json');
        const newProduct = { id: products.length + 1, nome, preco: parseFloat(preco) };
        products.push(newProduct);
        writeData('products.json', products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar produto." });
    }
});

// 2. 
app.post('/users', (req, res) => {
    try {
        const { nome, email } = req.body;
        if (!nome || !email) {
            return res.status(400).json({ message: "Campos 'nome' e 'email' são obrigatórios." });
        }
        const users = readData('users.json');
        if (users.some(u => u.email === email)) {
            return res.status(409).json({ message: "Email duplicado. Conflito detectado." });
        }
        const newUser = { id: users.length + 1, nome, email };
        users.push(newUser);
        writeData('users.json', users);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar usuário." });
    }
});

// 3. 
app.post('/users/batch', (req, res) => {
    try {
        const usersArray = req.body;
        if (!Array.isArray(usersArray)) {
            return res.status(400).json({ message: "O corpo deve ser uma lista (Array)." });
        }
        const currentUsers = readData('users.json');
        const addedUsers = [];
        const errors = [];

        usersArray.forEach((user, index) => {
            const { nome, email } = user;
            if (!nome || !email) {
                errors.push({ index, message: "Campos obrigatórios ausentes." });
                return;
            }
            if (currentUsers.some(u => u.email === email) || addedUsers.some(u => u.email === email)) {
                errors.push({ email, message: "Email duplicado." });
                return;
            }
            addedUsers.push({ id: currentUsers.length + addedUsers.length + 1, nome, email });
        });

        if (errors.length > 0) {
            return res.status(400).json({ message: "Erro no lote.", errors });
        }

        writeData('users.json', [...currentUsers, ...addedUsers]);
        res.status(201).json({ message: "Lote salvo!", usersAdded: addedUsers });
    } catch (error) {
        res.status(500).json({ message: "Erro no lote." });
    }
});

app.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id)
  
  const { nome, preco } = req.body || {}

  if (!nome || !preco) {
    return res.status(400).json({ 
      erro: 'nome e preco são obrigatórios para PUT (substituição completa)' 
    })
  }

  // 3. Busca o índice (não o objeto) para poder substituir no array
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' })

  // 4. SUBSTITUI o objeto inteiro — mantém id da URL, descarta o do body
  users[idx] = { id, nome, preco }
  
  // 5. Persiste e responde com recurso atualizado
  await writeUsers(users)
  res.json(users[idx])  // 200 OK
})

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

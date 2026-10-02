// src/server.js
// Só monta o app: middlewares globais, routers e middleware de erro.
import express from 'express'
import usersRouter from './routes/users.routes.js'

const app = express()

app.use(express.json()) // traduz o corpo JSON da requisição
app.use('/users', usersRouter) // tudo que começa com /users vai para o router de users

// Middleware global de erro: o "plano B" de qualquer next(err)
app.use((err, req, res, next) => {
  res.status(500).json({ erro: err.message })
})

app.listen(3000)
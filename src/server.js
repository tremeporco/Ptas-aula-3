import express from 'express'
import productsRoutes from './routes/products.routes.js'

const app = express()

app.use(express.json())

app.use('/products', productsRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ erro: err.message })
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
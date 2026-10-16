import { productsService } from '../services/products.service.js'

export async function listProducts(req, res, next) {
  try {
    const products = await productsService.findAll()

    res.json(products)
  } catch (err) {
    next(err)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await productsService.findById(
      Number(req.params.id)
    )

    if (!product) {
      return res.status(404).json({
        erro: 'não encontrado'
      })
    }

    res.json(product)
  } catch (err) {
    next(err)
  }
}

export async function createProduct(req, res, next) {
  try {
    const novo = await productsService.createProduct(req.body)
    res.status(201).json(novo)
  } catch (err) {
    next(err)
  }
}

export async function updateProduct(req, res, next) {
  try {
    const atualizado = await productsService.updateProduct(
      Number(req.params.id),
      req.body
    )

    res.json(atualizado)
  } catch (err) {
    next(err)
  }
}
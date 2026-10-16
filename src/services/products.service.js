import { productsModel } from '../models/products.model.js'

export const productsService = {

  async findAll() {
    return productsModel.findAll()
  },

  async findById(id) {
    return productsModel.findById(id)
  },

  async createProduct(data) {
    return productsModel.create(data)
  },

  async updateProduct(id, data) {
    const product = await productsModel.findById(id)

    if (!product) {
      const erro = new Error('produto não encontrado')
      erro.status = 404
      throw erro
    }

    return productsModel.update(id, data)
  }

}
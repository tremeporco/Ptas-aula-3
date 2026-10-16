import { Router } from 'express'
import { valida } from '../middlewares/valida.js'
import { productSchema } from '../schemas/product.schema.js'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', listProducts)
router.get('/:id', getProduct)
router.post('/', valida(productSchema), createProduct)
router.put('/:id', valida(productSchema), updateProduct)

export default router
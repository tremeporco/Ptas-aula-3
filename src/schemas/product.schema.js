import { z } from 'zod'

export const productSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  preco: z.number().positive('O preço deve ser positivo')
})
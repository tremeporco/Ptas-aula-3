import { z } from 'zod'

export function valida(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body)

    if (!resultado.success) {
      return res.status(400).json({
        erro: z.flattenError(resultado.error).fieldErrors
      })
    }

    req.body = resultado.data
    next()
  }
}
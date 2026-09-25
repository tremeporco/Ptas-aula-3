export async function createProducts(req, res, next) {
  try {
    const novo = await usersService.createProducts(req.body)
    res.status(201).json(novo)
  } catch (err) {
    next(err)
  }
}
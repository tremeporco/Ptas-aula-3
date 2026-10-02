export const usersService = {
  async createUser(data) {
    const duplicado = (await usersModel.findAll())
      .some(u => u.email === data.email)
    if (duplicado) {
      const erro = new Error('e-mail já cadastrado')
      erro.status = 409
      throw erro
    }
    return usersModel.create(data)
  },
}
// src/services/auth.service.js (esboço para o futuro)
import { usersModel } from '../models/users.model.js'



//O auth usa o usersModel para buscar os users
//  e verifica o e-mail e a senha dados.
export async function autenticar(email, senha) {
  const user = (await usersModel.findAll()).find(u => u.email === email)
  if (!user || user.senha !== senha) {
    const erro = new Error('credenciais inválidas')
    erro.status = 401
    throw erro
  }
  return user
}

//Quando trocarmos o JSON por MongoDB, 
// ele vai usar model ainda então fica quase igual

//A diferença é que o model vai buscar mongo ao invés do json
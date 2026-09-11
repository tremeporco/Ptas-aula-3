export const findAll = (users) => {
  return users.filter(user => !user.deletedAt);
};

export const findById = (users, id) => {
  return users.find(user => user.id === id && !user.deletedAt) || null;
};

export const create = (users, payload) => {
  const nextId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    nome: payload.nome,
    preco: payload.preco,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return {
    updatedList: [...users, newUser],
    createdEntity: newUser
  };
};

export const update = (users, id, payload) => {
  const idx = users.findIndex(user => user.id === id && !user.deletedAt);
  if (idx === -1) return null;

  const updatedList = [...users];
  const oldUser = updatedList[idx];

  updatedList[idx] = {
    id,
    nome: payload.nome,
    preco: payload.preco,
    createdAt: oldUser.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return {
    updatedList,
    updatedEntity: updatedList[idx]
  };
};

export const remove = (users, id, forceDelete) => {
  const idx = users.findIndex(user => user.id === id && (forceDelete || !user.deletedAt));
  if (idx === -1) return null;

  const updatedList = [...users];

  if (forceDelete) {
    updatedList.splice(idx, 1);
  } else {
    updatedList[idx] = {
      ...updatedList[idx],
      deletedAt: new Date().toISOString()
    };
  }

  return { updatedList };
};

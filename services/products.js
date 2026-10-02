export const findAll = (products) => {

  return products.filter(product => !product.deletedAt);

};

export const findById = (products, id) => {

  return products.find(
    product => product.id === id && !product.deletedAt
  ) || null;

};

export const create = (products, payload) => {

  const nextId = products.length > 0
    ? Math.max(...products.map(product => product.id)) + 1
    : 1;

  const newProduct = {

    id: nextId,

    nome: payload.nome,

    preco: payload.preco,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString()

  };

  return {

    updatedList: [...products, newProduct],

    createdEntity: newProduct

  };

};

export const update = (products, id, payload) => {

  const idx = products.findIndex(
    product => product.id === id && !product.deletedAt
  );

  if (idx === -1) return null;

  const updatedList = [...products];

  const oldProduct = updatedList[idx];

  updatedList[idx] = {

    id,

    nome: payload.nome,

    preco: payload.preco,

    createdAt: oldProduct.createdAt || new Date().toISOString(),

    updatedAt: new Date().toISOString()

  };

  return {

    updatedList,

    updatedEntity: updatedList[idx]

  };

};

export const remove = (products, id, forceDelete) => {

  const idx = products.findIndex(
    product =>
      product.id === id &&
      (forceDelete || !product.deletedAt)
  );

  if (idx === -1) return null;

  const updatedList = [...products];

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
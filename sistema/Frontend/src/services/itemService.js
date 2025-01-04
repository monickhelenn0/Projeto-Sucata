import api from './api';

// Obter todos os itens
export const getItems = async () => {
  try {
    const response = await api.get('/items');
    return response.data; // Retorna a lista de itens
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
};

// Criar um novo item
export const createItem = async (itemName) => {
  try {
    const response = await api.post('/items', { name: itemName });
    return response.data; // Retorna o item criado
  } catch (error) {
    console.error('Erro ao criar item:', error);
    throw error;
  }
};

// Excluir um item (opcional, se houver funcionalidade de exclusão no backend)
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data; // Retorna a confirmação da exclusão
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    throw error;
  }
};

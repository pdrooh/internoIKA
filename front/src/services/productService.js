import axios from 'axios';

const API_URL = 'http://localhost:5000/produtos';

export const productService = {
  listarProdutos: async (filtros = {}) => {
    const { data } = await axios.get(API_URL, { params: filtros });
    return data;
  },

  obterProduto: async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  },

  criarProduto: async (produto) => {
    const { data } = await axios.post(API_URL, produto);
    return data;
  },

  atualizarProduto: async (id, produto) => {
    const { data } = await axios.put(`${API_URL}/${id}`, produto);
    return data;
  },

  deletarProduto: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

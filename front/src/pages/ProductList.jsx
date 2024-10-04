import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductForm from '../components/ProductForm';

function ProductList() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [filtroNome, setFiltroNome] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, [filtroNome, ordenacao]);

  const carregarProdutos = async () => {
    try {
      const filtros = {};
      if (filtroNome) filtros.nome = filtroNome;
      if (ordenacao) filtros.ordenarPor = ordenacao;
      const data = await productService.listarProdutos(filtros);
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSubmit = async (produto) => {
    try {
      if (produtoEmEdicao) {
        await productService.atualizarProduto(produtoEmEdicao.id, produto);
      } else {
        await productService.criarProduto(produto);
      }
      setProdutoEmEdicao(null);
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deletarProduto(id);
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Produtos</h1>
      
      <div>
        <input 
          type="text" 
          placeholder="Filtrar por nome" 
          value={filtroNome} 
          onChange={(e) => setFiltroNome(e.target.value)} 
        />
        <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
          <option value="">Ordenar por</option>
          <option value="quantidade-asc">Quantidade (crescente)</option>
        </select>
      </div>

      <ProductForm produto={produtoEmEdicao} onSubmit={handleSubmit} />
      
      <ul>
        {produtos.map(produto => (
          <li key={produto.id}>
            {produto.nome} - R$ {produto.preco} - Qtd: {produto.quantidade}
            <button onClick={() => setProdutoEmEdicao(produto)}>Editar</button>
            <button onClick={() => handleDelete(produto.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;

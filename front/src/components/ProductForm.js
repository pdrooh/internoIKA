import React, { useState, useEffect } from 'react';

function ProductForm({ produto, onSubmit }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setPreco(produto.preco);
      setQuantidade(produto.quantidade);
    } else {
      setNome('');
      setPreco('');
      setQuantidade('');
    }
  }, [produto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nome, preco: Number(preco), quantidade: Number(quantidade) });
    setNome('');
    setPreco('');
    setQuantidade('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Preço"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        required
      />
      <button type="submit">{produto ? 'Atualizar' : 'Adicionar'} Produto</button>
    </form>
  );
}

export default ProductForm;

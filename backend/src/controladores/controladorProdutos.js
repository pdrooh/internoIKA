const Produto = require('../modelos/Produto');

let produtos = [];

exports.listarProdutos = (req, res) => {
  const { ordenarPor, nome } = req.query;
  
  let resultado = [...produtos];

  if (nome) {
    resultado = resultado.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  if (ordenarPor === 'quantidade-asc') {
    resultado.sort((a, b) => a.quantidade - b.quantidade);
  }

  res.json(resultado);
};

exports.obterProduto = (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }
  res.json(produto);
};

exports.criarProduto = (req, res) => {
  const { nome, preco, quantidade } = req.body;
  const novoProduto = new Produto(nome, preco, quantidade);
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
};

exports.atualizarProduto = (req, res) => {
  const { nome, preco, quantidade } = req.body;
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }
  produtos[index] = { ...produtos[index], nome, preco, quantidade };
  res.json(produtos[index]);
};

exports.deletarProduto = (req, res) => {
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }
  produtos.splice(index, 1);
  res.json({ mensagem: "Produto excluído com sucesso" });
};

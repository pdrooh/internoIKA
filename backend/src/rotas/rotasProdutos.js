const express = require('express');
const roteador = express.Router();
const controladorProdutos = require('../controladores/controladorProdutos');
const { validarProduto } = require('../middlewares/validacao');

roteador.get('/', controladorProdutos.listarProdutos);
roteador.get('/:id', controladorProdutos.obterProduto);
roteador.post('/', validarProduto, controladorProdutos.criarProduto);
roteador.put('/:id', validarProduto, controladorProdutos.atualizarProduto);
roteador.delete('/:id', controladorProdutos.deletarProduto);

module.exports = roteador;

class Produto {
    constructor(nome, preco, quantidade) {
      this.id = Produto.incrementarId();
      this.nome = nome;
      this.preco = preco;
      this.quantidade = quantidade;
    }
  
    static incrementarId() {
      if (!this.ultimoId) this.ultimoId = 1;
      else this.ultimoId++;
      return this.ultimoId;
    }
  }
  
  module.exports = Produto;
  
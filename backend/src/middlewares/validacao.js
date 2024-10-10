exports.validarProduto = (req, res, next) => {
    const { nome, preco, quantidade } = req.body;
    
    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ mensagem: "Nome inválido" });
    }
    
    if (!preco || typeof preco !== 'number' || preco <= 0) {
      return res.status(400).json({ mensagem: "Preço inválido" });
    }
    
    if (!quantidade || typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 0) {
      return res.status(400).json({ mensagem: "Quantidade inválida" });
    }
    
    next();
  };
  
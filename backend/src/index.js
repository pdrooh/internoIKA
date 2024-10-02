const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rotasProdutos = require('./rotas/rotasProdutos');

dotenv.config();

const app = express();
const PORTA = process.env.PORTA || 5000;

app.use(cors());
app.use(express.json());

// Usar rotas
app.use('/produtos', rotasProdutos);

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});

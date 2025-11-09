const express = require('express'); //importa o módulo express
const app = express(); //cria uma aplicação express
const port = process.env.PORT || 3000; //define a porta onde o servidor irá rodar
require('dotenv').config(); //carrega variáveis de ambiente do arquivo .env
const mongoose = require('mongoose'); //importa o mongoose para conectar ao MongoDB
const mongo_uri = process.env.MONGO_URI //define a URI do MongoDB
const Product = require('./models/Product'); //importa o modelo Product

mongoose.connect(mongo_uri)
    .then(() => {
        console.log('Conectado ao MongoDB');
        // Inicia o servidor na porta definida
        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`); //mensagem no console quando o servidor iniciar
    });
}).catch((error) => { console.error('Erro ao conectar ao MongoDB:', error) }); //conecta ao MongoDB

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Middleware para analisar o corpo das requisições como URL-encoded
app.use(express.urlencoded({ extended: true }));

// Rota GET para a url raiz do servidor
app.get('/', (req, res) => {
    res.send('API do Supermercado em execução'); //responde com uma mensagem simples"
});

// Rota para listar produtos (endpoint: GET /api/produtos)
// Quando o frontend chamar essa URL, ele receberá o JSON com os produtos e apresentará na tela.
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Product.find(); // Busca todos os produtos no banco de dados
        res.json(produtos); // .json() envia a lista como JSON contida na variável produtos
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: error.message }); //responde com status 500 e mensagem de erro
    }
});
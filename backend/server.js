const express = require('express'); //importa o módulo express
const app = express(); //cria uma aplicação express
const port = 3000; //define a porta onde o servidor irá rodar

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());
// Middleware para analisar o corpo das requisições como URL-encoded
app.use(express.urlencoded({ extended: true }));
// Rota GET para a url raiz do servidor
app.get('/', (req, res) => {
  res.send('API do Supermercado em execução'); //responde com uma mensagem simples"
});
// Rota para listar produtos (endpoint: GET /api/produtos)
// Quando o frontend chamar essa URL, ele receberá o JSON com os produtos.
app.get('/api/produtos', (req, res) => {
    res.json(produtos); // .json() envia a lista como JSON
});
// Inicia o servidor na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`); //mensagem no console quando o servidor iniciar
});
const produtos = [
    { id: 1, nome: 'Produto A', preco: 10.0 },
    { id: 2, nome: 'Produto B', preco: 20.0 },
    { id: 3, nome: 'Produto C', preco: 30.0 }
];


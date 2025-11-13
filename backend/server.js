// server.js - Servidor Express com CRUD e Conexão MongoDB. //

// Importação dos módulos necessários:
const express = require('express'); //importa o módulo express.
const cors = require('cors'); //importa o módulo cors para permitir requisições de diferentes origens.
const mongoose = require('mongoose'); //importa o mongoose para conectar ao MongoDB.

// DEVE SER FEITO ANTES DE LER AS VARIÁVEIS:
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo '.env'.

const mongo_uri = process.env.MONGO_URI //define a URI do MongoDB.
const port = process.env.PORT || 3000; //define a porta onde o servidor irá rodar.

const Product = require('./models/Product'); //importa o modelo Product.

// deve ser definido antes de ser usado no mongoose.connect().then().
const app = express(); //cria uma aplicação express.

// Configuração dos Middlewares:
app.use(cors()); // É um "selo de permissão" que permite que o seu site (em uma porta, ex: 5173) converse com o seu servidor (em outra porta, ex: 3000). Sem isso, o navegador bloqueia tudo

app.use(express.json()); // Permite que o Express entenda os dados (JSON) e leia o corpo das requisições como JSON.

// express.urlencoded() foi removido, pois não é necessário para APIs que trabalham com JSON e o Vue.js envia dados como form-urlencoded.

// Conexão ao MongoDB e inicialização do servidor.
mongoose.connect(mongo_uri)
.then(() => {
    console.log('✅ Conectado ao MongoDB');
    // Inicia o servidor na porta definida:
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`); //mensagem no console quando o servidor iniciar.
    });
}).catch((error) => { console.error('❌ Erro ao conectar ao MongoDB:', error) }); // mensagem de erro se não conseguir conectar ao MongoDB.


// As rotas da API serão definidas aqui, logo após a configuração do Express:

// Rota GET para a url raiz do servidor:
app.get('/', (req, res) => {
    res.send('API do Supermercado em execução'); //responde com uma mensagem simples"
});

// ------------------ READ ------------------ //

// Rota para listar produtos (endpoint: GET /api/produtos):
// Quando o frontend chamar essa URL, ele receberá o JSON com os produtos e apresentará na tela.
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Product.find(); // Busca todos os produtos no banco de dados Product.
        res.json(produtos); // .json() transforma os dados da resposta salva na variável produtos em JSON para poder ser trabalhado no frontend.
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: error.message }); //responde com status 500 e mensagem de erro
    }
});

// Rota para buscar um produto por ID (endpoint: GET /api/produtos/:id):
app.get('/api/produtos/:id', async (req, res) => {
    try {
        const produto = await Product.findById(req.params.id); // Busca o produto pelo ID fornecido na URL, que é acessado via req.params.id.
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' }) // Se o produto não for encontrado, responde com status 404 e mensagem de erro.
        }
        res.json(produto); // Se o produto for encontrado, responde com os dados do produto em JSON.
    }
    catch (error) {
        res.status(500).json({ message: error.message }); //responde com status 500 e mensagem de erro.
    }
});

// ------------------ CREATE ------------------ //

// Rota para criar um novo produto (endpoint: POST /api/produtos):
app.post('/api/produtos', async (req, res) => {
    const novoProduto = new Product({
        nome: req.body.nome,
        preco: req.body.preco,
        descricao: req.body.descricao,
        categoria: req.body.categoria,
        emEstoque: req.body.emEstoque,
        dataCriacao: Date.now()
    });
    try {
        const produtoSalvo = await novoProduto.save(); // Salva o novo produto no banco de dados.
        res.status(201).json(produtoSalvo); // Responde com status 201 (Criado) e os dados do produto salvo em JSON.
    } 
    catch (error) {
        res.status(400).json({ message: error.message }); //responde com status 400 e mensagem de erro.
    }
});

// ------------------ UPDATE ------------------ //

// Rota para atualizar um produto por ID (endpoint: PATCH /api/produtos/:id)
app.patch('/api/produtos/:id', async (req, res) => {
    try {
        const produtoAtualizado = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Opções para retornar o documento atualizado e rodar validações do schema.
        )
        if (!produtoAtualizado) {
            return res.status(404).json({ message: 'Produto não encontrado'}); // Se o produto não for encontrado, responde com status 404 e mensagem de erro.
        }
        res.json(produtoAtualizado); // Responde com os dados do produto atualizado em JSON.
    }
    catch (error) {
        res.status.apply(400).json({ message: error.message}); //responde com status 400 e mensagem de erro.
    }
});

// ------------------ DELETE ------------------ //

// Rota para deletar um produto por ID (endpoint: DELETE api/produtos/:id)
app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const produtoDeletado = await Product.findByIdAndDelete(req.params.id);
        if (!produtoDeletado) {
            return res.status(404).json({ message: 'Produto não encontrado' }); // Se o produto não for encontrado, responde com status 404 e mensagem de erro.
        }
        res.json({ message: 'Produto deletado com sucesso' }); // Responde com mensagem de sucesso.})
    }
    catch (error) {
        res.status(500).json({ message: error.message }); //responde com status 500 e mensagem de erro.})
    }
});
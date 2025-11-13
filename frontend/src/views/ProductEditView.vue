<script setup>
import { reactive, onMounted, ref } from 'vue'; // reactive: Usado para tornar objetos complexos reativos. onMounted: Hook do ciclo de vida do Vue.js. ref: Para variáveis simples.
import axios from 'axios'; // axios: Biblioteca para fazer chamadas HTTP.
import { useRoute, useRouter } from 'vue-router'; // Importa os hooks do Vue Router para acessar parâmetros da rota e navegação programática.

const route = useRoute(); // Hook para acessar parâmetros da rota atual.
const router = useRouter(); // Hook para navegação programática.
const API_URL = 'http://localhost:3000/api/produtos'; // URL da nossa API Express.

const produtoId = route.params.id; // ID do produto que vem da URL.

// Estado para carregar os dados e para o formulário:
const form = reactive({
    nome: '',
    preco: null, 
    categoria: '',
    descricao: '',
    emEstoque: true || false
});

const carregando = ref(true); // Estado de carregamento.
const mensagemFeedback = ref(''); // Mensagem de feedback reativa para o usuário.
const deuErro = ref(false); // Indica se houve um erro na submissão.

//FUNÇÃO PARA BUSCAR DADOS EXISTENTES (GET /api/produtos/:id):
async function carregarProduto() {
    try {
        // Chamada GET para carregar os dados existentes:
        const resposta = await axios.get(`${API_URL}/${produtoId}`);
        const produto = resposta.data;

        // Preenche o estado reativo do formulário com os dados do backend:
        form.nome = produto.nome;
        form.preco = produto.preco;
        form.categoria = produto.categoria;
        form.descricao = produto.descricao;
        form.emEstoque = produto.emEstoque;

    } catch (erro) {
        console.error("Erro ao carregar produto:", erro);
        mensagemFeedback.value = 'Erro ao carregar dados do produto para edição.';
        deuErro.value = true;
    } finally {
        carregando.value = false;
    }
}

// FUNÇÃO DE ATUALIZAÇÃO (PATCH /api/produtos/:id):
async function atualizarProduto() {
    mensagemFeedback.value = '';
    deuErro.value = false;

    try {
        // Chamada PATCH para enviar os dados atualizados:
        await axios.patch(`${API_URL}/${produtoId}`, form);
        
        mensagemFeedback.value = `Produto '${form.nome}' atualizado com sucesso!`;
        deuErro.value = false;

        setTimeout(() => {
            router.push({ name: 'produtos' });
        }, 1500);
        
    } catch (erro) {
        deuErro.value = true;
        const msg = erro.response?.data?.message || 'Erro de conexão ou validação.';
        mensagemFeedback.value = `Falha ao atualizar: ${msg}`;
    }
}

// Carregando os dados assim que a página de edição é aberta:
onMounted(carregarProduto); 
</script>

<template>
    <h2>Editar Produto</h2>
    <div v-if="carregando">
        <p>Carregando dados existentes...</p>
    </div>

    <div v-else>
        <div v-if="mensagemFeedback">{{ mensagemFeedback }}</div>

        <form @submit.prevent="atualizarProduto">
            
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="form.nome" required><br>

            <label for="preco">Preço (R$):</label>
            <input type="number" id="preco" v-model.number="form.preco" min="0.01" step="0.01" required><br>

            <label for="categoria">Categoria:</label>
            <input type="text" id="categoria" v-model="form.categoria"><br>

            <label for="descricao">Descrição:</label>
            <textarea id="descricao" v-model="form.descricao"></textarea><br>

            <label for="emEstoque">Em Estoque:</label>
            <input type="checkbox" id="emEstoque" v-model="form.emEstoque"><br>

            <button type="submit">Salvar Alterações</button>
            <RouterLink to="/">Cancelar</RouterLink>
        </form>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'; // ref: Torna a variável "reativa" (qualquer mudança atualiza o HTML). onMounted: Hook do ciclo de vida do Vue.js.
import axios from 'axios'; // axios: Nossa biblioteca para fazer chamadas HTTP para o backend.

// Aqui armazenaremos a lista de produtos recebida da API.
const produtos = ref([]); // Variável reativa para armazenar os produtos.
const carregando = ref(true); // Variável reativa para indicar o estado de carregamento.
const API_URL = 'http://localhost:3000/api/produtos'; // URL da nossa API Express.

// FUNÇÃO DE CHAMADA DA API:
async function buscarProdutos() {
    carregando.value = true;
    try {
        const resposta = await axios.get(API_URL); // // Chamada GET para a nossa API Express usando axios.
        produtos.value = resposta.data;  // Atribuímos o dado recebido (o Array JSON) ao nosso estado reativo.
    } catch (erro) { // Tratamento de erros na requisição.
        console.error("Erro ao buscar produtos:", erro);
        alert("Falha na conexão com a API. Verifique se o Node.js está rodando.");
    } finally { // O bloco finally sempre será executado, independentemente de ter ocorrido um erro ou não.
        carregando.value = false; // Definimos carregando como false, independentemente do sucesso ou falha da requisição.
    }
}

async function deletarProduto(id) { // Função para deletar um produto pelo ID.
    try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Produto deletado com sucesso!");
        buscarProdutos(); // Atualiza a lista de produtos após a exclusão.
    } catch (erro) {
        console.error("Erro ao deletar produto:", erro);
        alert("Falha na conexão com a API. Verifique se o Node.js está rodando.");
    }
}

// CICLO DE VIDA (Hook):
// onMounted: Esta função será executada imediatamente após o componente ser montado na tela.
onMounted(buscarProdutos); // Aqui chamamos nossa função de busca de produtos.
</script>

<template> <!-- Template do Vue.js para renderizar a interface. -->
    <h1>Seja bem vindo ao Supermercado!</h1>
    <h2>Listagem de Produtos</h2>
    <RouterLink to="/criar"><button>Cadastrar Novo Produto</button></RouterLink>
    <hr>
    <div v-if="carregando"> <!-- v-if: Se estiver carregando, mostra mensagem de carregamento -->
        <p>Carregando dados...</p> <!-- Mensagem de carregamento -->
    </div>

    <div v-else-if="produtos.length === 0"> <!-- v-else-if: Se não estiver carregando e não houver produtos -->
        <p>Nenhum produto cadastrado.</p> <!-- Mensagem quando não há produtos -->
    </div>

    <div v-else> <!-- v-else: Se não estiver carregando e houver produtos -->
        <!-- v-for: Loop do Vue.js para iterar sobre o array 'produtos' -->
        <!-- :key é obrigatório e usa o _id do MongoDB para otimização -->
        <div v-for="produto in produtos" :key="produto._id">
            <h3>{{ produto.nome }}</h3>
            <p>Preço: R$ {{ produto.preco.toFixed(2) }}</p> <!-- toFixed(2) formata o preço com 2 casas decimais -->
            <p>Categoria: {{ produto.categoria }}</p> 
            <p>Descrição: {{ produto.descricao }}</p>
            <p>Em Estoque: {{ produto.emEstoque }}</p>
            <!-- Link para Edição. O :to é uma "binding" para o Vue Router -->
            <button><RouterLink :to="`/editar/${produto._id}`">Editar</RouterLink></button>
            <button @click="deletarProduto(produto._id)">Deletar</button>
            <hr>
        </div>
    </div>
</template>
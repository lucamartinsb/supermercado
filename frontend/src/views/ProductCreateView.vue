<script setup>
import { reactive, ref } from 'vue'; // reactive: Usado para tornar objetos complexos reativos. ref: Para variáveis simples.
import axios from 'axios'; // axios: Biblioteca para fazer chamadas HTTP.
import { useRouter } from 'vue-router'; // Importa o hook do Vue Router para navegação programática.

const router = useRouter(); // Instancia o router que usaremos para redirecionamento após a criação do produto.
const API_URL = 'http://localhost:3000/api/produtos'; // URL da nossa API Express.

// ESTADO DO FORMULÁRIO (Reativo):
const form = reactive({ //
    nome: '',
    preco: null, 
    categoria: '',
    descricao: '',
    emEstoque: true || false // Novo campo para indicar se o produto está em estoque.
});

const mensagemFeedback = ref(''); // Mensagem de feedback reativa para o usuário.
const deuErro = ref(false); // Indica se houve um erro na submissão.

// FUNÇÃO DE SUBMISSÃO (POST):
async function submeterProduto() { 
    mensagemFeedback.value = ''; // Limpa a mensagem de feedback.
    deuErro.value = false; // Reseta o estado de erro.

    // A validação de required: true será feita pelo Mongoose no backend, mas fazemos uma checagem básica aqui também.
    if (!form.nome || form.preco <= 0 || form.preco === null) {
        mensagemFeedback.value = 'O Nome e o Preço são obrigatórios! O Preço deve ser maior que zero.'; 
        deuErro.value = true;
        return;
    }
    // TENTA ENVIAR O FORMULÁRIO PARA A API:
    try {
        await axios.post(API_URL, form); // O Axios envia o objeto 'form' no corpo da requisição POST para a API (Express).
        mensagemFeedback.value = `Produto '${form.nome}' criado com sucesso!`;
        deuErro.value = false;

        // Limpa o formulário e redireciona
        Object.assign(form, { nome: '', preco: null, categoria: '', descricao: '' });
        
        setTimeout(() => { // Aguarda 1.5 segundos antes de redirecionar...
            router.push({ name: 'produtos' }); // Volta para a lista de produtos.
        }, 1500);

    } catch (erro) {
        deuErro.value = true;
        // Pega a mensagem de erro do backend (se for um status 400 ou 500):
        const msg = erro.response?.data?.message || 'Erro de conexão ou validação no servidor.';
        mensagemFeedback.value = `Falha: ${msg}`;
    }
}
</script>

<template>
    <h2>Cadastrar Novo Produto</h2>
    <hr>
    <!-- Mensagem de Feedback Reativa: -->
    <div v-if="mensagemFeedback">{{ mensagemFeedback }}</div>

    <!-- @submit.prevent: Impede o comportamento padrão do HTML de recarregar a página: -->
    <form @submit.prevent="submeterProduto"> 

        <!-- for="nome" pega a referência do id do input. -->
        <label for="nome">Nome:</label>
        <!-- v-model: Liga o valor do input à propriedade 'nome' do objeto 'form' lá em cima: -->
        <input type="text" id="nome" v-model="form.nome" required><br> 

        <label for="preco">Preço (R$):</label>
        <!-- v-model.number garante que o Vue trate isso como número. min define o valor mínimo do campo e step define o incremento: -->
        <input type="number" id="preco" v-model.number="form.preco" min="0.01" step="0.01" required><br>

        <label for="categoria">Categoria:</label>
        <input type="text" id="categoria" v-model="form.categoria"><br>

        <label for="descricao">Descrição:</label>
        <textarea id="descricao" v-model="form.descricao"></textarea><br>

        <label for="emEstoque">Em Estoque:</label>
        <input type="checkbox" id="emEstoque" v-model="form.emEstoque"><br>
        
        <button type="submit">Salvar Produto</button>
    </form>
</template>
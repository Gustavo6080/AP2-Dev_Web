// Função que verifica se o usuário está logado
const isUserLoggedIn = () => {
    return sessionStorage.getItem('login') === 'true'; // Verifica se o login é verdadeiro no sessionStorage
}

// Função para mostrar mensagem de erro
const showErrorMessage = (message) => {
    document.body.innerHTML = `<h1 class="error-message">${message}</h1>`;
}

// Função para carregar os detalhes do atleta
const fetchAthleteData = async (id) => {
    const urlBase = "https://botafogo-atletas.mange.li/2024-1/"; // URL base para os detalhes do atleta
    const response = await fetch(`${urlBase}${id}`);
    
    if (!response.ok) {
        throw new Error("Erro ao buscar os dados do atleta");
    }

    return await response.json(); // Retorna os dados do atleta
}

// Função para montar a página com os dados do atleta
const mountAthletePage = (dados) => {
    const container = document.getElementById("container");
    container.innerHTML = ''; // Limpa o conteúdo atual

    // Adiciona nome do atleta
    const nome = document.createElement('h1');
    nome.innerText = dados.nome;
    nome.className = 'nome-content';
    container.appendChild(nome);

    // Cria o card do atleta
    const card = document.createElement('div');
    card.className = 'card';
    container.appendChild(card);

    // Adiciona imagem do atleta
    const imagem = document.createElement('img');
    imagem.src = dados.imagem;
    imagem.alt = `Imagem de ${dados.nome}`;
    imagem.className = 'imagem';
    card.appendChild(imagem);

    // Adiciona descrição do atleta
    const descricao = document.createElement('p');
    descricao.innerText = dados.detalhes;
    descricao.className = 'descricao';
    card.appendChild(descricao);

    // Adiciona estatísticas
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';
    card.appendChild(statsContainer);

    const nJogos = document.createElement('p');
    nJogos.innerText = `Número de jogos: ${dados.n_jogos}`;
    statsContainer.appendChild(nJogos);

    const elenco = document.createElement('p');
    elenco.innerText = `Elenco: ${dados.elenco}`;
    statsContainer.appendChild(elenco);

    const altura = document.createElement('p');
    altura.innerText = `Altura: ${dados.altura}`;
    statsContainer.appendChild(altura);

    // Botão para voltar à página inicial
    const botaoVoltar = document.createElement('button');
    botaoVoltar.innerText = 'Voltar';
    botaoVoltar.className = 'botao-voltar';
    botaoVoltar.onclick = () => window.location.href = 'index.html'; // Redireciona para a página inicial
    container.appendChild(botaoVoltar);
}

// Função principal que verifica login e ID
const initPage = async () => {
    // Verifica se o usuário está logado
    if (!isUserLoggedIn()) {
        showErrorMessage("Você precisa estar logado para acessar os detalhes.");
        return;
    }

    // Recupera o ID da URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id")); // Obtém o ID da URL

    // Verifica se o ID é válido
    if (isNaN(id) || id < 1) {
        showErrorMessage("ID inválido.");
        return;
    }

    try {
        // Carrega os dados do atleta
        const athleteData = await fetchAthleteData(id);
        mountAthletePage(athleteData); // Monta a página com os dados
    } catch (error) {
        showErrorMessage("Erro ao carregar os dados do atleta.");
    }
}

// Inicializa a página ao carregar
document.addEventListener('DOMContentLoaded', initPage);

const isUserLoggedIn = () => {
    return sessionStorage.getItem('login') === 'true';
}

const showErrorMessage = (message) => {
    document.body.innerHTML = `<h1 class="error-message">${message}</h1>`;
}

const fetchAthleteData = async (id) => {
    const urlBase = "https://botafogo-atletas.mange.li/2024-1/";
    const response = await fetch(`${urlBase}${id}`);
    
    if (!response.ok) {
        throw new Error("Erro ao buscar os dados do atleta");
    }

    return await response.json();
}

const mountAthletePage = (dados) => {
    const container = document.getElementById("container");
    container.innerHTML = '';

    const nome = document.createElement('h1');
    nome.innerText = dados.nome;
    nome.className = 'nome-content';
    container.appendChild(nome);

    const card = document.createElement('div');
    card.className = 'card';
    container.appendChild(card);

    const imagem = document.createElement('img');
    imagem.src = dados.imagem;
    imagem.alt = `Imagem de ${dados.nome}`;
    imagem.className = 'imagem';
    card.appendChild(imagem);

    const descricao = document.createElement('p');
    descricao.innerText = dados.detalhes;
    descricao.className = 'descricao';
    card.appendChild(descricao);

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

    const botaoVoltar = document.createElement('button');
    botaoVoltar.innerText = 'Voltar';
    botaoVoltar.className = 'botao-voltar';
    botaoVoltar.onclick = () => window.location.href = 'atletas.html';
    container.appendChild(botaoVoltar);
}

const initPage = async () => {
    if (!isUserLoggedIn()) {
        showErrorMessage("Você precisa estar logado para acessar os detalhes.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    if (isNaN(id) || id < 1) {
        showErrorMessage("ID inválido.");
        return;
    }

    try {
        const athleteData = await fetchAthleteData(id);
        mountAthletePage(athleteData);
    } catch (error) {
        showErrorMessage("Erro ao carregar os dados do atleta.");
    }
}

document.addEventListener('DOMContentLoaded', initPage);

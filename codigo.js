const app = {
    baseUrl: "https://botafogo-atletas.mange.li/2024-1/",

    init: () => {
        document.addEventListener('DOMContentLoaded', () => {
            app.setupEventListeners();
            app.auth.checkLogin();
            app.athletes.initAthleteSelection();
        });
    },

    setupEventListeners: () => {
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.onsubmit = app.auth.handleLogin;
        }
    },

    auth: {
        checkLogin: () => {
            if (sessionStorage.getItem('login')) {
                app.auth.redirectToDashboard();
            }
        },

        handleLogin: (event) => {
            event.preventDefault();

            const passwordInput = document.getElementById("password");
            const password = passwordInput.value;
            passwordInput.value = "";

            if (hex_sha256(password) === "ded6a687514227ff822d40bd397f30f5ae9132487ad6c846599131c740d784f0") {
                sessionStorage.setItem('login', true);
                app.auth.redirectToDashboard();
            } else {
                alert("Senha incorreta");
            }
        },

        redirectToDashboard: () => {
            window.location.href = "atletas.html";
        }
    },

    athletes: {
        initAthleteSelection: () => {
            const elencoSelect = document.getElementById("elenco-select");
            if (elencoSelect) {
                elencoSelect.onchange = () => {
                    const value = elencoSelect.value;
                    app.athletes.fetchAthletes(value);
                };
            }

            // Adicionando o evento de pesquisa
            const searchInput = document.getElementById("search-input");
            if (searchInput) {
                searchInput.oninput = () => {
                    const searchValue = searchInput.value.toLowerCase();
                    app.athletes.filterAthletes(searchValue);
                };
            }
        },

        fetchAthletes: async (category) => {
            const url = `${app.baseUrl}${category}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                app.athletes.displayAthletes(data);
                app.athletes.allAthletes = data; // Armazenando todos os atletas para realizar a filtragem
            } catch (error) {
                console.error("Erro ao buscar atletas:", error);
            }
        },

        filterAthletes: (searchTerm) => {
            const filteredAthletes = app.athletes.allAthletes.filter((athlete) => {
                return athlete.nome.toLowerCase().includes(searchTerm);
            });
            app.athletes.displayAthletes(filteredAthletes);
        },

        displayAthletes: (athletes) => {
            const athleteList = document.getElementById("athlete-list");
            athleteList.innerHTML = ""; // Limpa a lista antes de adicionar novos atletas
        
            athletes.forEach((athlete) => {
                const athleteCard = document.createElement("div");
                athleteCard.className = "athlete-card";
        
                athleteCard.innerHTML = `
                    <h3>${athlete.nome}</h3>
                    <img src="${athlete.imagem}" alt="Imagem do atleta ${athlete.nome}" />
                `;
        
                // Adiciona o evento de clique para redirecionar para a página de detalhes
                athleteCard.addEventListener("click", () => {
                    // Redireciona para a página de detalhes com o ID do atleta na URL
                    window.location.href = `detalhes.html?id=${athlete.id}`;
                });
        
                athleteList.appendChild(athleteCard);
            });
        }
    }
};

// Inicializa o aplicativo
app.init();

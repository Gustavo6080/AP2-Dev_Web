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
                let timeout;
                elencoSelect.onchange = () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        const value = elencoSelect.value;
                        app.athletes.fetchAthletes(value);
                    }, 300);
                };
            }

            const searchInput = document.getElementById("search-input");
            if (searchInput) {
                let timeout;
                searchInput.oninput = () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        const searchValue = searchInput.value.toLowerCase();
                        app.athletes.filterAthletes(searchValue);
                    }, 300);
                };
            }
        },

        fetchAthletes: async (category) => {
            const url = `${app.baseUrl}${category}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                app.athletes.displayAthletes(data);
                app.athletes.allAthletes = data;
            } catch (error) {
                console.error("Erro ao buscar atletas:", error);
            }
        },

        filterAthletes: (searchTerm) => {
            if (!app.athletes.allAthletes) return;
            const filteredAthletes = app.athletes.allAthletes.filter((athlete) => {
                return athlete.nome.toLowerCase().includes(searchTerm);
            });
            app.athletes.displayAthletes(filteredAthletes);
        },

        displayAthletes: (athletes) => {
            const athleteList = document.getElementById("athlete-list");
            athleteList.innerHTML = "";

            const fragment = document.createDocumentFragment();
            athletes.forEach((athlete) => {
                const athleteCard = document.createElement("div");
                athleteCard.className = "athlete-card";

                athleteCard.innerHTML = `
                    <h3>${athlete.nome}</h3>
                    <img src="${athlete.imagem}" loading="lazy" alt="Imagem do atleta ${athlete.nome}" />
                `;

                athleteCard.addEventListener("click", () => {
                    window.location.href = `detalhes.html?id=${athlete.id}`;
                });

                fragment.appendChild(athleteCard);
            });

            athleteList.appendChild(fragment);
        }
    }
};

app.init();

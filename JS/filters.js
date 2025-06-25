//Filtros
let filtroAtual = {
    tipo: null,
    valor: null
};

//Ordem Alfabetica Normal
function alfabeticoUp() {
    filtroAtual = { tipo: "alfabetico", valor: "asc" };
    const gamesOrdered = (JSON.parse(localStorage.getItem('jogos')) || [])
        .sort((a, b) => a.name.localeCompare(b.name));
    orderNewGame(gamesOrdered);
}

//Ordem Alfabetica reversa
function alfabeticoDown() {
    filtroAtual = { tipo: "alfabetico", valor: "desc" };
    const gamesOrdered = (JSON.parse(localStorage.getItem('jogos')) || [])
        .sort((a, b) => b.name.localeCompare(a.name));
    orderNewGame(gamesOrdered);
}

//Filtro por status
function orderByStatus(statusFiltro) {
    filtroAtual = { tipo: "status", valor: statusFiltro };
    const games = JSON.parse(localStorage.getItem('jogos')) || [];
    const filteredGames = games.filter(jogo => {
        const gameStatus = localStorage.getItem(`gameStatus-${jogo.name}`);
        return gameStatus === statusFiltro;
    });
    orderNewGame(filteredGames);
}

//Ordenação dos divs com animação
function orderNewGame(games) {
    const container = document.getElementById('container');
    const currentCards = Array.from(container.children);

    currentCards.forEach(card => {
        card.classList.add('saindo');
    });

    setTimeout(() => {
        container.innerHTML = "";

        games.forEach(jogo => {
            const div = document.createElement('div');
            div.className = "card entrando";
            div.setAttribute("game-name", jogo.name);
            div.style.marginTop = "30px";
            div.style.backgroundImage = jogo.background;
            div.style.backgroundSize = "cover";
            div.style.backgroundPosition = "center";
            div.style.setProperty('--after-content', `"${jogo.name}"`);

            const gameStatus = localStorage.getItem(`gameStatus-${jogo.name}`);
            div.style.borderColor = {
                "Estou Jogando": "orange",
                "Quero Jogar": "blue",
                "Já Joguei": "green"
            }[gameStatus] || "white";

            div.addEventListener("click", () => {
                window.location.href = "gamePage.html?name=" + encodeURIComponent(jogo.name) + "&background=" + encodeURIComponent(jogo.background);
            });

            container.appendChild(div);

            setTimeout(() => {
                div.classList.remove('entrando');
            }, 10);
        });

    }, 400);
}

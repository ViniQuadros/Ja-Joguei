const apiKey = "8115b43cfa9648f7a6680b7e4af424b0"; //Chave da API

function findGame(gameName) {
    const container = document.getElementById("gameList");
    container.innerHTML = "";

    if (gameName.trim() === "") return;

    try {
        fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=${apiKey}`)
            .then(response => {
                if (!response.ok) throw new Error("Erro ao buscar jogos");
                return response.json();
            })
            .then(data => {
                if (data.results.length > 0) {
                    data.results.forEach(game => {
                        const input = document.getElementById("input");
                        const list = document.getElementById("gameList");
                        const item = document.createElement("li");
                        list.classList.add("show");
                        item.textContent = game.name;
                        item.classList.add("game-item");

                        const imgUrl = game.background_image;
                        const card = document.getElementById("card");

                        //Muda valores de texto para o nome do jogo clicado e a capa do card
                        item.addEventListener("click", () => {
                            input.value = item.textContent;
                            document.querySelector('.card').style.setProperty('--after-content', `"${item.textContent}"`);
                            card.style.backgroundImage = "url('" + imgUrl + "')";
                            card.style.backgroundSize = "cover";
                            card.style.backgroundPosition = "center";
                            card.style.backgroundRepeat = "no-repeat";
                        });
                        container.appendChild(item);
                    });
                } else {
                    const item = document.createElement("li");
                    item.textContent = "Jogo não encontrado";
                    item.classList.add("game-item");
                    container.appendChild(item);
                }
            })
            .catch(error => {
                const item = document.createElement("li");
                item.textContent = "Erro: " + error.message;
                container.appendChild(item);
            });
    } catch (error) {
        alert();
    }
}

function addNewGamePage() {
    window.location.href = "addGame.html"
}

function addGame() {
    const cardGame = document.getElementById("input").value;
    const bg = document.getElementById("card").style.backgroundImage;

    let games = JSON.parse(localStorage.getItem("jogos")) || []
    games.push({ name: cardGame, background: bg });

    localStorage.setItem("jogos", JSON.stringify(games));

    window.location.href = "personalPage.html";
}

function getNewGame() {
    const games = JSON.parse(localStorage.getItem("jogos")) || [];

    games.forEach(jogo => {
        const div = document.createElement("div");
        div.className = "card";
        div.id = "card";
        div.style.marginTop = "30px";
        div.style.backgroundImage = jogo.background;
        div.style.backgroundSize = "cover";
        div.style.backgroundPosition = "center";
        div.style.setProperty('--after-content', `"${jogo.name}"`);

        div.addEventListener("click", () => {
            window.location.href = "gamePage.html?name=" + encodeURIComponent(jogo.name) + "&background=" + encodeURIComponent(jogo.background);
        });

        document.getElementById("container").appendChild(div);
    });
}

function getGamePage() {
    const params = new URLSearchParams(window.location.search);
    const jogo = params.get("name");
    const background = params.get("background");

    const title = document.getElementById("gameTitle");
    title.textContent = jogo;

    const div = document.createElement("div");
    div.className = "cardUnique";
    div.id = "cardUnique";
    div.style.marginTop = "30px";
    div.style.backgroundImage = background;
    div.style.backgroundSize = "cover";
    div.style.backgroundPosition = "center";

    document.getElementById("imageContainer").appendChild(div);
}

function changeStatus(clickedButton) {
    const buttons = document.querySelectorAll('.status');
    const params = new URLSearchParams(window.location.search);
    const jogo = params.get("name");

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    clickedButton.classList.add('active');
    localStorage.setItem(`gameStatus-${jogo}`, clickedButton.textContent.trim());
}

function loadStatus() {
    const buttons = document.querySelectorAll('.status');
    const params = new URLSearchParams(window.location.search);
    const jogo = params.get("name");
    const gameStatus = localStorage.getItem(`gameStatus-${jogo}`);

    if (gameStatus) {
        buttons.forEach(button => {
            if (button.textContent.trim() === gameStatus) {
                button.classList.add('active');
            }
            else {
                button.classList.remove('active');
            }
        });
    }
}

function removeGame() {
    const gameTitle = document.getElementById("gameTitle");
    const games = JSON.parse(localStorage.getItem("jogos"));

    //Remove o comentário do jogo
    const params = new URLSearchParams(window.location.search);
    const jogo = params.get("name");
    const savedComment = localStorage.getItem('userComment' + jogo);
    if (savedComment) {
        localStorage.removeItem('userComment' + jogo);
    }

    //Remove a avaliação do jogo
    document.querySelectorAll('.gameGrade').forEach(section => {
        const category = section.querySelector('h3').textContent;
        localStorage.removeItem(`rating-${category}`);

        const stars = section.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.remove('selected');
        });
    });

    //Remove o jogo da lista
    const index = games.findIndex(jogo => jogo.name === gameTitle.textContent);
    if (index !== -1) {
        games.splice(index, 1);
    }
    localStorage.setItem("jogos", JSON.stringify(games));

    window.location.href = "personalPage.html";
}

function getTotal() {
    const total = document.getElementById("total");
    total.textContent = "Jogos: " + (JSON.parse(localStorage.getItem("jogos")) || []).length;
}

async function getGameDevelopers() {
    const empresas = document.getElementById("empresas");
    empresas.innerHTML = "";
    const jogos = JSON.parse(localStorage.getItem("jogos")) || [];
    const desenvolvedores = new Set();

    for (const jogo of jogos) {
        try {
            const searchResponse = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(jogo.name)}&key=${apiKey}`);
            if (!searchResponse.ok) {
                throw new Error("Erro ao buscar jogo");
            }

            const searchData = await searchResponse.json();
            const game = searchData.results[0];
            if (!game) {
                continue;
            }

            const gameDetailsResponse = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${apiKey}`);
            if (!gameDetailsResponse.ok) {
                throw new Error("Erro ao buscar detalhes do jogo");
            }

            const gameDetails = await gameDetailsResponse.json();

            gameDetails.developers.forEach(dev => {
                if (!desenvolvedores.has(dev.name)) {
                    desenvolvedores.add(dev.name);
                }
            })
        } catch (error) {
            const item = document.createElement("li");
            item.textContent = `Erro com jogo "${jogo.name}": ${error.message}`;
            empresas.appendChild(item);
        }
    }

    desenvolvedores.forEach(dev => {
        const item = document.createElement("li");
        item.textContent = dev;
        item.classList.add("game-item");
        empresas.appendChild(item);
    })
}

async function getGameTags() {
    const tags = document.getElementById("tags");
    empresas.innerHTML = "";
    const jogos = JSON.parse(localStorage.getItem("jogos")) || [];
    const gameTags = new Set();

    for (const jogo of jogos) {
        try {
            const searchResponse = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(jogo.name)}&key=${apiKey}`);
            if (!searchResponse.ok) {
                throw new Error("Erro ao buscar jogo");
            }

            const searchData = await searchResponse.json();
            const game = searchData.results[0];
            if (!game) {
                continue;
            }

            const gameDetailsResponse = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${apiKey}`);
            if (!gameDetailsResponse.ok) {
                throw new Error("Erro ao buscar detalhes do jogo");
            }

            const gameDetails = await gameDetailsResponse.json();

            gameDetails.tags.forEach(tag => {
                gameTags.add(tag.name);
            })
        } catch (error) {
            const item = document.createElement("li");
            item.textContent = `Erro com jogo "${tag.name}": ${error.message}`;
            tags.appendChild(item);
        }
    }

    gameTags.forEach(tag => {
        const item = document.createElement("li");
        item.textContent = tag;
        item.classList.add("game-item");
        tags.appendChild(item);
    })
}
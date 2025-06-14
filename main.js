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

        const gameStatus = localStorage.getItem(`gameStatus-${jogo.name}`);
        if (gameStatus === "Estou Jogando") {
            div.style.borderColor = "orange";
        }
        else if (gameStatus === "Quero Jogar") {
            div.style.borderColor = "blue";
        }
        else if (gameStatus === "Já Joguei") {
            div.style.borderColor = "green";
        }
        else {
            div.style.borderColor = "white";
        }

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
    const devSet = new Set();

    const requests = jogos.map(async (jogo) => {
        try {
            const searchRes = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(jogo.name)}&key=${apiKey}`);
            if (!searchRes.ok) throw new Error("Erro ao buscar jogo");

            const searchData = await searchRes.json();
            const game = searchData.results[0];
            if (!game) return;

            const detailsRes = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${apiKey}`);
            if (!detailsRes.ok) throw new Error("Erro ao buscar detalhes");

            const gameDetails = await detailsRes.json();
            gameDetails.developers.forEach(dev => devSet.add(dev.name));
        } catch (error) {
            const li = document.createElement("li");
            li.textContent = `Erro com jogo "${jogo.name}": ${error.message}`;
            li.classList.add("game-item");
            empresas.appendChild(li);
        }
    });

    await Promise.all(requests);

    for (const dev of devSet) {
        const li = document.createElement("li");
        li.textContent = dev;
        li.classList.add("game-item");
        empresas.appendChild(li);
    }
}


async function getGameTags() {
    const tagsElement = document.getElementById("tags");
    const empresas = document.getElementById("empresas");
    tagsElement.innerHTML = "";
    empresas.innerHTML = "";

    const jogos = JSON.parse(localStorage.getItem("jogos")) || [];
    const tagSet = new Set();

    const requests = jogos.map(async (jogo) => {
        try {
            const searchRes = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(jogo.name)}&key=${apiKey}`);
            if (!searchRes.ok) throw new Error("Erro ao buscar jogo");

            const searchData = await searchRes.json();
            const game = searchData.results[0];
            if (!game) return;

            const detailsRes = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${apiKey}`);
            if (!detailsRes.ok) throw new Error("Erro ao buscar detalhes");

            const gameDetails = await detailsRes.json();
            gameDetails.tags.forEach(tag => tagSet.add(tag.name));
        } catch (error) {
            const li = document.createElement("li");
            li.textContent = `Erro com jogo "${jogo.name}": ${error.message}`;
            li.classList.add("game-item");
            tagsElement.appendChild(li);
        }
    });

    await Promise.all(requests);

    for (const tag of tagSet) {
        const li = document.createElement("li");
        li.textContent = tag;
        li.classList.add("game-item");
        tagsElement.appendChild(li);
    }
}


async function getGameGenres() {
    const tags = document.getElementById("tags");
    tags.innerHTML = "";

    const jogos = JSON.parse(localStorage.getItem("jogos")) || [];
    const genreCount = {};

    const requests = jogos.map(async (jogo) => {
        try {
            const searchRes = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(jogo.name)}&key=${apiKey}`);
            if (!searchRes.ok) throw new Error("Erro ao buscar jogo");

            const searchData = await searchRes.json();
            const game = searchData.results[0];
            if (!game) return;

            const detailsRes = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${apiKey}`);
            if (!detailsRes.ok) throw new Error("Erro ao buscar detalhes");

            const details = await detailsRes.json();
            details.genres.forEach(genre => {
                genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
            });
        } catch (error) {
            const li = document.createElement("li");
            li.textContent = `Erro com "${jogo.name}": ${error.message}`;
            li.classList.add("game-item");
            tags.appendChild(li);
        }
    });

    await Promise.all(requests);

    const fragment = document.createDocumentFragment();
    Object.entries(genreCount).forEach(([genre]) => {
        const li = document.createElement("li");
        li.textContent = genre;
        li.classList.add("game-item");
        fragment.appendChild(li);
    });
    tags.appendChild(fragment);

    const colors = Object.keys(genreCount).map((_, i) =>
        `hsl(${(i * 360 / Object.keys(genreCount).length)}, 70%, 60%)`
    );

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(genreCount),
            datasets: [{
                data: Object.values(genreCount),
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

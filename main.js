const apiKey = ""; //Chave da API

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
                        const item = document.createElement("li");
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
    games.push({name: cardGame, background: bg});

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
        document.getElementById("container").appendChild(div);
    });
}
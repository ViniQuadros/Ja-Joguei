//Ao carregar a página de jogos, carrega todas as informações das avaliações
document.querySelectorAll('.star-rating').forEach((container, ratingIndex) => {
  const stars = container.querySelectorAll('.star');
  const params = new URLSearchParams(window.location.search);
  const jogo = params.get("name");
  const ratingTypes = ["nota", "historia", "gameplay"];

  let type = ratingTypes[ratingIndex];

  const savedRating = localStorage.getItem(`rating_${jogo}_${type}`);
  if (savedRating !== null) {
    stars.forEach((s, i) => {
      s.classList.toggle('selected', i < savedRating);
    });
  }

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => {
      stars.forEach((s, i) => {
        s.classList.toggle('hover', i <= index);
      });
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
      stars.forEach((s, i) => {
        s.classList.toggle('selected', i <= index);
      });

      localStorage.setItem(`rating_${jogo}_${type}`, index + 1);
    });
  });
});

//Escreve o comentário no input
function writeComment() {
  const commentInput = document.getElementById('commentInput');
  const params = new URLSearchParams(window.location.search);
  const jogo = params.get("name");
  localStorage.setItem('userComment' + jogo, commentInput.value);
}

//Carrega o comentário salvo
function loadRating() {
  const commentInput = document.getElementById('commentInput');
  const params = new URLSearchParams(window.location.search);
  const jogo = params.get("name");
  const savedComment = localStorage.getItem('userComment' + jogo);
  if (savedComment) {
    commentInput.value = savedComment;
  }
}

//Retorna para a página pessoal
function goBack() {
  window.location.href = "personalPage.html";
}
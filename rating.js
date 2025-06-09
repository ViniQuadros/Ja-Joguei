const stars = document.querySelectorAll('.star');
let currentRating = 0;

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
    currentRating = index;
    stars.forEach((s, i) => {
      s.classList.toggle('selected', i <= currentRating);
    });
  });
});


function writeComment() {
  const commentInput = document.getElementById('commentInput');
    const params = new URLSearchParams(window.location.search);
  const jogo = params.get("name");
  localStorage.setItem('userComment' + jogo, commentInput.value);
}

function loadComment() {
  const commentInput = document.getElementById('commentInput');
  const params = new URLSearchParams(window.location.search);
  const jogo = params.get("name");
  const savedComment = localStorage.getItem('userComment' + jogo);
  if (savedComment) {
    commentInput.value = savedComment;
  }
}
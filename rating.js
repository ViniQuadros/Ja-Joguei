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

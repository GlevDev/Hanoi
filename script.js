const tour1Cont = document.getElementById('tour1-container');
const tour2Cont = document.getElementById('tour2-container');
const tour3Cont = document.getElementById('tour3-container');
const startButton = document.getElementById('start');
const textAnneaux = document.getElementById('text-anneaux');
const slider = document.getElementById('slider');

let nbrAnneaux = 7;
let nbrOptimal = Math.pow(2, nbrAnneaux) - 1;
let dragged;
let nbrCoups = 0;

start();

// On cleane tout et on démarre sur une nouvelle partie
function start() {
  clean();
  addRings();
  addTopDrag();
  eventListener();
}

// Enlève les anneaux du DOM et on reinitialise le compteur de coups
function clean() {
  const items = document.querySelectorAll('foreignObject');
  items.forEach((item) => {
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  });
  nbrCoups = 0;
}

// Initialise la première tour avec les x anneaux
function addRings() {
  for (let el = 1; el <= nbrAnneaux; el++) {
    const width = 180 - (nbrAnneaux - el) * (36 - 2 * nbrAnneaux);
    const left = (nbrAnneaux - el) * (18 - nbrAnneaux) + 10;
    const bottom = (nbrAnneaux - el) * 20;
    const div = document.createElement('div');
    div.classList.add('anneau');
    div.textContent = el;
    div.style.width = `${width}px`;
    div.style.left = `${left}px`;
    div.style.bottom = `${bottom}px`;
    tour1Cont.appendChild(div);
  }
  // anneaux.forEach((el, index) => {
  //   const width = 60 + index * 20;
  //   const left = 70 - 10 * index;
  //   const bottom = 20 * (6 - index);
  //   const div = document.createElement('div');
  //   div.classList.add('anneau');
  //   div.textContent = el.num;
  //   div.style.width = `${width}px`;
  //   div.style.left = `${left}px`;
  //   div.style.bottom = `${bottom}px`;
  //   tour1Cont.appendChild(div);
  // });
}

// Ajoute la possibilité aux anneaux en haut de chacune des tours d'être déplacés
function addTopDrag() {
  const items = document.querySelectorAll('foreignObject');
  items.forEach((item) => {
    const el = item.firstElementChild;
    if (el) {
      el.classList.add('draggable');
      el.setAttribute('draggable', true);
      el.addEventListener('dragstart', (event) => {
        dragged = event.target;
      });
    }
  });
}

// On vérifie les condition de victoire
function endGame() {
  const nbrChildT2 = tour2Cont.childElementCount;
  const nbrChildT3 = tour3Cont.childElementCount;
  if (nbrChildT2 === +nbrAnneaux || nbrChildT3 === +nbrAnneaux) {
    alert(
      `Vous avez gagné en ${nbrCoups} coups. Le nombre optimal est de ${nbrOptimal} coups.`
    );
    // Si la victoire est acquise, on désactive la possibilité de déplacer des pièces
    const items = document.querySelectorAll('foreignObject');
    items.forEach((item) => {
      const el = item.firstElementChild;
      if (el) {
        el.classList.remove('draggable');
        el.setAttribute('draggable', false);
      }
    });
  }
}

// Actions lorsqu'on relache un anneau sur une tour
function dragDrop(event) {
  this.classList.remove('over');
  event.preventDefault();
  const nbrChild = this.childElementCount;
  const draggedValue = +dragged.textContent;
  // Les actions ne s'appliquent que si on change de tour ET que la tour est vide ou si le premier élément de cette tour est de taille supérieure à l'élément déplacé
  if (
    dragged.closest('foreignObject') !== this &&
    (nbrChild === 0 || +this.firstElementChild.textContent > draggedValue)
  ) {
    // La pièce déplacée est positionnée à la bonne hauteur et on retire l'anneau de la tour initiale
    const bottom = 20 * nbrChild;
    dragged.style.bottom = `${bottom}px`;
    dragged.parentNode.removeChild(dragged);
    // On enlève la possibilité de déplacer une pièce qui ne se trouverait plus en tête de pile
    if (nbrChild !== 0) {
      this.firstElementChild.classList.remove('draggable');
      this.firstElementChild.setAttribute('draggable', false);
    }
    // On ajoute l'anneau à la tour ciblée
    this.prepend(dragged);
    
    setTimeout(() => {
      addTopDrag();
      nbrCoups++;
      endGame();
    }, 100);
  }
}

function eventListener() {
  const items = document.querySelectorAll('foreignObject');

  items.forEach((item) => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });

  startButton.addEventListener('click', start);

  slider.addEventListener('change', () => {
    nbrAnneaux = slider.value;
    nbrOptimal = Math.pow(2, nbrAnneaux) - 1;
    textAnneaux.textContent = `${nbrAnneaux} anneaux`;
    start();
  })
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

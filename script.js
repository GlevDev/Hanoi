const tour1Cont = document.getElementById('tour1-container');
const tour2Cont = document.getElementById('tour2-container');
const tour3Cont = document.getElementById('tour3-container');

const anneaux = [
  { num: 1 },
  { num: 2 },
  { num: 3 },
  { num: 4 },
  { num: 5 },
  { num: 6 },
  { num: 7 },
];
let dragged;

start();

function start() {
  addRings();
  addTopDrag();
  eventListener();
}

// Initialise la première tour avec les 7 anneaux
function addRings() {
  anneaux.forEach((el, index) => {
    const width = 60 + index * 20;
    const left = 70 - 10 * index;
    const bottom = 20 * (6 - index);
    const div = document.createElement('div');
    div.classList.add('anneau');
    div.textContent = el.num;
    div.style.width = `${width}px`;
    div.style.left = `${left}px`;
    div.style.bottom = `${bottom}px`;
    tour1Cont.appendChild(div);
  });
}

// Ajoute la possibilité aux anneaux en haut de chacune des tours d'être déplacés
function addTopDrag() {
  const items = document.querySelectorAll('foreignObject');
  items.forEach((item) => {
    const el = item.firstElementChild;
    if (el) {
      el.classList.add('draggable');
      el.setAttribute('draggable', true);
      console.log(el);
      el.addEventListener('dragstart', (event) => {
        dragged = event.target;
      });
    }
  });
}

function eventListener() {
  const items = document.querySelectorAll('foreignObject');

  items.forEach((item) => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(event) {
  this.classList.remove('over');
  event.preventDefault();
  const nbrChild = this.childElementCount;
  const draggedValue = +dragged.textContent;
  if (
    dragged.closest('foreignObject') !== this &&
    (nbrChild === 0 || +this.firstElementChild.textContent > draggedValue)
  ) {
    const bottom = 20 * nbrChild;
    dragged.style.bottom = `${bottom}px`;
    dragged.parentNode.removeChild(dragged);
    if (nbrChild !== 0) {
      this.firstElementChild.classList.remove('draggable');
      this.firstElementChild.setAttribute('draggable', false);
    }
    this.prepend(dragged);
    addTopDrag();
  }
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

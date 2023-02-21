const newElement = (tagName, className) => {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
};

function Barreira(reverse = false) {
  this.element = newElement('div', 'barreira');

  const borda = newElement('div', 'borda');
  const corpo = newElement('div', 'corpo');
  this.element.appendChild(reverse ? corpo : borda);
  this.element.appendChild(reverse ? borda : corpo);

  this.setAltura = altura => corpo.style.height = `${altura}px`;
};

function ParBarreira(height, opening, x) {
  this.element = newElement('div', 'par-barreira');

  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.element.appendChild(this.superior.element);
  this.element.appendChild(this.inferior.element);
};
// const barreira = new Barreira(true);
// barreira.setAltura(200);
// document.querySelector('[flappy]').appendChild(barreira.element);
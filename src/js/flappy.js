const newElement = (tagName, className) => {
  //Função para criar elementos
  const element = document.createElement(tagName);
  element.className = className;
  return element;
};

function Barreira(reverse = false) {
  //Função construtora para criar um elemento barreira
  this.element = newElement('div', 'barreira');

  const borda = newElement('div', 'borda');
  const corpo = newElement('div', 'corpo');
  this.element.appendChild(reverse ? corpo : borda);
  this.element.appendChild(reverse ? borda : corpo);

  this.setAltura = altura => corpo.style.height = `${altura}px`;
};

function ParBarreira(height, opening, x) {
  //Função construtora para criar o par das barreiras
  this.element = newElement('div', 'par-barreira');

  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.element.appendChild(this.superior.element);
  this.element.appendChild(this.inferior.element);

  this.sotearAbertura = () => {
    const alturaSuperior = Math.random() * (height - opening);
    const alturaInferior = height - opening - alturaSuperior;
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  this.getX = () => parseInt(this.element.style.left.split('px')[0]);
  this.setX = x => this.element.style.left = `${x}px`;
  this.getLargura = () => this.element.clientWidth;

  this.sotearAbertura();
  this.setX(x);
};

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  //Função construtora para criar a quantidade desejada de barreiras no jogo e as regras relacionado ao comportamento das barreiras no jogo
  this.pares = [
    new ParBarreira(altura, abertura, largura),
    new ParBarreira(altura, abertura, largura + espaco),
    new ParBarreira(altura, abertura, largura + espaco * 2),
    new ParBarreira(altura, abertura, largura + espaco * 3)
  ];

  const deslocamento = 3;
  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento);

      //Quando o elemento sair da área do jogo
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length);
        par.sotearAbertura();
      };

      const meio = largura / 2;
      const cruzouMeio = par.getX() + deslocamento >= meio
        && par.getX() < meio
      cruzouMeio && notificarPonto();
    });
  };
};

function Passaro(alturaJogo) {
  let voando = false;

  this.element = newElement('img', 'passaro');
  this.element.src = '../src/assets/images/passaro.png';

  this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
  this.setY = y => this.element.style.bottom = `${y}px`;

  window.onkeydown = e => voando = true;
  window.onkeyup = e => voando = false;

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5);
    const alturaMax = alturaJogo - this.element.clientHeight;

    if (novoY <= 0) {
      this.setY(0);
    } else if (novoY >= alturaMax) {
      this.setY(alturaMax);
    } else {
      this.setY(novoY);
    };
  };

  this.setY(alturaJogo / 2);
};

const barreiras = new Barreiras(700, 1910, 200, 600);
const passaro = new Passaro(700);
const areaDoJogo = document.querySelector('[flappy]');
areaDoJogo.appendChild(passaro.element);
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element));
setInterval(() => {
  barreiras.animar();
  passaro.animar();
}, 20)
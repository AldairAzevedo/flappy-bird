const newElement = (tagName, className) => { // Função para criar elementos
  const element = document.createElement(tagName);
  element.className = className;
  return element;
};

function Barreira(reverse = false) { // Função construtora para criar um elemento barreira
  this.element = newElement('div', 'barreira');

  const borda = newElement('div', 'borda');
  const corpo = newElement('div', 'corpo');
  this.element.appendChild(reverse ? corpo : borda);
  this.element.appendChild(reverse ? borda : corpo);

  this.setAltura = altura => corpo.style.height = `${altura}px`;
};

function ParBarreira(height, opening, x) { // Função construtora para criar o par das barreiras
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

function Barreiras(altura, largura, abertura, espaco, notificarPonto, desloc) { // Função construtora para criar a quantidade desejada de barreiras no jogo e as regras relacionado ao comportamento das barreiras no jogo
  this.pares = [
    new ParBarreira(altura, abertura, largura),
    new ParBarreira(altura, abertura, largura + espaco),
    new ParBarreira(altura, abertura, largura + espaco * 2),
    new ParBarreira(altura, abertura, largura + espaco * 3)
  ];

  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - desloc);

      // Quando o elemento sair da área do jogo
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length);
        par.sotearAbertura();
      };

      const meio = largura / 2;
      const cruzouMeio = par.getX() + desloc >= meio && par.getX() < meio
      cruzouMeio && notificarPonto();
    });
  };
};

function Passaro(alturaJogo) { // Função construtora para criar o passáro
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

function Progresso() { // Função construtora para criar a pontuação do jogo
  this.element = newElement('span', 'progresso');
  this.atualizarPontos = pontos => {
    this.element.innerHTML = pontos;
  };
  this.atualizarPontos(0);
};

function sobrepostos(elementA, elementB) {//Função para verificar sobreposição dos elementos
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left
    && b.left + b.width >= a.left;

  const vertical = a.top + a.height >= b.top
    && b.top + b.height >= a.top;

  return horizontal && vertical;
};

function colidiu(passaro, barreiras) {//Função para verificar colisão do passaro com as barreiras
  let colidiu = false;
  barreiras.pares.forEach(parBarreira => {
    if (!colidiu) {
      const superior = parBarreira.superior.element;
      const inferior = parBarreira.inferior.element;
      colidiu = sobrepostos(passaro.element, superior) || sobrepostos(passaro.element, inferior);
    };
  });
  return colidiu;
};

function FlappyBird() { //Função contrutora index, reponsável por montar e iniciar o jogo
  let pontos = 8;
  let vel = 6;
  const areaDoJogo = document.querySelector('[flappy]');
  const altura = areaDoJogo.clientHeight;
  const largura = areaDoJogo.clientWidth;

  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 200, 600,
    () => progresso.atualizarPontos(++pontos), vel)
  const passaro = new Passaro(altura);

  areaDoJogo.appendChild(progresso.element);
  areaDoJogo.appendChild(passaro.element);
  barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element));

  this.start = () => {
    //loop do jogo
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();

      if (pontos % 10 === 0) {
        vel++;
      };

      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador);
      };
    }, 20);
  };
};

new FlappyBird().start();

// const barreiras = new Barreiras(700, 1910, 200, 600);
// const passaro = new Passaro(700);
// const areaDoJogo = document.querySelector('[flappy]');
// areaDoJogo.appendChild(passaro.element);
// areaDoJogo.appendChild(new Progresso().element);
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element));
// setInterval(() => {
// barreiras.animar();
// passaro.animar();
// }, 20)

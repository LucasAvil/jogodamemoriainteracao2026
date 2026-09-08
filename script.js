const temas = [
  {
    nome: "Linguagens de Programação",
    imagens: [
      "assets/prog/python.png",
      "assets/prog/javascript.png",
      "assets/prog/csharp.png",
      "assets/prog/java.png",
      "assets/prog/php.png",
      "assets/prog/cpp.png",
      "assets/prog/ruby.png",
      "assets/prog/go.png",
    ],
  },
  {
    nome: "Sistemas Operacionais",
    imagens: [
      "assets/so/linux.png",
      "assets/so/windows.png",
      "assets/so/macos.png",
      "assets/so/android.png",
      "assets/so/ubuntu.png",
      "assets/so/debian.png",
      "assets/so/fedora.png",
      "assets/so/arch.png",
    ],
  },
  {
    nome: "Bancos de Dados",
    imagens: [
      "assets/bd/mysql.png",
      "assets/bd/postgres.png",
      "assets/bd/mongodb.png",
      "assets/bd/redis.png",
      "assets/bd/sqlite.png",
      "assets/bd/oracle.png",
      "assets/bd/mariadb.png",
      "assets/bd/sqlserver.png",
    ],
  },
  {
    nome: "Inteligências Artificiais",
    imagens: [
      "assets/redes/gemini.png",
      "assets/redes/copilotmicrosoft.png",
      "assets/redes/seek.png", 
      "assets/redes/grok.png",
      "assets/redes/gpt.png",
      "assets/redes/claude.png",
      "assets/redes/gitcopilot.png",
      "assets/redes/perplexity.png",
    ],
  },
  {
    nome: "Desenvolvimento Web",
    imagens: [
      "assets/web/html.png",
      "assets/web/css.png",
      "assets/web/react.png",
      "assets/web/vue.png",
      "assets/web/angular.png",
      "assets/web/node.png",
      "assets/web/sass.png",
      "assets/web/typescript.png",
    ],
  },
  {
    nome: "Marcas",
    imagens: [
      "assets/sec/xiaomi.png",
      "assets/sec/apple.png",
      "assets/sec/sansung.png",
      "assets/sec/nvidia.png",
      "assets/sec/amd.png",
      "assets/sec/intel.png",
      "assets/sec/asus.png",
      "assets/sec/hp.png",
    ],
  },
];

const totalPares = 8;
let baralho = [];

let primeiraCarta = null;
let segundaCarta = null;
let bloquearTabuleiro = false;
let acertos = 0;
let erros = 0;

let tempoRestante = 90;
let timerInterval = null;

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function iniciarTimer() {
  clearInterval(timerInterval);
  tempoRestante = 90;
  atualizarTimerDisplay();

  timerInterval = setInterval(() => {
    tempoRestante--;
    atualizarTimerDisplay();

    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      bloquearTabuleiro = true;

      setTimeout(() => {
        if (acertos === totalPares) {
          mostrarResultado(true);
        } else {
          mostrarResultado(false);
        }
      }, 500);
    }
  }, 1000);
}

function atualizarTimerDisplay() {
  const timerElement = document.getElementById("timer");
  if (!timerElement) return;

  const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
  const segundos = String(tempoRestante % 60).padStart(2, "0");
  timerElement.innerText = `${minutos}:${segundos}`;
}

function virarCarta(cartaClicada) {
  if (
    bloquearTabuleiro ||
    cartaClicada === primeiraCarta ||
    cartaClicada.classList.contains("flipped")
  )
    return;

  cartaClicada.classList.add("flipped");

  if (!primeiraCarta) {
    primeiraCarta = cartaClicada;
    return;
  }

  segundaCarta = cartaClicada;
  verificarPar();
}

function verificarPar() {
  const deuMatch = primeiraCarta.dataset.valor === segundaCarta.dataset.valor;

  if (deuMatch) {
    desativarCartas();
  } else {
    desvirarCartas();
  }
}

function desativarCartas() {
  bloquearTabuleiro = true;

  setTimeout(() => {
    acertos++;
    document.getElementById("hits").innerText = acertos;

    const pCarta = primeiraCarta;
    const sCarta = segundaCarta;

    if (pCarta && sCarta) {
      pCarta.classList.add("card-success");
      sCarta.classList.add("card-success");
    }

    document.body.classList.add("screen-flash-success");
    setTimeout(() => {
      document.body.classList.remove("screen-flash-success");
    }, 400);

    setTimeout(() => {
      if (pCarta && sCarta) {
        pCarta.classList.remove("card-success");
        sCarta.classList.remove("card-success");
      }
      resetarJogada();

      if (acertos === totalPares) {
        clearInterval(timerInterval);
        bloquearTabuleiro = true;
        setTimeout(() => mostrarResultado(true), 400);
      }
    }, 300);
  }, 250);
}

function desvirarCartas() {
  bloquearTabuleiro = true;
  erros++;
  document.getElementById("errors").innerText = erros;

  setTimeout(() => {
    const pCarta = primeiraCarta;
    const sCarta = segundaCarta;

    if (pCarta && sCarta) {
      pCarta.classList.add("card-error");
      sCarta.classList.add("card-error");
    }

    setTimeout(() => {
      if (pCarta && sCarta) {
        pCarta.classList.remove("card-error");
        sCarta.classList.remove("card-error");
        requestAnimationFrame(() => {
          pCarta.classList.remove("flipped");
          sCarta.classList.remove("flipped");
          setTimeout(() => {
            resetarJogada();
          }, 300);
        });
      } else {
        resetarJogada();
      }
    }, 300);
  }, 250);
}

function resetarJogada() {
  [primeiraCarta, segundaCarta] = [null, null];
  bloquearTabuleiro = false;
}

function mostrarResultado(venceu) {
  const resultScreen = document.getElementById("result-screen");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");

  if (venceu) {
    resultTitle.innerText = "Excelente!!";
    resultMessage.innerText = `Boa GOAT, você completou o jogo com ${erros} erro(s)!`;
  } else {
    resultTitle.innerText = "Fim de Jogo!";
    resultMessage.innerText = "Não desista, eu confio no seu potencial!";
  }

  resultScreen.classList.remove("hidden");
}

function sortearComRoleta(callback) {
  const rouletteScreen = document.getElementById("roulette-screen");
  const rouletteText = document.getElementById("roulette-text");
  const rouletteBox = document.querySelector(".roulette-box");

  if (!rouletteScreen || !rouletteText) {
    const temaSorteado = temas[Math.floor(Math.random() * temas.length)];
    callback(temaSorteado);
    return;
  }

  if (rouletteBox) rouletteBox.classList.remove("selected");
  rouletteScreen.classList.remove("hidden");

  const temaSorteado = temas[Math.floor(Math.random() * temas.length)];
  let index = 0;
  let velocidade = 50;
  let voltas = 0;
  const totalVoltas = 22;

  function girar() {
    rouletteText.innerText = temas[index].nome;
    index = (index + 1) % temas.length;
    voltas++;

    if (voltas < totalVoltas) {
      if (voltas > totalVoltas - 6) {
        velocidade += 40;
      } else if (voltas > totalVoltas - 10) {
        velocidade += 20;
      }
      setTimeout(girar, velocidade);
    } else {
      rouletteText.innerText = temaSorteado.nome;
      if (rouletteBox) rouletteBox.classList.add("selected");

      setTimeout(() => {
        rouletteScreen.classList.add("hidden");
        callback(temaSorteado);
      }, 900);
    }
  }

  girar();
}

function iniciarJogo() {
  const startScreen = document.getElementById("start-screen");
  const gameContainer = document.getElementById("game-container");
  const resultScreen = document.getElementById("result-screen");

  if (startScreen) startScreen.classList.add("hidden");
  if (resultScreen) resultScreen.classList.add("hidden");

  sortearComRoleta((temaSorteado) => {
    acertos = 0;
    erros = 0;
    document.getElementById("hits").innerText = acertos;
    document.getElementById("errors").innerText = erros;
    resetarJogada();

    document.getElementById("theme").innerText = temaSorteado.nome;

    baralho = [...temaSorteado.imagens, ...temaSorteado.imagens];
    embaralhar(baralho);

    const cardGrid = document.querySelector(".card-grid");
    if (!cardGrid) return;
    cardGrid.innerHTML = "";

    baralho.forEach((caminhoImagem) => {
      const carta = document.createElement("div");
      carta.classList.add("card");
      carta.dataset.valor = caminhoImagem;

      carta.innerHTML = `
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${caminhoImagem}" alt="Ícone">
        </div>
      `;

      carta.addEventListener("click", () => virarCarta(carta));
      cardGrid.appendChild(carta);
    });

    if (gameContainer) gameContainer.classList.remove("hidden");
    iniciarTimer();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameContainer = document.getElementById("game-container");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const retryBtn = document.getElementById("retry-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      iniciarJogo();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", iniciarJogo);
  }

  if (retryBtn) {
    retryBtn.addEventListener("click", iniciarJogo);
  }
});

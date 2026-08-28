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
    nome: "Redes de Computadores",
    imagens: [
      "assets/redes/router.png",
      "assets/redes/switch.png",
      "assets/redes/wifi.png",
      "assets/redes/ethernet.png",
      "assets/redes/firewall.png",
      "assets/redes/server.png",
      "assets/redes/ip.png",
      "assets/redes/cloud.png",
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
    nome: "Segurança da Informação",
    imagens: [
      "assets/sec/lock.png",
      "assets/sec/key.png",
      "assets/sec/shield.png",
      "assets/sec/bug.png",
      "assets/sec/biometric.png",
      "assets/sec/vpn.png",
      "assets/sec/incognito.png",
      "assets/sec/certificate.png",
    ],
  },
];

const totalPares = 8; // CORRIGIDO: Total de pares no tabuleiro
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

// CORRIGIDO: Formata os 90 segundos em min:seg (ex: 01:30)
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
  acertos++;
  document.getElementById("hits").innerText = acertos;
  resetarJogada();

  if (acertos === totalPares) {
    clearInterval(timerInterval);
    bloquearTabuleiro = true;
    setTimeout(() => {
      mostrarResultado(true);
    }, 500);
  }
}

function desvirarCartas() {
  bloquearTabuleiro = true;
  erros++;
  document.getElementById("errors").innerText = erros;

  setTimeout(() => {
    if (primeiraCarta) primeiraCarta.classList.remove("flipped");
    if (segundaCarta) segundaCarta.classList.remove("flipped");
    resetarJogada();
  }, 700);
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

function iniciarJogo() {
  const resultScreen = document.getElementById("result-screen");
  if (resultScreen) resultScreen.classList.add("hidden");

  acertos = 0;
  erros = 0;
  document.getElementById("hits").innerText = acertos;
  document.getElementById("errors").innerText = erros;
  resetarJogada();

  const temaSorteado = temas[Math.floor(Math.random() * temas.length)];

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

    carta.innerHTML = `<img src="${caminhoImagem}" alt="Ícone">`;

    carta.addEventListener("click", () => virarCarta(carta));
    cardGrid.appendChild(carta);
  });

  iniciarTimer();
} // CORRIGIDO: Removida a chave extra que estava aqui abaixo

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameContainer = document.getElementById("game-container");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const retryBtn = document.getElementById("retry-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startScreen.classList.add("hidden");
      gameContainer.classList.remove("hidden");
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

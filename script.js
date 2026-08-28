const icones = ["🐍", "💻", "💾", "🌐", "🛡️", "⚡", "☕", "🐧"];

let baralho = [...icones, ...icones];

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

embaralhar(baralho);

let primeiraCarta = null;
let segundaCarta = null;
let bloquearTabuleiro = false;

let acertos = 0;
let erros = 0;

function virarCarta(cartaClicada) {
  if (bloquearTabuleiro || cartaClicada === primeiraCarta) return;

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
}

function desvirarCartas() {
  bloquearTabuleiro = true;
  erros++;
  document.getElementById("errors").innerText = erros;

  setTimeout(() => {
    primeiraCarta.classList.remove("flipped");
    segundaCarta.classList.remove("flipped");
    resetarJogada();
  }, 1000);
}

function resetarJogada() {
  [primeiraCarta, segundaCarta] = [null, null];
  bloquearTabuleiro = false;
}

const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  iniciarJogo();
});

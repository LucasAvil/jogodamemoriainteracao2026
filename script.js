const temas = [
  {
    nome: "Linguagens de Programação",
    itens: [
      { nome: "Python", imagem: "assets/py.png" },
      { nome: "JavaScript", imagem: "assets/javascript.png" },
      { nome: "C#", imagem: "assets/csharp.png" },
      { nome: "Java", imagem: "assets/java.png" },
      { nome: "PHP", imagem: "assets/php.png" },
      { nome: "C++", imagem: "assets/c++.png" },
      { nome: "Ruby", imagem: "assets/ruby.png" },
      { nome: "Go", imagem: "assets/go.png" },
    ],
  },
  {
    nome: "Sistemas Operacionais",
    itens: [
      { nome: "Linux", imagem: "assets/linux.png" },
      { nome: "Windows", imagem: "assets/windows.png" },
      { nome: "macOS", imagem: "assets/macos.png" },
      { nome: "Android", imagem: "assets/android.png" },
      { nome: "Ubuntu", imagem: "assets/ubuntu.png" },
      { nome: "Debian", imagem: "assets/debian.png" },
      { nome: "Fedora", imagem: "assets/fedora.png" },
      { nome: "Arch Linux", imagem: "assets/arch.png" },
    ],
  },
  {
    nome: "Bancos de Dados",
    itens: [
      { nome: "MySQL", imagem: "assets/mysql.png" },
      { nome: "PostgreSQL", imagem: "assets/postgres.png" },
      { nome: "MongoDB", imagem: "assets/mongodb.png" },
      { nome: "Redis", imagem: "assets/redis.png" },
      { nome: "SQLite", imagem: "assets/sqlite.png" },
      { nome: "Oracle", imagem: "assets/oracle.png" },
      { nome: "MariaDB", imagem: "assets/mariadb.png" },
      { nome: "SQL Server", imagem: "assets/sqlserver.png" },
    ],
  },
  {
    nome: "Inteligências Artificiais",
    itens: [
      { nome: "Gemini", imagem: "assets/gemini.png" },
      { nome: "Copilot", imagem: "assets/copilotmicrosoft.png" },
      { nome: "DeepSeek", imagem: "assets/seek.png" },
      { nome: "Grok", imagem: "assets/grok.png" },
      { nome: "ChatGPT", imagem: "assets/gpt.png" },
      { nome: "Claude", imagem: "assets/claude.png" },
      { nome: "GitHub Copilot", imagem: "assets/gitcopilot.png" },
      { nome: "Perplexity", imagem: "assets/perplexity.png" },
    ],
  },
  {
    nome: "Desenvolvimento Web",
    itens: [
      { nome: "HTML5", imagem: "assets/html.png" },
      { nome: "CSS3", imagem: "assets/css.png" },
      { nome: "React", imagem: "assets/react.png" },
      { nome: "Vue.js", imagem: "assets/vue.png" },
      { nome: "Angular", imagem: "assets/angular.png" },
      { nome: "Node.js", imagem: "assets/node.png" },
      { nome: "Sass", imagem: "assets/sass.png" },
      { nome: "TypeScript", imagem: "assets/typescript.png" },
    ],
  },
  {
    nome: "Marcas",
    itens: [
      { nome: "Xiaomi", imagem: "assets/xiaomi.png" },
      { nome: "Apple", imagem: "assets/apple.png" },
      { nome: "Samsung", imagem: "assets/samsung.png" },
      { nome: "NVIDIA", imagem: "assets/nvidia.png" },
      { nome: "AMD", imagem: "assets/Amd.png" },
      { nome: "Intel", imagem: "assets/intel.png" },
      { nome: "ASUS", imagem: "assets/asus.png" },
      { nome: "HP", imagem: "assets/hp.png" },
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

let tempoRestante = 60;
let timerInterval = null;

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function iniciarTimer() {
  clearInterval(timerInterval);
  tempoRestante = 60;
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
    resultMessage.innerText = `Boa GOAT, você completou o jogo com ${erros} erros!`;
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

    baralho = [...temaSorteado.itens, ...temaSorteado.itens];
    embaralhar(baralho);

    const cardGrid = document.querySelector(".card-grid");
    if (!cardGrid) return;
    cardGrid.innerHTML = "";

    baralho.forEach((item) => {
      const carta = document.createElement("div");
      carta.classList.add("card");
      carta.dataset.valor = item.nome;

      carta.innerHTML = `
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${item.imagem}" alt="${item.nome}">
          <span class="card-label">${item.nome}</span>
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

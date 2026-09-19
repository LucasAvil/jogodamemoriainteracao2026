const temas = [
  {
    nome: "Linguagens de Prog.",
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
    nome: "Sistemas Oper.",
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
    nome: "Inteligências Art.",
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
    nome: "Desenv. Web",
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
      { nome: "AMD", imagem: "assets/amd.png" },
      { nome: "Intel", imagem: "assets/intel.png" },
      { nome: "ASUS", imagem: "assets/asus.png" },
      { nome: "HP", imagem: "assets/hp.png" },
    ],
  },
];

const totalPares = 8;
const TEMPO_TOTAL = 90;
let baralho = [];

let primeiraCarta = null;
let segundaCarta = null;
let bloquearTabuleiro = false;
let acertos = 0;
let erros = 0;

let tempoRestante = TEMPO_TOTAL;
let timerInterval = null;
let tempoGastoFinal = 0;
let abaAtiva = "global";

function obterLeaderboardGlobal() {
  const dados = localStorage.getItem("memory_game_leaderboard");
  return dados ? JSON.parse(dados) : [];
}

function salvarLeaderboardGlobal(lista) {
  localStorage.setItem("memory_game_leaderboard", JSON.stringify(lista));
}

function obterTorneio() {
  const dados = localStorage.getItem("memory_game_tournament");
  return dados ? JSON.parse(dados) : null;
}

function salvarTorneio(torneio) {
  if (torneio) {
    localStorage.setItem("memory_game_tournament", JSON.stringify(torneio));
  } else {
    localStorage.removeItem("memory_game_tournament");
  }
}

function formatarTempo(segundosTotais) {
  const min = String(Math.floor(segundosTotais / 60)).padStart(2, "0");
  const seg = String(segundosTotais % 60).padStart(2, "0");
  return `${min}:${seg}`;
}

function renderizarLeaderboard() {
  const torneio = obterTorneio();
  const startList = document.getElementById("start-leaderboard-list");
  const gameList = document.getElementById("game-leaderboard-list");
  const listas = [startList, gameList].filter(Boolean);

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    if (btn.dataset.tab === abaAtiva) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll(".tournament-info-bar").forEach((bar) => {
    const titleDisplay = bar.querySelector(".tournament-title-display");
    if (torneio) {
      if (titleDisplay) titleDisplay.innerText = `Torneio: ${torneio.nome}`;
      bar.classList.remove("hidden");
    } else {
      bar.classList.add("hidden");
    }
  });

  document.querySelectorAll(".create-tournament-btn").forEach((btn) => {
    if (abaAtiva === "tournament" && !torneio) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });

  document.querySelectorAll(".delete-tournament-btn").forEach((btn) => {
    if (abaAtiva === "tournament" && torneio) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });

  const dadosExibicao =
    abaAtiva === "global"
      ? obterLeaderboardGlobal()
      : torneio
        ? torneio.scores
        : [];

  listas.forEach((listaElement) => {
    listaElement.innerHTML = "";

    if (dadosExibicao.length === 0) {
      const msg =
        abaAtiva === "global"
          ? "Sem recordes ainda!"
          : torneio
            ? "Nenhum resultado registrado!"
            : "Nenhum torneio ativo.";
      listaElement.innerHTML = `<li style="grid-template-columns: 1fr; text-align: center; color: #888;">${msg}</li>`;
      return;
    }

    dadosExibicao.forEach((jogador, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${index + 1}º</span>
        <span class="player-name" title="${jogador.nome}">${jogador.nome}</span>
        <span>${formatarTempo(jogador.tempo)}</span>
        <span>${jogador.erros}</span>
      `;
      listaElement.appendChild(li);
    });
  });
}

function eTop10Global(tempo, erros) {
  const leaderboard = obterLeaderboardGlobal();
  if (leaderboard.length < 10) return true;

  const piorTop10 = leaderboard[leaderboard.length - 1];
  if (tempo < piorTop10.tempo) return true;
  if (tempo === piorTop10.tempo && erros < piorTop10.erros) return true;

  return false;
}

function eElegivelParaNome(tempo, erros) {
  const torneio = obterTorneio();
  return eTop10Global(tempo, erros) || torneio !== null;
}

function registrarPontuacao(nome, tempo, erros) {
  const nomeFormatado = nome.trim() || "Anônimo";
  const novoRegistro = {
    nome: nomeFormatado,
    tempo: tempo,
    erros: erros,
    timestamp: Date.now(),
  };

  let globalList = obterLeaderboardGlobal();
  globalList.push(novoRegistro);
  globalList.sort((a, b) => {
    if (a.tempo !== b.tempo) return a.tempo - b.tempo;
    if (a.erros !== b.erros) return a.erros - b.erros;
    return a.timestamp - b.timestamp;
  });
  globalList = globalList.slice(0, 10);
  salvarLeaderboardGlobal(globalList);

  let torneio = obterTorneio();
  if (torneio) {
    torneio.scores.push(novoRegistro);
    torneio.scores.sort((a, b) => {
      if (a.tempo !== b.tempo) return a.tempo - b.tempo;
      if (a.erros !== b.erros) return a.erros - b.erros;
      return a.timestamp - b.timestamp;
    });
    salvarTorneio(torneio);
  }

  renderizarLeaderboard();
}

function abrirModalCriarTorneio() {
  const screen = document.getElementById("create-tournament-screen");
  const input = document.getElementById("tournament-name-input");
  if (!screen) return;

  if (input) {
    input.value = "";
  }
  screen.classList.remove("hidden");
  if (input) input.focus();
}

function fecharModalCriarTorneio() {
  const screen = document.getElementById("create-tournament-screen");
  if (screen) screen.classList.add("hidden");
}

function confirmarCriacaoTorneio() {
  const input = document.getElementById("tournament-name-input");
  const nome = input ? input.value.trim() : "";

  if (!nome) return;

  const novoTorneio = {
    nome: nome,
    criadoEm: Date.now(),
    scores: [],
  };

  salvarTorneio(novoTorneio);
  abaAtiva = "tournament";
  fecharModalCriarTorneio();
  renderizarLeaderboard();
}

function abrirModalEncerrarTorneio() {
  const torneio = obterTorneio();
  if (!torneio) return;

  const screen = document.getElementById("confirm-tournament-screen");
  const msg = document.getElementById("confirm-tournament-message");

  if (!screen) return;

  if (msg) {
    msg.innerText = `Deseja realmente finalizar o torneio "${torneio.nome}"?`;
  }
  screen.classList.remove("hidden");
}

function fecharModalEncerrarTorneio() {
  const screen = document.getElementById("confirm-tournament-screen");
  if (screen) screen.classList.add("hidden");
}

function confirmarEncerramentoTorneio() {
  const torneio = obterTorneio();
  if (!torneio) return;

  fecharModalEncerrarTorneio();
  exibirModalResultadoTorneio(torneio);
  salvarTorneio(null);
  renderizarLeaderboard();
}

function exibirModalResultadoTorneio(torneio) {
  const screen = document.getElementById("tournament-result-screen");
  const title = document.getElementById("tournament-result-title");
  const top3List = document.getElementById("tournament-top3-list");

  if (!screen || !title || !top3List) return;

  title.innerText = torneio.nome;
  top3List.innerHTML = "";

  const top3 = (torneio.scores || []).slice(0, 3);
  if (top3.length === 0) {
    top3List.innerHTML = `<li style="grid-template-columns: 1fr; text-align: center; color: #888;">Nenhum participante registrado.</li>`;
  } else {
    top3.forEach((jogador, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${index + 1}º</span>
        <span class="player-name" title="${jogador.nome}">${jogador.nome}</span>
        <span>${formatarTempo(jogador.tempo)}</span>
        <span>${jogador.erros}</span>
      `;
      top3List.appendChild(li);
    });
  }

  screen.classList.remove("hidden");
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function iniciarTimer() {
  clearInterval(timerInterval);
  tempoRestante = TEMPO_TOTAL;
  atualizarTimerDisplay();

  timerInterval = setInterval(() => {
    tempoRestante--;
    atualizarTimerDisplay();

    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      bloquearTabuleiro = true;

      setTimeout(() => {
        mostrarResultado(acertos === totalPares);
      }, 500);
    }
  }, 1000);
}

function atualizarTimerDisplay() {
  const timerElement = document.getElementById("timer");
  if (!timerElement) return;
  timerElement.innerText = formatarTempo(tempoRestante);
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
        tempoGastoFinal = TEMPO_TOTAL - tempoRestante;
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
  const nameContainer = document.getElementById("name-input-container");
  const nameInput = document.getElementById("player-name-input");

  if (venceu) {
    resultTitle.innerText = "Excelente!!";
    resultMessage.innerText = `Você concluiu em ${formatarTempo(tempoGastoFinal)} com ${erros} erro(s)!`;

    if (eElegivelParaNome(tempoGastoFinal, erros)) {
      if (nameContainer) nameContainer.classList.remove("hidden");
      if (nameInput) {
        nameInput.value = "";
        nameInput.focus();
      }
    } else {
      if (nameContainer) nameContainer.classList.add("hidden");
    }
  } else {
    resultTitle.innerText = "Fim de Jogo!";
    resultMessage.innerText = "O tempo acabou. Não desista!";
    if (nameContainer) nameContainer.classList.add("hidden");
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

function voltarAoMenu() {
  clearInterval(timerInterval);
  const startScreen = document.getElementById("start-screen");
  const gameContainer = document.getElementById("game-container");
  const resultScreen = document.getElementById("result-screen");

  if (resultScreen) resultScreen.classList.add("hidden");
  if (gameContainer) gameContainer.classList.add("hidden");
  if (startScreen) startScreen.classList.remove("hidden");

  renderizarLeaderboard();
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarLeaderboard();

  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const retryBtn = document.getElementById("retry-btn");
  const saveScoreBtn = document.getElementById("save-score-btn");
  const tournamentHomeBtn = document.getElementById("tournament-home-btn");
  const nameInput = document.getElementById("player-name-input");

  // Botões dos Modais de Torneio
  const confirmCreateTournamentBtn = document.getElementById(
    "confirm-create-tournament-btn",
  );
  const cancelCreateTournamentBtn = document.getElementById(
    "cancel-create-tournament-btn",
  );
  const confirmEndTournamentBtn = document.getElementById(
    "confirm-end-tournament-btn",
  );
  const cancelEndTournamentBtn = document.getElementById(
    "cancel-end-tournament-btn",
  );

  if (startBtn) startBtn.addEventListener("click", iniciarJogo);
  if (resetBtn) resetBtn.addEventListener("click", iniciarJogo);
  if (retryBtn) retryBtn.addEventListener("click", voltarAoMenu);

  if (saveScoreBtn) {
    saveScoreBtn.addEventListener("click", () => {
      const nome = nameInput ? nameInput.value : "Anônimo";
      registrarPontuacao(nome, tempoGastoFinal, erros);

      const nameContainer = document.getElementById("name-input-container");
      if (nameContainer) nameContainer.classList.add("hidden");
    });
  }

  if (tournamentHomeBtn) {
    tournamentHomeBtn.addEventListener("click", () => {
      const screen = document.getElementById("tournament-result-screen");
      if (screen) screen.classList.add("hidden");
      voltarAoMenu();
    });
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      abaAtiva = e.target.dataset.tab;
      renderizarLeaderboard();
    });
  });

  document.querySelectorAll(".create-tournament-btn").forEach((btn) => {
    btn.addEventListener("click", abrirModalCriarTorneio);
  });

  document.querySelectorAll(".delete-tournament-btn").forEach((btn) => {
    btn.addEventListener("click", abrirModalEncerrarTorneio);
  });

  if (confirmCreateTournamentBtn) {
    confirmCreateTournamentBtn.addEventListener(
      "click",
      confirmarCriacaoTorneio,
    );
  }
  if (cancelCreateTournamentBtn) {
    cancelCreateTournamentBtn.addEventListener(
      "click",
      fecharModalCriarTorneio,
    );
  }

  if (confirmEndTournamentBtn) {
    confirmEndTournamentBtn.addEventListener(
      "click",
      confirmarEncerramentoTorneio,
    );
  }
  if (cancelEndTournamentBtn) {
    cancelEndTournamentBtn.addEventListener(
      "click",
      fecharModalEncerrarTorneio,
    );
  }
});

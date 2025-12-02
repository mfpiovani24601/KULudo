// Navegação entre "telas"
const screens = document.querySelectorAll('.screen');

function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
}

// Botões home
document.querySelectorAll('#home .btn').forEach(btn => {
    const target = btn.dataset.target;
    if (!target) return;
    btn.addEventListener('click', () => showScreen(target));
});

// Botões voltar
document.querySelectorAll('.btn-voltar').forEach(btn => {
    const target = btn.dataset.target;
    btn.addEventListener('click', () => showScreen(target));
});

// Botão Streme (abre YouTube em nova aba)
document.getElementById('btn-streme').addEventListener('click', () => {
    const url = "https://youtube.com"; // TROCAR PELO LINK REAL
    window.open(url, '_blank');
});

// ----- Placar -----
const inputLeandro = document.getElementById('p-leandro');
const inputMarcelo = document.getElementById('p-marcelo');
const inputFilipe  = document.getElementById('p-filipe');

const percLeandro = document.getElementById('perc-leandro');
const percMarcelo = document.getElementById('perc-marcelo');
const percFilipe  = document.getElementById('perc-filipe');

const btnSalvarPlacar = document.getElementById('btn-salvar-placar');
const historicoLista = document.getElementById('historico-lista');

function parseNumero(str) {
    if (!str) return 0;
    return parseFloat(str.replace(',', '.')) || 0;
}

function atualizarPercentuais() {
    const l = parseNumero(inputLeandro.value);
    const m = parseNumero(inputMarcelo.value);
    const f = parseNumero(inputFilipe.value);
    const total = l + m + f;

    if (total <= 0) {
        percLeandro.textContent = '';
        percMarcelo.textContent = '';
        percFilipe.textContent = '';
        return;
    }

    percLeandro.textContent = `Leandro: ${(l / total * 100).toFixed(1)}%`;
    percMarcelo.textContent = `Marcelo: ${(m / total * 100).toFixed(1)}%`;
    percFilipe.textContent   = `Filipe: ${(f / total * 100).toFixed(1)}%`;
}

// Atualiza percentuais quando digita
[inputLeandro, inputMarcelo, inputFilipe].forEach(inp => {
    inp.addEventListener('input', atualizarPercentuais);
});

// ----- Histórico com localStorage -----
const STORAGE_KEY = 'kuludo_placar_historico';

function carregarHistorico() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function salvarHistorico(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function renderizarHistorico() {
    historicoLista.innerHTML = '';
    const historico = carregarHistorico();
    if (historico.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma alteração registrada ainda.';
        historicoLista.appendChild(li);
        return;
    }

    // Mostra do mais recente para o mais antigo
    [...historico].reverse().forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.dataHora}: L=${item.leandro}, M=${item.marcelo}, F=${item.filipe}`;
        historicoLista.appendChild(li);
    });
}

btnSalvarPlacar.addEventListener('click', () => {
    const l = parseNumero(inputLeandro.value);
    const m = parseNumero(inputMarcelo.value);
    const f = parseNumero(inputFilipe.value);

    const agora = new Date();
    const dataHora = agora.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const novoRegistro = {
        dataHora,
        leandro: l,
        marcelo: m,
        filipe: f
    };

    const historico = carregarHistorico();
    historico.push(novoRegistro);
    salvarHistorico(historico);
    renderizarHistorico();
    atualizarPercentuais();
});

// Inicialização
atualizarPercentuais();
renderizarHistorico();
showScreen('home');

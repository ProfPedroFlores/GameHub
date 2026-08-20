// Elementos do Index
const btnAdicionarJogo = document.getElementById("btnAdicionarJogo");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");

//Elementos da Modal
const modalCadastro = document.getElementById("modalCadastro");
const btnBuscarJogo = document.getElementById("btnBuscarJogo");
const campoNomeJogo = document.getElementById("nomeJogo");
const campoAnoJogo = document.getElementById("anoJogo");
const resultadosBusca = document.getElementById("resultadosBusca");
const areaJogoSelecionado = document.getElementById("jogoSelecionado");
const capaJogoSelecionado = document.getElementById("capaJogoSelecionado");

//Variável para ser preenchida na busca
let jogoSelecionado = null;


function abrirModal() {
    modalCadastro.classList.remove("oculta");
}


function fecharModal() {
    modalCadastro.classList.add("oculta");
}

async function buscarJogo() {

    const nome = campoNomeJogo.value;

    const resposta = await fetch(
        `/api/jogos?nome=${encodeURIComponent(nome)}`
    );

    const jogos = await resposta.json();

    resultadosBusca.innerHTML = "";

    jogos.forEach(jogo => {

        const resultado = document.createElement("div");
        resultado.classList.add("resultado-jogo");

        const imagem = document.createElement("img");

        if (jogo.capa) {
            imagem.src = jogo.capa;
            imagem.alt = `Capa de ${jogo.nome}`;
        }

        const informacoes = document.createElement("div");
        informacoes.classList.add("resultado-informacoes");

        const nomeJogo = document.createElement("strong");
        nomeJogo.textContent = jogo.nome;

        const anoJogo = document.createElement("span");
        anoJogo.textContent = jogo.ano || "Ano desconhecido";

        informacoes.appendChild(nomeJogo);
        informacoes.appendChild(anoJogo);

        resultado.appendChild(imagem);
        resultado.appendChild(informacoes);

        resultado.addEventListener("click", () => {

            jogoSelecionado = jogo;

            campoNomeJogo.value = jogo.nome;
            campoAnoJogo.value = jogo.ano || "";

            resultadosBusca.innerHTML = "";

            if (jogo.capa) {
                capaJogoSelecionado.src = jogo.capa;
                capaJogoSelecionado.alt = `Capa de ${jogo.nome}`;

                areaJogoSelecionado.classList.remove("oculta");
            }

        });

        resultadosBusca.appendChild(resultado);

    });

}

btnAdicionarJogo.addEventListener("click", abrirModal);

btnFecharModal.addEventListener("click", fecharModal);

btnCancelar.addEventListener("click", fecharModal);

btnBuscarJogo.addEventListener("click", buscarJogo);
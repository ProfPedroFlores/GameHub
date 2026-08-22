// Elementos do Index
const btnAdicionarJogo = document.getElementById("btnAdicionarJogo");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");

//Elementos da Modal
const modalCadastro = document.getElementById("modalCadastro");
const formCadastroJogo = document.getElementById("formCadastroJogo");
const btnBuscarJogo = document.getElementById("btnBuscarJogo");
const campoNomeJogo = document.getElementById("nomeJogo");
const campoAnoJogo = document.getElementById("anoJogo");
const resultadosBusca = document.getElementById("resultadosBusca");
const areaJogoSelecionado = document.getElementById("jogoSelecionado");
const capaJogoSelecionado = document.getElementById("capaJogoSelecionado");
const campoGeneroJogo = document.getElementById("generoJogo");
const campoPublisherJogo = document.getElementById("publisherJogo");
const campoDesenvolvedoraJogo = document.getElementById("desenvolvedoraJogo");

//Variável para ser preenchida na busca
let jogoSelecionado = null;


function abrirModal() {
    modalCadastro.classList.remove("oculta");
}


function fecharModal() {
    modalCadastro.classList.add("oculta");
}

function criarResultadoJogo(jogo) {

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

    return resultado;
}

async function selecionarJogo(jogo) {
    jogoSelecionado = jogo;

    campoNomeJogo.value = jogo.nome;
    campoAnoJogo.value = jogo.ano || "";

    resultadosBusca.innerHTML = "";

    // CAPA
    if (jogo.capa) {

        capaJogoSelecionado.src = jogo.capa;

        capaJogoSelecionado.alt =
            `Capa de ${jogo.nome}`;

        areaJogoSelecionado.classList.remove(
            "oculta"
        );

    }

    // GÊNERO
    if (jogo.generos?.length > 0) {

        try {

            const idGenero = jogo.generos[0];

            const respostaGenero = await fetch(
                `/api/generos/${idGenero}`
            );

            const genero =
                await respostaGenero.json();

            if (respostaGenero.ok) {

                campoGeneroJogo.value =
                    genero.nome;

            } else {

                campoGeneroJogo.value = "";

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar gênero:",
                erro
            );

            campoGeneroJogo.value = "";

        }

    } else {

        campoGeneroJogo.value = "";

    }

    // PUBLISHER
    if (jogo.publishers?.length > 0) {

        try {

            const idPublisher =
                jogo.publishers[0];

            const respostaPublisher = await fetch(
                `/api/publishers/${idPublisher}`
            );

            const publisher =
                await respostaPublisher.json();

            if (respostaPublisher.ok) {

                campoPublisherJogo.value =
                    publisher.nome;

            } else {

                campoPublisherJogo.value = "";

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar publisher:",
                erro
            );

            campoPublisherJogo.value = "";

        }

    } else {

        campoPublisherJogo.value = "";

    }

    // DESENVOLVEDORA
    if (jogo.desenvolvedores?.length > 0) {

        try {

            const idDesenvolvedora =
                jogo.desenvolvedores[0];

            const respostaDesenvolvedora =
                await fetch(
                    `/api/developers/${idDesenvolvedora}`
                );

            const desenvolvedora =
                await respostaDesenvolvedora.json();

            if (respostaDesenvolvedora.ok) {

                campoDesenvolvedoraJogo.value =
                    desenvolvedora.nome;

            } else {

                campoDesenvolvedoraJogo.value = "";

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar desenvolvedora:",
                erro
            );

            campoDesenvolvedoraJogo.value = "";

        }

    } else {

        campoDesenvolvedoraJogo.value = "";

    }
}

async function buscarJogo() {

    const nome = campoNomeJogo.value.trim();

    // Limpa os resultados da pesquisa anterior
    resultadosBusca.innerHTML = "";

    // Uma nova pesquisa invalida o jogo selecionado anteriormente
    jogoSelecionado = null;

    areaJogoSelecionado.classList.add("oculta");
    capaJogoSelecionado.removeAttribute("src");

    campoAnoJogo.value = "";
    campoGeneroJogo.value = "";
    campoPublisherJogo.value = "";
    campoDesenvolvedoraJogo.value = "";

    // Validação do campo de pesquisa
    if (!nome) {

        resultadosBusca.textContent =
            "Digite o nome de um jogo.";

        return;
    }

    try {

        // Evita vários cliques durante a requisição
        btnBuscarJogo.disabled = true;
        btnBuscarJogo.textContent = "Buscando...";

        const resposta = await fetch(
            `/api/jogos?nome=${encodeURIComponent(nome)}`
        );

        const jogos = await resposta.json();

        // Verifica se o backend respondeu com erro
        if (!resposta.ok) {

            throw new Error(
                jogos.erro || "Erro ao buscar jogos."
            );

        }

        // Nenhum resultado encontrado
        if (jogos.length === 0) {

            resultadosBusca.textContent =
                "Nenhum jogo encontrado.";

            return;
        }

        jogos.forEach(jogo => {

            const resultado = criarResultadoJogo(jogo);

            resultado.addEventListener("click", () => {
                selecionarJogo(jogo);
            });

            resultadosBusca.appendChild(resultado);

        });

    } catch (erro) {

        console.error(
            "Erro ao buscar jogos:",
            erro
        );

        resultadosBusca.textContent =
            "Não foi possível realizar a busca.";

    } finally {

        btnBuscarJogo.disabled = false;
        btnBuscarJogo.textContent = "Buscar jogo";

    }

}

function limparModal() {

    formCadastroJogo.reset();

    resultadosBusca.innerHTML = "";

    jogoSelecionado = null;

    areaJogoSelecionado.classList.add("oculta");

    capaJogoSelecionado.removeAttribute("src");
}

function fecharModal() {

    modalCadastro.classList.add("oculta");

    limparModal();
}

btnAdicionarJogo.addEventListener("click", abrirModal);

btnFecharModal.addEventListener("click", fecharModal);

btnCancelar.addEventListener("click", fecharModal);

btnBuscarJogo.addEventListener("click", buscarJogo);
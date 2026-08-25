// Elementos do Index
const btnAdicionarJogo = document.getElementById("btnAdicionarJogo");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const gridJogos = document.getElementById("gridJogos");
const formPesquisa = document.getElementById("formPesquisa");
const campoPesquisa = document.getElementById("campoPesquisa");
const paginacao = document.getElementById("paginacao");

//Elementos da Modal
const modalCadastro = document.getElementById("modalCadastro");
const formCadastroJogo = document.getElementById("formCadastroJogo");
const btnBuscarJogo = document.getElementById("btnBuscarJogo");
const campoNomeJogo = document.getElementById("nomeJogo");
const campoAnoJogo = document.getElementById("anoJogo");
const campoNotaJogo = document.getElementById("notaJogo");
const resultadosBusca = document.getElementById("resultadosBusca");
const areaJogoSelecionado = document.getElementById("jogoSelecionado");
const capaJogoSelecionado = document.getElementById("capaJogoSelecionado");
const campoGeneroJogo = document.getElementById("generoJogo");
const campoPublisherJogo = document.getElementById("publisherJogo");
const campoDesenvolvedoraJogo = document.getElementById("desenvolvedoraJogo");
const camposObrigatorios = [
    campoNomeJogo,
    campoGeneroJogo,
    campoAnoJogo,
    campoPublisherJogo,
    campoDesenvolvedoraJogo,
    campoNotaJogo
];

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

async function buscarGenero(idGenero) {

    try {

        const resposta = await fetch(
            `/api/generos/${idGenero}`
        );

        const genero = await resposta.json();

        if (!resposta.ok) {
            return "";
        }

        return genero.nome;

    } catch (erro) {

        console.error(
            "Erro ao carregar gênero:",
            erro
        );

        return "";

    }

}

async function buscarPublisher(idPublisher) {

    try {

        const resposta = await fetch(
            `/api/publishers/${idPublisher}`
        );

        const publisher = await resposta.json();

        if (!resposta.ok) {
            return "";
        }

        return publisher.nome;

    } catch (erro) {

        console.error(
            "Erro ao carregar publisher:",
            erro
        );

        return "";

    }

}

async function buscarDesenvolvedora(idDesenvolvedora) {

    try {

        const resposta = await fetch(
            `/api/developers/${idDesenvolvedora}`
        );

        const desenvolvedora = await resposta.json();

        if (!resposta.ok) {
            return "";
        }

        return desenvolvedora.nome;

    } catch (erro) {

        console.error(
            "Erro ao carregar desenvolvedora:",
            erro
        );

        return "";

    }

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

    } else {

        areaJogoSelecionado.classList.add(
            "oculta"
        );

        capaJogoSelecionado.removeAttribute("src");

    }

    // IDs que serão utilizados nas consultas
    const idGenero =
        jogo.generos?.[0];

    const idPublisher =
        jogo.publishers?.[0];

    const idDesenvolvedora =
        jogo.desenvolvedores?.[0];

    // As três consultas são executadas em paralelo
    const [genero, publisher, desenvolvedora] = await Promise.all([

        idGenero
            ? buscarGenero(idGenero)
            : "",

        idPublisher
            ? buscarPublisher(idPublisher)
            : "",

        idDesenvolvedora
            ? buscarDesenvolvedora(idDesenvolvedora)
            : ""

    ]);

    // Preenche os campos da modal
    campoGeneroJogo.value = genero;
    campoPublisherJogo.value = publisher;
    campoDesenvolvedoraJogo.value = desenvolvedora;

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

function validarFormularioCadastro() {

    let formularioValido = true;

    camposObrigatorios.forEach(campo => {

        campo.classList.remove("campo-invalido");

        if (!campo.value.trim()) {

            campo.classList.add("campo-invalido");

            formularioValido = false;
        }

    });

    return formularioValido;
}

async function salvarJogo(evento) {

    evento.preventDefault();

    if (!validarFormularioCadastro()) {
        return;
    }

    const jogo = {
        thegamesdb_id: jogoSelecionado?.id || null,
        nome: campoNomeJogo.value.trim(),
        genero: campoGeneroJogo.value.trim() || null,
        ano: campoAnoJogo.value
            ? Number(campoAnoJogo.value)
            : null,
        publisher:
            campoPublisherJogo.value.trim() || null,
        desenvolvedora:
            campoDesenvolvedoraJogo.value.trim() || null,
        capa: jogoSelecionado?.capa || null,
        avaliacao: campoNotaJogo.value
            ? Number(campoNotaJogo.value)
            : null
    };

    try {

        const resposta = await fetch("/api/jogos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jogo)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                "Não foi possível cadastrar o jogo."
            );

        }

        alert(dados.mensagem);

        await carregarBiblioteca();

        fecharModal();

    } catch (erro) {

        console.error(
            "Erro ao salvar jogo:",
            erro
        );

        alert(erro.message);

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

function criarCardBiblioteca(jogo) {

    const card = document.createElement("article");
    card.classList.add("card-jogo");

    const imagem = document.createElement("img");

    if (jogo.capa) {

        imagem.src = jogo.capa;
        imagem.alt = `Capa de ${jogo.nome}`;

    } else {

        imagem.alt = "Jogo sem capa";

    }

    const informacoes = document.createElement("div");
    informacoes.classList.add("info-jogo");

    const nome = document.createElement("h3");
    nome.textContent = jogo.nome;

    const avaliacao = document.createElement("p");

    avaliacao.textContent = jogo.avaliacao
        ? "★".repeat(jogo.avaliacao)
        : "Sem avaliação";

    informacoes.appendChild(nome);
    informacoes.appendChild(avaliacao);

    card.appendChild(imagem);
    card.appendChild(informacoes);

    return card;
}

function criarPaginacao(
    totalPaginas,
    paginaAtual,
    nomePesquisa
) {

    paginacao.innerHTML = "";

    if (totalPaginas <= 1) {
        return;
    }

    // BOTÃO ANTERIOR
    const btnAnterior =
        document.createElement("button");

    btnAnterior.type = "button";
    btnAnterior.textContent = "Anterior";

    btnAnterior.disabled =
        paginaAtual === 1;

    btnAnterior.addEventListener("click", () => {

        carregarBiblioteca(
            nomePesquisa,
            paginaAtual - 1
        );

    });

    paginacao.appendChild(btnAnterior);


    // BOTÕES DAS PÁGINAS
    for (
        let numeroPagina = 1;
        numeroPagina <= totalPaginas;
        numeroPagina++
    ) {

        const botao =
            document.createElement("button");

        botao.type = "button";
        botao.textContent = numeroPagina;

        if (numeroPagina === paginaAtual) {
            botao.classList.add("ativa");
        }

        botao.addEventListener("click", () => {

            carregarBiblioteca(
                nomePesquisa,
                numeroPagina
            );

        });

        paginacao.appendChild(botao);

    }


    // BOTÃO PRÓXIMA
    const btnProxima =
        document.createElement("button");

    btnProxima.type = "button";
    btnProxima.textContent = "Próxima";

    btnProxima.disabled =
        paginaAtual === totalPaginas;

    btnProxima.addEventListener("click", () => {

        carregarBiblioteca(
            nomePesquisa,
            paginaAtual + 1
        );

    });

    paginacao.appendChild(btnProxima);

}

async function carregarBiblioteca(nome = "", pagina = 1) {

    try {

        const parametros = new URLSearchParams({
            pagina: pagina,
            limite: 9
        });

        if (nome) {
            parametros.append("nome", nome);
        }

        const resposta = await fetch(
            `/api/biblioteca?${parametros}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                "Não foi possível carregar a biblioteca."
            );

        }

        const jogos = dados.jogos;

        criarPaginacao(
            dados.totalPaginas,
            dados.pagina,
            nome
        );

        gridJogos.innerHTML = "";

        if (jogos.length === 0) {

            gridJogos.textContent =
                "Nenhum jogo encontrado.";

            paginacao.innerHTML = "";

            return;
        }

        jogos.forEach(jogo => {

            const card =
                criarCardBiblioteca(jogo);

            gridJogos.appendChild(card);

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar biblioteca:",
            erro
        );

    }

}

btnAdicionarJogo.addEventListener("click", abrirModal);

btnFecharModal.addEventListener("click", fecharModal);

btnCancelar.addEventListener("click", fecharModal);

btnBuscarJogo.addEventListener("click", buscarJogo);

formCadastroJogo.addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {

        evento.preventDefault();

        if (evento.target === campoNomeJogo) {
            buscarJogo();
        }

    }

});

formCadastroJogo.addEventListener("submit", salvarJogo);

campoNomeJogo.addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {

        evento.preventDefault();

        buscarJogo();

    }

});

carregarBiblioteca();

formPesquisa.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nome =
        campoPesquisa.value.trim();

    carregarBiblioteca(nome, 1);

});

camposObrigatorios.forEach(campo => {

    campo.addEventListener("input", () => {

        if (campo.value.trim()) {
            campo.classList.remove("campo-invalido");
        }

    });

});

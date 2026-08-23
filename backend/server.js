require("dotenv").config();
const pool = require("./db");

if (!process.env.THEGAMESDB_API_KEY) {
    console.error(
        "Erro: THEGAMESDB_API_KEY não configurada."
    );

    process.exit(1);
}

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

app.get("/api/jogos", async (req, res) => {

    try {

        const nome = req.query.nome?.trim();

        if (!nome) {
            return res.status(400).json({
                erro: "Informe o nome do jogo."
            });
        }

        const params = new URLSearchParams({
            apikey: process.env.THEGAMESDB_API_KEY,
            name: nome,
            fields: "genres,publishers",
            include: "boxart"
        });

        const resposta = await fetch(
            `https://api.thegamesdb.net/v1.1/Games/ByGameName?${params}`
        );

        if (!resposta.ok) {
            return res.status(502).json({
                erro: "Não foi possível consultar a TheGamesDB."
            });
        }

        const dados = await resposta.json();

        const jogos = dados.data?.games || [];

        const boxart = dados.include?.boxart;
        const capas = boxart?.data || {};
        const baseUrl = boxart?.base_url?.medium || "";

        const jogosGameHub = jogos.map(jogo => {

            const capasJogo = capas[jogo.id] || [];

            const capaFront = capasJogo.find(
                capa => capa.side === "front"
            );

            const capa =
                capaFront && baseUrl
                    ? baseUrl + capaFront.filename
                    : null;

            return {
                id: jogo.id,
                nome: jogo.game_title,
                ano: jogo.release_date
                    ? jogo.release_date.substring(0, 4)
                    : null,
                capa: capa,
                generos: jogo.genres || [],
                publishers: jogo.publishers || [],
                desenvolvedores: jogo.developers || []
            };

        });

        return res.json(jogosGameHub);

    } catch (erro) {

        console.error(
            "Erro ao buscar jogos:",
            erro.message
        );

        return res.status(500).json({
            erro: "Erro interno ao buscar jogos."
        });

    }

});

app.get("/api/generos/:id", async (req, res) => {

    const id = req.params.id;

    const params = new URLSearchParams({
        apikey: process.env.THEGAMESDB_API_KEY,
        id: id
    });

    const resposta = await fetch(
        `https://api.thegamesdb.net/v1/Genres/ByGenreID?${params}`
    );

    const dados = await resposta.json();

    const genero = dados.data?.genres?.[id];

    if (!genero) {
        return res.status(404).json({
            erro: "Gênero não encontrado."
        });
    }

    res.json({
        id: genero.id,
        nome: genero.name
    });

});

app.get("/api/publishers/:id", async (req, res) => {

    try {

        const id = req.params.id;

        console.log("Buscando publisher:", id);

        const params = new URLSearchParams({
            apikey: process.env.THEGAMESDB_API_KEY,
            id: id
        });

        const resposta = await fetch(
            `https://api.thegamesdb.net/v1/Publishers/ByPublisherID?${params}`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );

        console.log(
            "Resposta publisher:",
            resposta.status
        );

        if (!resposta.ok) {

            return res.status(502).json({
                erro: "Erro ao consultar publisher na TheGamesDB."
            });

        }

        const dados = await resposta.json();

        const publisher =
            dados.data?.publishers?.[id];

        if (!publisher) {

            return res.status(404).json({
                erro: "Publisher não encontrada."
            });

        }

        return res.json({
            id: publisher.id,
            nome: publisher.name
        });

    } catch (erro) {

        console.error(
            "Erro ao buscar publisher:",
            erro.message
        );

        if (erro.name === "TimeoutError") {

            return res.status(504).json({
                erro: "A TheGamesDB demorou demais para responder."
            });

        }

        return res.status(500).json({
            erro: "Erro interno ao buscar publisher."
        });

    }

});

app.get("/api/developers/:id", async (req, res) => {

    try {

        const id = req.params.id;

        console.log("Buscando desenvolvedora:", id);

        const params = new URLSearchParams({
            apikey: process.env.THEGAMESDB_API_KEY,
            id: id
        });

        const resposta = await fetch(
            `https://api.thegamesdb.net/v1/Developers/ByDeveloperID?${params}`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );

        console.log(
            "Resposta desenvolvedora:",
            resposta.status
        );

        if (!resposta.ok) {

            return res.status(502).json({
                erro: "Erro ao consultar desenvolvedora na TheGamesDB."
            });

        }

        const dados = await resposta.json();

        const developer =
            dados.data?.developers?.[id];

        if (!developer) {

            return res.status(404).json({
                erro: "Desenvolvedora não encontrada."
            });

        }

        return res.json({
            id: developer.id,
            nome: developer.name
        });

    } catch (erro) {

        console.error(
            "Erro ao buscar desenvolvedora:",
            erro.message
        );

        if (erro.name === "TimeoutError") {

            return res.status(504).json({
                erro: "A TheGamesDB demorou demais para responder."
            });

        }

        return res.status(500).json({
            erro: "Erro interno ao buscar desenvolvedora."
        });

    }

});

app.post("/api/jogos", async (req, res) => {

    try {

        const {
            thegamesdb_id,
            nome,
            genero,
            ano,
            publisher,
            desenvolvedora,
            capa,
            avaliacao
        } = req.body;

        if (
            !nome?.trim() ||
            !genero?.trim() ||
            !ano ||
            !publisher?.trim() ||
            !desenvolvedora?.trim() ||
            !avaliacao
        ) {

            return res.status(400).json({
                erro: "Preencha todos os campos obrigatórios."
            });

        }

        if (
            avaliacao &&
            (avaliacao < 1 || avaliacao > 5)
        ) {

            return res.status(400).json({
                erro: "A avaliação deve estar entre 1 e 5."
            });

        }

        const sql = `
            INSERT INTO jogos
            (
                thegamesdb_id,
                nome,
                genero,
                ano,
                publisher,
                desenvolvedora,
                capa,
                avaliacao
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            thegamesdb_id || null,
            nome.trim(),
            genero || null,
            ano || null,
            publisher || null,
            desenvolvedora || null,
            capa || null,
            avaliacao || null
        ];

        const [resultado] = await pool.execute(
            sql,
            valores
        );

        return res.status(201).json({
            mensagem: "Jogo cadastrado com sucesso!",
            id: resultado.insertId
        });

    } catch (erro) {

        console.error(
            "Erro ao cadastrar jogo:",
            erro.message
        );

        if (erro.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                erro: "Este jogo já está cadastrado."
            });

        }

        return res.status(500).json({
            erro: "Erro interno ao cadastrar jogo."
        });

    }

});

app.get("/api/biblioteca", async (req, res) => {

    try {

        const nome = req.query.nome?.trim();

        const pagina =
            Math.max(parseInt(req.query.pagina, 10) || 1, 1);

        const limite =
            Math.max(parseInt(req.query.limite, 10) || 9, 1);

        const offset =
            (pagina - 1) * limite;

        let sql = `
            SELECT
                id,
                thegamesdb_id,
                nome,
                genero,
                ano,
                publisher,
                desenvolvedora,
                capa,
                avaliacao
            FROM jogos
        `;

        let sqlTotal = `
            SELECT COUNT(*) AS total
            FROM jogos
        `;

        const valores = [];
        const valoresTotal = [];

        if (nome) {

            sql += `
                WHERE nome LIKE ?
            `;

            sqlTotal += `
                WHERE nome LIKE ?
            `;

            const termoBusca = `%${nome}%`;

            valores.push(termoBusca);
            valoresTotal.push(termoBusca);

        }

        sql += `
            ORDER BY id DESC
            LIMIT ${limite}
            OFFSET ${offset}
        `;

        valores.push(limite, offset);

        const [jogos] = await pool.execute(
            sql,
            valores
        );

        const [resultadoTotal] = await pool.execute(
            sqlTotal,
            valoresTotal
        );

        const total = resultadoTotal[0].total;

        const totalPaginas =
            Math.ceil(total / limite);

        return res.json({
            jogos,
            pagina,
            limite,
            total,
            totalPaginas
        });

    } catch (erro) {

        console.error(
            "Erro ao carregar biblioteca:",
            erro.message
        );

        return res.status(500).json({
            erro: "Erro interno ao carregar biblioteca."
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
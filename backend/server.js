require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

app.get("/api/jogos", async (req, res) => {

    const nome = req.query.nome;

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

    const dados = await resposta.json();

    const jogos = dados.data.games;

    const jogosGameHub = jogos.map(jogo => {

        const capas =
            dados.include.boxart.data[jogo.id] || [];

        const capaFront =
            capas.find(capa => capa.side === "front");

        const capa = capaFront
            ? dados.include.boxart.base_url.medium + capaFront.filename
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

    res.json(jogosGameHub);

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

    const genero = dados.data.genres[id];

    res.json({
        id: genero.id,
        nome: genero.name
    });

});

app.get("/api/publishers/:id", async (req, res) => {

    const id = req.params.id;

    const params = new URLSearchParams({
        apikey: process.env.THEGAMESDB_API_KEY,
        id: id
    });

    const resposta = await fetch(
        `https://api.thegamesdb.net/v1/Publishers/ByPublisherID?${params}`
    );

    const dados = await resposta.json();

    const publisher = dados.data.publishers[id];

    res.json({
        id: publisher.id,
        nome: publisher.name
    });

});

app.get("/api/developers/:id", async (req, res) => {

    const id = req.params.id;

    const params = new URLSearchParams({
        apikey: process.env.THEGAMESDB_API_KEY,
        id: id
    });

    const resposta = await fetch(
        `https://api.thegamesdb.net/v1/Developers/ByDeveloperID?${params}`
    );

    const dados = await resposta.json();

    const developer = dados.data.developers[id];

    res.json({
        id: developer.id,
        nome: developer.name
    });

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
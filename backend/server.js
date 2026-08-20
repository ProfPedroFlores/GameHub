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
            capa: capa
        };

    });

    res.json(jogosGameHub);

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
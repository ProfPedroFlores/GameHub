require("dotenv").config();

const http = require("http");

const server = http.createServer(async (req, res) => {

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/jogos") {

        const nome = url.searchParams.get("nome");

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

            const capas = dados.include.boxart.data[jogo.id] || [];

            const capaFront = capas.find(capa => capa.side === "front");

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

        console.log(jogosGameHub);

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(jogosGameHub));

        return;
    }

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("GameHub API funcionando!");

});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
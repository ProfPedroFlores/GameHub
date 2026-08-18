require("dotenv").config();

const url = "https://api.thegamesdb.net/v1.1/Games/ByGameName";

const params = new URLSearchParams({
    apikey: process.env.THEGAMESDB_API_KEY,
    name: "Final Fantasy",
    include: "boxart"
});

async function buscarJogo() {

    const resposta = await fetch(`${url}?${params}`);
    const dados = await resposta.json();

    console.log(dados.data);

}

buscarJogo();
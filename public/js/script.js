const btnAdicionarJogo = document.getElementById("btnAdicionarJogo");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const modalCadastro = document.getElementById("modalCadastro");


function abrirModal() {
    modalCadastro.classList.remove("oculta");
}


function fecharModal() {
    modalCadastro.classList.add("oculta");
}


btnAdicionarJogo.addEventListener("click", abrirModal);

btnFecharModal.addEventListener("click", fecharModal);

btnCancelar.addEventListener("click", fecharModal);
// Arquivo para código javascript
const API = "https://6a1f20afb79eec0d6cf08920.mockapi.io/api/v1/produtos";

async function listarMateriais() {
    const resposta = await fetch(API);
    const materiais = await resposta.json();
    const lista = document.getElementById("lista-materiais");

    
    lista.innerHTML = `
        <tr>
            <th>Material</th>
            <th>Quantidade</th>
            <th>Ações</th>
        </tr>
    `;

    materiais.forEach(material => {
        lista.innerHTML += `
            <tr>
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
                <td>
                    <button class="btn-baixar" onclick="baixarMaterial(${material.id})">Baixar</button>
                    <button class="btn-excluir" onclick="excluirMaterial(${material.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function salvarMaterial() {
    const nome = document.getElementById("input-nome").value;
    const quantidade = document.getElementById("input-quantidade").value;

    if (!nome || !quantidade) {
        alert("Preencha todos os campos!");
        return;
    }

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, quantidade })
    });

    document.getElementById("input-nome").value = "";
    document.getElementById("input-quantidade").value = "";

    listarMateriais();
}

function validarRetirada(estoqueAtual,  quantidadeRetirada) {
    const atual = Number(estoqueAtual);
    const retirada = Number(quantidadeRetirada);

    if (retirada > atual) {
        window.alert("Quantidade de retirada excede o estoque atual!");
        return false;
    }
    return true;
}

async function baixarEstoque(id, quantidadeAtual) {
    const inputRetirada = document.getElementById("input-retirada");
    const quantidadeRetirada = inputRetirada.value;

    if (!validarRetirada(quantidadeAtual, quantidadeRetirada)) {
        window.alert("Quantidade de retirada inválida!");
        return;
    }

    const novaQuantidade = Number(quantidadeAtual) - Number(quantidadeRetirada);


    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: novaQuantidade })
    });

    inputRetirada.value = "";
    listarMateriais();
}

async function baixarMaterial(id) {
    const resposta = await fetch(`${API}/${id}`);
    const material = await resposta.json();
    const quantidadeAtual = material.quantidade;

    await baixarEstoque(id, quantidadeAtual);
}


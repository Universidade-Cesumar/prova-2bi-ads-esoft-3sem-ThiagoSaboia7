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
        </tr>
    `;

    materiais.forEach(material => {
        lista.innerHTML += `
            <tr>
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
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

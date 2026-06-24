// Arquivo para código javascript
const API = "https://6a1f20afb79eec0d6cf08920.mockapi.io/api/v1/produtos";

window.onload = listarMateriais;

async function listarMateriais() {
    try {
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
            const classeEstoque = material.quantidade < 10 ? 'estoque-critico' : '';
            lista.innerHTML += `
                <tr class="${classeEstoque}">
                    <td>${material.nome}</td>
                    <td>${material.quantidade}</td>
                    <td>
                        <button class="btn-baixar" onclick="baixarMaterial(${material.id})">Baixar</button>
                        <button class="btn-excluir" onclick="excluirMaterial(${material.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
        
       document.getElementById("total-itens").textContent = materiais.length;
    } catch (erro) {
        console.error("Erro ao listar materiais:", erro);
        alert("Erro ao carregar materiais!");
    }

}

async function salvarMaterial() {
    try {
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
    } catch (erro) {
        console.error("Erro ao salvar material:", erro);
        alert("Erro ao salvar material!");
    }
}

function validarRetirada(estoqueAtual,  quantidadeRetirada) {
    const atual = Number(estoqueAtual);
    const retirada = Number(quantidadeRetirada);

    if (retirada > atual) {
        window.alert("Quantidade de retirada excede o estoque atual!");
        return false;
    }
    if (retirada <= 0) {
        return false;
    }
    return true;
}

async function baixarEstoque(id, quantidadeAtual) {
    try {
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
    } catch (erro) {
        console.error("Erro ao baixar estoque:", erro);
        alert("Erro ao atualizar estoque!");
    }
}

async function baixarMaterial(id) {
    try {
        const resposta = await fetch(`${API}/${id}`);
        const material = await resposta.json();
        const quantidadeAtual = material.quantidade;

        await baixarEstoque(id, quantidadeAtual);
    } catch (erro) {
        console.error("Erro ao baixar material:", erro);
        alert("Erro ao processar material!");
    }
}

async function excluirMaterial(id) {
    try {
        if (confirm("Deseja realmente excluir este material?")) {
            await fetch(`${API}/${id}`, {
                method: "DELETE"
            });
            listarMateriais();
        }
    } catch (erro) {
        console.error("Erro ao excluir material:", erro);
        alert("Erro ao excluir material!");
    }
}
function pesquisarMaterial() {
    try {
        const termo = document.getElementById("input-busca").value.toLowerCase();
        const tabela = document.getElementById("lista-materiais");
        const linhas = tabela.querySelectorAll("tr");
        let contadorVisivel = 0;
        let totalCriticos = 0;

        linhas.forEach((linha, indice) => {
            
            if (indice === 0) return;
            
            const nomeMaterial = linha.cells[0].textContent.toLowerCase();
            if (nomeMaterial.includes(termo)) {
                linha.style.display = "";
                contadorVisivel++;
                if (linha.classList.contains("estoque-critico")) {
                    totalCriticos++;
                }
            } else {
                linha.style.display = "none";
            }
        });

        document.getElementById("total-itens").textContent = contadorVisivel;
    } catch (erro) {
        console.error("Erro ao pesquisar material:", erro);
        alert("Erro ao pesquisar material!");
    }
}
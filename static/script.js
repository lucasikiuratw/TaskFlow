

 // TASKFLOW PRO - JAVASCRIPT
 // Responsável: Leonardo


const formulario = document.getElementById("taskForm");
const tituloInput = document.getElementById("taskTitle");
const descricaoInput = document.getElementById("taskDescription");
const prioridadeInput = document.getElementById("taskPriority");
const prazoInput = document.getElementById("taskDeadline");
const filtroInput = document.getElementById("taskFilter");
const lista = document.getElementById("taskList");


let grafico = null;
let tarefasAtuais = [];


// Buscar todas as tarefas para manter os indicadores corretos
async function carregarTarefas() {
    try {
        const resposta = await fetch("/api/tarefas");


        if (!resposta.ok) {
            throw new Error("Falha ao buscar tarefas");
        }


        tarefasAtuais = await resposta.json();


        atualizarEstatisticas(tarefasAtuais);
        atualizarGrafico(tarefasAtuais);
        exibirTarefas();


    } catch (erro) {
        console.error(erro);
        lista.textContent = "Erro ao carregar tarefas.";
    }
}


// Aplicar filtros sem alterar os dados originais
function exibirTarefas() {
    const filtro = filtroInput ? filtroInput.value : "todas";


    let tarefas = tarefasAtuais;


    if (filtro === "pendentes") {
        tarefas = tarefas.filter(tarefa => !tarefa.concluida);
    }


    if (filtro === "concluidas") {
        tarefas = tarefas.filter(tarefa => tarefa.concluida);
    }


    lista.innerHTML = "";


    if (tarefas.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "empty-message";
        mensagem.textContent = "Nenhuma tarefa encontrada.";
        lista.appendChild(mensagem);
        return;
    }


    tarefas.forEach(tarefa => {
        const card = document.createElement("article");
        card.className = "task-card";


        if (tarefa.concluida) {
            card.classList.add("task-completed");
        }


        const titulo = document.createElement("h3");
        titulo.textContent = tarefa.titulo;


        const descricao = document.createElement("p");
        descricao.textContent = tarefa.descricao || "Sem descrição.";


        const detalhes = document.createElement("div");
        detalhes.className = "task-details";


        const prioridade = document.createElement("span");
        const nivel = ["baixa", "media", "alta"].includes(
            tarefa.prioridade
        ) ? tarefa.prioridade : "media";


        prioridade.className = "priority priority-" + nivel;
        prioridade.textContent = "Prioridade: " + ({
            baixa: "Baixa",
            media: "Média",
            alta: "Alta"
        })[nivel];


        const prazo = document.createElement("span");
        prazo.textContent = tarefa.prazo
            ? "Prazo: " + formatarData(tarefa.prazo)
            : "Sem prazo";


        const status = document.createElement("span");
        status.className = tarefa.concluida
            ? "status-completed"
            : "status-pending";
        status.textContent = tarefa.concluida
            ? "Concluída"
            : "Em andamento";


        detalhes.append(prioridade, prazo, status);


        const acoes = document.createElement("div");
        acoes.className = "task-actions";


        const botaoConcluir = document.createElement("button");
        botaoConcluir.className = "btn-action";
        botaoConcluir.textContent = tarefa.concluida
            ? "Reabrir"
            : "Concluir";


        botaoConcluir.addEventListener("click", () => {
            atualizarTarefa(tarefa.id, !tarefa.concluida);
        });


        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "btn-action btn-delete";
        botaoExcluir.textContent = "Excluir";


        botaoExcluir.addEventListener("click", () => {
            excluirTarefa(tarefa.id);
        });


        acoes.append(botaoConcluir, botaoExcluir);
        card.append(titulo, descricao, detalhes, acoes);
        lista.appendChild(card);
    });
}


function formatarData(data) {
    const partes = data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return ${partes[2]}/${partes[1]}/${partes[0]};
}


// Adicionar tarefa
formulario.addEventListener("submit", async event => {
    event.preventDefault();


    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const prioridade = prioridadeInput
        ? prioridadeInput.value
        : "media";
    const prazo = prazoInput
        ? prazoInput.value || null
        : null;


    if (!titulo) {
        alert("Digite o nome da tarefa!");
        return;
    }


    try {
        const resposta = await fetch("/api/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo,
                descricao,
                prioridade,
                prazo
            })
        });


        if (!resposta.ok) {
            const erro = await resposta.json();
            alert(erro.erro || "Erro ao cadastrar tarefa.");
            return;
        }


        formulario.reset();
        await carregarTarefas();


    } catch (erro) {
        console.error(erro);
        alert("Erro de comunicação com o servidor.");
    }
});


// Concluir ou reabrir
async function atualizarTarefa(id, concluida) {
    try {
        const resposta = await fetch("/api/tarefas/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ concluida })
        });


        if (!resposta.ok) {
            throw new Error("Falha ao atualizar");
        }


        await carregarTarefas();


    } catch (erro) {
        console.error(erro);
        alert("Erro ao atualizar tarefa.");
    }
}


// Excluir tarefa
async function excluirTarefa(id) {
    if (!confirm("Deseja excluir esta tarefa?")) {
        return;
    }


    try {
        const resposta = await fetch("/api/tarefas/" + id, {
            method: "DELETE"
        });


        if (!resposta.ok) {
            throw new Error("Falha ao excluir");
        }


        await carregarTarefas();


    } catch (erro) {
        console.error(erro);
        alert("Erro ao excluir tarefa.");
    }
}


// Atualizar indicadores
function atualizarEstatisticas(tarefas) {
    const total = tarefas.length;
    const concluidas = tarefas.filter(
        tarefa => tarefa.concluida
    ).length;


    document.getElementById("totalTasks").textContent = total;
    document.getElementById("progressTasks").textContent =
        total - concluidas;
    document.getElementById("completedTasks").textContent =
        concluidas;
}


// Atualizar gráfico
function atualizarGrafico(tarefas) {
    const canvas = document.getElementById("taskChart");


    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const concluidas = tarefas.filter(
        tarefa => tarefa.concluida
    ).length;


    const pendentes = tarefas.length - concluidas;


    if (grafico) {
        grafico.destroy();
    }


    grafico = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Concluídas", "Pendentes"],
            datasets: [{
                data: [concluidas, pendentes],
                backgroundColor: ["#2563eb", "#cbd5e1"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}


// Filtro de tarefas
if (filtroInput) {
    filtroInput.addEventListener("change", exibirTarefas);
}


// Iniciar aplicação
carregarTarefas()
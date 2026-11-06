// TASKFLOW - JAVASCRIPT
// Responsável: Leonardo

// Elementos do HTML
const formulario = document.getElementById("taskForm");
const tituloInput = document.getElementById("taskTitle");
const descricaoInput = document.getElementById("taskDescription");
const lista = document.getElementById("taskList");

// Buscar as tarefas no Python
async function carregarTarefas() {
    try {
        const resposta = await fetch("/api/tarefas");
        const tarefas = await resposta.json();

        lista.innerHTML = "";

        // Mostrar mensagem quando não houver tarefas
        if (tarefas.length === 0) {
            lista.textContent = "Nenhuma tarefa cadastrada.";
        }

        // Criar um card para cada tarefa
        tarefas.forEach(function(tarefa) {
            const card = document.createElement("div");
            card.className = "task-card";

            const titulo = document.createElement("h3");
            titulo.textContent = tarefa.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = tarefa.descricao || "";

            const status = document.createElement("p");
            status.textContent = tarefa.concluida
                ? "Concluída"
                : "Em andamento";

            // Botão de concluir ou reabrir
            const botaoConcluir = document.createElement("button");

            botaoConcluir.textContent = tarefa.concluida
                ? "Reabrir"
                : "Concluir";

            botaoConcluir.addEventListener("click", function() {
                atualizarTarefa(tarefa.id, !tarefa.concluida);
            });

            // Botão de excluir
            const botaoExcluir = document.createElement("button");
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", function() {
                excluirTarefa(tarefa.id);
            });

            card.appendChild(titulo);
            card.appendChild(descricao);
            card.appendChild(status);
            card.appendChild(botaoConcluir);
            card.appendChild(botaoExcluir);

            lista.appendChild(card);
        });

        atualizarEstatisticas(tarefas);
        atualizarGrafico(tarefas);

    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
        lista.textContent = "Erro ao carregar tarefas.";
    }
}

// Cadastrar uma nova tarefa
formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();

    // Validação
    if (titulo === "") {
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
                titulo: titulo,
                descricao: descricao
            })
        });

        if (resposta.ok) {
            formulario.reset();
            carregarTarefas();
        } else {
            alert("Não foi possível cadastrar a tarefa.");
        }

    } catch (erro) {
        alert("Erro de comunicação com o servidor.");
    }
});

// Concluir ou reabrir tarefa
async function atualizarTarefa(id, concluida) {
    try {
        const resposta = await fetch("/api/tarefas/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                concluida: concluida
            })
        });

        if (resposta.ok) {
            carregarTarefas();
        } else {
            alert("Erro ao atualizar tarefa.");
        }

    } catch (erro) {
        alert("Erro de comunicação com o servidor.");
    }
}

// Excluir tarefa
async function excluirTarefa(id) {
    const confirmar = confirm("Deseja excluir esta tarefa?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch("/api/tarefas/" + id, {
            method: "DELETE"
        });

        if (resposta.ok) {
            carregarTarefas();
        } else {
            alert("Erro ao excluir tarefa.");
        }

    } catch (erro) {
        alert("Erro de comunicação com o servidor.");
    }
}

// Atualizar os cards do painel
function atualizarEstatisticas(tarefas) {
    const total = tarefas.length;

    const concluidas = tarefas.filter(function(tarefa) {
        return tarefa.concluida;
    }).length;

    const andamento = total - concluidas;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("progressTasks").textContent = andamento;
    document.getElementById("completedTasks").textContent = concluidas;
}

// Gráfico de produtividade
let grafico = null;

function atualizarGrafico(tarefas) {
    const canvas = document.getElementById("taskChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    const concluidas = tarefas.filter(function(tarefa) {
        return tarefa.concluida;
    }).length;

    const pendentes = tarefas.length - concluidas;

    if (grafico !== null) {
        grafico.destroy();
    }

    grafico = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Concluídas", "Pendentes"],
            datasets: [{
                data: [concluidas, pendentes],
                backgroundColor: ["#2563eb", "#cbd5e1"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

// Carregar as tarefas ao abrir a página
carregarTarefas();
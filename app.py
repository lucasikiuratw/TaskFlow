
from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Conectar ao banco de dados
def conectar_banco():
    conexao = sqlite3.connect("tasks.db")
    conexao.row_factory = sqlite3.Row
    return conexao


# Criar tabela, caso não exista
def criar_tabela():
    conexao = conectar_banco()

    conexao.execute("""
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            concluida INTEGER DEFAULT 0
        )
    """)

    conexao.commit()
    conexao.close()


# Página inicial
@app.route("/")
def inicio():
    return render_template("index.html")


# Listar tarefas
@app.route("/api/tarefas", methods=["GET"])
def listar_tarefas():
    conexao = conectar_banco()

    tarefas = conexao.execute(
        "SELECT * FROM tarefas ORDER BY id DESC"
    ).fetchall()

    conexao.close()

    resultado = []

    for tarefa in tarefas:
        resultado.append({
            "id": tarefa["id"],
            "titulo": tarefa["titulo"],
            "descricao": tarefa["descricao"],
            "concluida": bool(tarefa["concluida"])
        })

    return jsonify(resultado)


# Cadastrar tarefa
@app.route("/api/tarefas", methods=["POST"])
def cadastrar_tarefa():
    dados = request.get_json(silent=True) or {}

    titulo = dados.get("titulo", "")
    descricao = dados.get("descricao", "")

    if not isinstance(titulo, str) or not titulo.strip():
        return jsonify({"erro": "O título é obrigatório"}), 400

    if not isinstance(descricao, str):
        return jsonify({"erro": "Descrição inválida"}), 400

    conexao = conectar_banco()

    conexao.execute(
        "INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)",
        (titulo.strip(), descricao.strip())
    )

    conexao.commit()
    conexao.close()

    return jsonify({"mensagem": "Tarefa cadastrada!"}), 201


# Concluir ou reabrir tarefa
@app.route("/api/tarefas/<int:id>", methods=["PUT"])
def atualizar_tarefa(id):
    dados = request.get_json(silent=True) or {}
    concluida = dados.get("concluida")

    if not isinstance(concluida, bool):
        return jsonify({"erro": "Status inválido"}), 400

    conexao = conectar_banco()

    cursor = conexao.execute(
        "UPDATE tarefas SET concluida = ? WHERE id = ?",
        (int(concluida), id)
    )

    conexao.commit()
    alteradas = cursor.rowcount
    conexao.close()

    if alteradas == 0:
        return jsonify({"erro": "Tarefa não encontrada"}), 404

    return jsonify({"mensagem": "Tarefa atualizada!"})


# Excluir tarefa
@app.route("/api/tarefas/<int:id>", methods=["DELETE"])
def excluir_tarefa(id):
    conexao = conectar_banco()

    cursor = conexao.execute(
        "DELETE FROM tarefas WHERE id = ?",
        (id,)
    )

    conexao.commit()
    excluidas = cursor.rowcount
    conexao.close()

    if excluidas == 0:
        return jsonify({"erro": "Tarefa não encontrada"}), 404

    return jsonify({"mensagem": "Tarefa excluída!"})


# Iniciar o programa
if __name__ == "__main__":
    criar_tabela()
    app.run(debug=True)

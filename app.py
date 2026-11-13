
from flask import Flask, render_template, request, jsonify
from datetime import date
import sqlite3

app = Flask(__name__)

# Conectar ao banco de dados
def conectar_banco():
    conexao = sqlite3.connect("tasks.db")
    conexao.row_factory = sqlite3.Row
    return conexao


# Criar ou atualizar a tabela
def criar_tabela():
    conexao = conectar_banco()

    conexao.execute("""
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            concluida INTEGER DEFAULT 0,
            prioridade TEXT DEFAULT 'media',
            prazo TEXT
        )
    """)

    # Atualizar bancos antigos sem apagar tarefas
    colunas = [
        coluna["name"]
        for coluna in conexao.execute(
            "PRAGMA table_info(tarefas)"
        ).fetchall()
    ]

    if "prioridade" not in colunas:
        conexao.execute("""
            ALTER TABLE tarefas
            ADD COLUMN prioridade TEXT DEFAULT 'media'
        """)

    if "prazo" not in colunas:
        conexao.execute("""
            ALTER TABLE tarefas
            ADD COLUMN prazo TEXT
        """)

    conexao.commit()
    conexao.close()


# Converter tarefa para JSON
def formatar_tarefa(tarefa):
    return {
        "id": tarefa["id"],
        "titulo": tarefa["titulo"],
        "descricao": tarefa["descricao"],
        "concluida": bool(tarefa["concluida"]),
        "prioridade": tarefa["prioridade"],
        "prazo": tarefa["prazo"]
    }


# Página inicial
@app.route("/")
def inicio():
    return render_template("index.html")


# Listar e filtrar tarefas
@app.route("/api/tarefas", methods=["GET"])
def listar_tarefas():
    filtro = request.args.get("status", "todas")

    if filtro not in ["todas", "pendentes", "concluidas"]:
        return jsonify({"erro": "Filtro inválido"}), 400

    conexao = conectar_banco()

    consulta = "SELECT * FROM tarefas"
    parametros = ()

    if filtro == "pendentes":
        consulta += " WHERE concluida = ?"
        parametros = (0,)

    elif filtro == "concluidas":
        consulta += " WHERE concluida = ?"
        parametros = (1,)

    consulta += " ORDER BY id DESC"

    tarefas = conexao.execute(
        consulta, parametros
    ).fetchall()

    conexao.close()

    return jsonify([
        formatar_tarefa(tarefa)
        for tarefa in tarefas
    ])


# Cadastrar tarefa
@app.route("/api/tarefas", methods=["POST"])
def cadastrar_tarefa():
    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return jsonify({"erro": "Dados inválidos"}), 400

    titulo = dados.get("titulo", "")
    descricao = dados.get("descricao", "")
    prioridade = dados.get("prioridade", "media")
    prazo = dados.get("prazo") or None

    if not isinstance(titulo, str) or not titulo.strip():
        return jsonify({"erro": "O título é obrigatório"}), 400

    if not isinstance(descricao, str):
        return jsonify({"erro": "Descrição inválida"}), 400

    if prioridade not in ["baixa", "media", "alta"]:
        return jsonify({"erro": "Prioridade inválida"}), 400

    if prazo is not None:
        if not isinstance(prazo, str):
            return jsonify({"erro": "Prazo inválido"}), 400

        try:
            data_prazo = date.fromisoformat(prazo)
            if data_prazo.isoformat() != prazo:
                raise ValueError()
        except ValueError:
            return jsonify({"erro": "Data inválida"}), 400

    conexao = conectar_banco()

    cursor = conexao.execute("""
        INSERT INTO tarefas
        (titulo, descricao, prioridade, prazo)
        VALUES (?, ?, ?, ?)
    """, (
        titulo.strip(),
        descricao.strip(),
        prioridade,
        prazo
    ))

    conexao.commit()
    tarefa_id = cursor.lastrowid
    conexao.close()

    return jsonify({
        "mensagem": "Tarefa cadastrada!",
        "id": tarefa_id
    }), 201


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

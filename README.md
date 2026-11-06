# TaskFlow - Gerenciador de Tarefas

## 1. Sobre o projeto

O TaskFlow é um sistema web de gerenciamento de tarefas,
desenvolvido como trabalho acadêmico por estudantes do
segundo ano de faculdade.

O objetivo do projeto é facilitar a organização das
atividades do dia a dia, permitindo cadastrar, visualizar,
concluir e excluir tarefas.

O sistema também apresenta indicadores e um gráfico
para acompanhar a produtividade do usuário.

Além do trabalho acadêmico, o TaskFlow foi desenvolvido
para compor o portfólio dos integrantes.

## 2. Integrantes

*Lucas Yudi Ikiura*
- Desenvolvimento da interface HTML.
- Estilização com CSS.
- Programação do servidor em Python.
- Integração com o banco de dados SQLite.

*Leonardo Bastos Cantarin*
- Desenvolvimento das funcionalidades JavaScript.
- Interatividade dos botões.
- Desenvolvimento do gráfico de produtividade.
- Documentação técnica do projeto.

## 3. Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias:

- Python: lógica do servidor.
- Flask: framework para desenvolvimento web.
- HTML5: estrutura das páginas.
- CSS3: estilização da interface.
- JavaScript: interatividade e comunicação com o servidor.
- SQLite: armazenamento das tarefas.
- Chart.js: criação do gráfico de produtividade.
- Git: controle de versões.
- GitHub: armazenamento e colaboração no projeto.
- Visual Studio Code: ambiente de desenvolvimento.

## 4. Funcionalidades do sistema

O TaskFlow foi planejado para oferecer:

### Cadastro de tarefas
Permite cadastrar uma tarefa informando seu título
e uma descrição opcional.

### Visualização de tarefas
Apresenta as atividades cadastradas em uma lista
organizada.

### Conclusão de tarefas
Permite marcar uma atividade como concluída.

### Reabertura de tarefas
Permite alterar uma tarefa concluída para
o estado em andamento.

### Exclusão de tarefas
Permite excluir atividades que não são mais necessárias.

### Indicadores
Apresenta três informações principais:

- Total de tarefas.
- Tarefas em andamento.
- Tarefas concluídas.

### Gráfico de produtividade
Apresenta um gráfico comparando a quantidade de
tarefas concluídas e pendentes.

### Validações
Verifica se o usuário preencheu o título antes
de cadastrar uma tarefa.

## 5. Estrutura do projeto

text
TaskFlow/
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js


O arquivo tasks.db é criado pelo programa para
armazenar os dados localmente.

## 6. Como executar o projeto

### Requisitos

- Python instalado.
- Git instalado.
- Visual Studio Code ou outro editor.
- Navegador de internet.

### Passo 1 - Clonar o repositório

Abra o terminal e execute:

bash
git clone https://github.com/lucasikiuratw/TaskFlow.git


Entre na pasta:

bash
cd TaskFlow


### Passo 2 - Criar o ambiente virtual

No Windows:

bash
python -m venv .venv


### Passo 3 - Instalar as dependências

bash
.\.venv\Scripts\python.exe -m pip install -r requirements.txt


### Passo 4 - Executar o programa

bash
.\.venv\Scripts\python.exe app.py


### Passo 5 - Abrir no navegador

Acesse:

http://127.0.0.1:5000

O servidor precisa continuar executando no terminal
enquanto o usuário utiliza o sistema.

## 7. Funcionamento do sistema

O funcionamento do TaskFlow é dividido em quatro partes.

### HTML

O HTML organiza os elementos visuais, como:

- Cabeçalho.
- Menu de funcionalidades.
- Formulário de cadastro.
- Cards de estatísticas.
- Lista de tarefas.
- Gráfico de produtividade.

### CSS

O CSS é responsável pela aparência do sistema,
utilizando um estilo moderno e profissional,
com tons de azul, cards e espaçamento organizado.

### JavaScript

O JavaScript permite que o usuário interaja
com o sistema sem precisar recarregar a página
manualmente a cada operação.

As principais funções são:

*carregarTarefas()*

Busca as tarefas cadastradas e apresenta os
resultados na interface.

*atualizarTarefa()*

Permite concluir ou reabrir uma tarefa.

*excluirTarefa()*

Envia uma solicitação para remover uma tarefa.

*atualizarEstatisticas()*

Calcula e atualiza os indicadores do painel.

*atualizarGrafico()*

Utiliza a biblioteca Chart.js para mostrar
as tarefas concluídas e pendentes.

### Python e SQLite

O Python, utilizando Flask, recebe as solicitações
do JavaScript e realiza as operações necessárias.

O SQLite armazena as tarefas em um banco de dados
local, permitindo manter os registros após
o encerramento do programa.

## 8. Comunicação entre JavaScript e Python

A comunicação ocorre por meio da função fetch(),
utilizando requisições HTTP e dados em formato JSON.

| Método | Rota | Função |
|--------|------|--------|
| GET | /api/tarefas | Listar tarefas |
| POST | /api/tarefas | Cadastrar tarefa |
| PUT | /api/tarefas/id | Atualizar tarefa |
| DELETE | /api/tarefas/id | Excluir tarefa |

O JavaScript envia as solicitações para o Flask.

O Flask processa os dados e utiliza o SQLite
para armazenar ou consultar as informações.

## 9. Validações e tratamento de erros

O sistema inclui validações básicas para melhorar
a experiência do usuário.

Entre elas:

- Impedir o cadastro de tarefas sem título.
- Solicitar confirmação antes de excluir uma tarefa.
- Exibir mensagens quando uma operação falhar.
- Tratar erros de comunicação com o servidor.

## 10. Git e GitHub

O Git é utilizado para registrar as alterações
realizadas durante o desenvolvimento.

O GitHub armazena o repositório remoto, permitindo
que os dois integrantes trabalhem no mesmo projeto.

Cada integrante utiliza sua própria conta e
realiza commits referentes às suas contribuições.

Comandos utilizados:

bash
git pull origin main
git status
git add nome-do-arquivo
git commit -m "Descricao da alteracao"
git push origin main


O comando git pull recebe atualizações do GitHub.

O git add seleciona arquivos para o commit.

O git commit registra uma versão das alterações.

O git push envia os commits para o repositório remoto.

## 11. Divisão do trabalho

### Lucas Yudi Ikiura

Responsável pela estrutura HTML, aparência CSS,
desenvolvimento Python e integração com SQLite.

### Leonardo Bastos Cantarin

Responsável pelo JavaScript, interatividade da
interface, gráfico de produtividade e documentação.

Ambos participam dos testes e da apresentação
do projeto.

## 12. Testes do sistema

Os testes previstos incluem:

1. Abrir a página inicial.
2. Cadastrar uma tarefa.
3. Verificar se a tarefa aparece na lista.
4. Marcar uma tarefa como concluída.
5. Conferir a atualização das estatísticas.
6. Reabrir uma tarefa.
7. Excluir uma tarefa.
8. Verificar a atualização do gráfico.
9. Reiniciar o programa e conferir os dados salvos.

## 13. Status do projeto

Primeira versão em desenvolvimento.

A interface HTML e CSS e as funcionalidades
JavaScript foram desenvolvidas.

A integração das rotas Flask com o banco SQLite
e os testes completos fazem parte das
próximas etapas.

## 14. Conclusão

O desenvolvimento do TaskFlow permite aplicar
na prática conhecimentos de programação,
desenvolvimento web, banco de dados e
controle de versões.

O projeto também proporciona experiência
em trabalho em equipe, organização de código,
documentação e utilização do GitHub.

O objetivo é construir uma aplicação simples,
funcional e de fácil compreensão, demonstrando
os conhecimentos adquiridos durante a faculdade.
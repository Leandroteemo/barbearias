import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

// Configurar o Express para servir arquivos estáticos da raiz do projeto
app.use(express.static('.')); // Serve arquivos na raiz, incluindo a pasta 'imagens'

// Configurar bodyParser para processar os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Função para criar e popular a tabela de usuários
async function criarEPopularTabelaUsuarios(nome, sobrenome) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    await db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        sobrenome TEXT
    )`);

    await db.run(`INSERT INTO usuarios (nome, sobrenome) VALUES (?, ?)`, [nome, sobrenome]);
}

// Rota para receber o formulário via POST
app.post('/cadastrar', async (req, res) => {
    const { nome, sobrenome } = req.body;

    try {
        await criarEPopularTabelaUsuarios(nome, sobrenome);
        res.send('Usuário cadastrado com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao cadastrar usuário');
        console.error(err);
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

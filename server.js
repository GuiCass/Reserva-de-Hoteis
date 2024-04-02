const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = 5500;

const pool = require('./models/db')
// Configuração da conexão com o banco de dados PostgreSQL
//const pool = new Pool({
//    user: 'seu_usuario',
//    host: 'localhost',
//    database: 'Hotel_Project',
//    password: 'Gui@050322',
//    port: 5432,
//});

app.use(bodyParser.json());

//app.get("/", async (req, res) => {
 ///   res.send("Pagina Inicial")
//})

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Rota para pesquisar reserva pelo número de reserva
app.get('/reserva/:numeroReserva', async (req, res) => {
    const numeroReserva = req.params.numeroReserva;
    try {
        const result = await pool.query(`SELECT id_reserva, cpf_resp, num_quarto FROM reserva WHERE id_reserva = ${numeroReserva}`);
        console.log(result)        
        // Verifica se há pelo menos um resultado retornado
        if (result && result.length > 0 && result[0][0] && result[0][0].id_reserva !== undefined) {
            // Acessa o primeiro resultado (único neste caso)
            console.log("Achou")
            const reserva = {
                id_reserva: result[0][0].id_reserva,
                cpf_resp: result[0][0].cpf_resp,
                num_quarto: result[0][0].num_quarto
            };
            console.log('Reserva encontrada:', reserva);
            res.json(reserva); // Envia a reserva como resposta
        } else {
            console.log("Não Achou");
            // Se não houver resultados, envia uma resposta com status 404
            res.status(404).json({ message: 'Reserva não encontrada' });
        }
    } catch (err) {
        console.log("Errooooorrr")
        console.error('Erro ao buscar reserva', err);
        res.status(500).json({ message: 'Erro ao buscar reserva' });
    }
});

app.post('/reserva', async (req, res) => {
    const { numero_reserva, cpf, quarto } = req.body;
    console.log('Chamou o post');
    try {
        const result = await pool.query(
            'INSERT INTO reservas (id_reserva, cpf_resp, num_quarto) VALUES ($1, $2, $3) RETURNING *',
            [numero_reserva, cpf, quarto]
        );
        const novaReserva = result.rows[0];
        client.release();
        res.status(201).json(novaReserva);
    } catch (err) {
        console.error('Erro ao cadastrar reserva', err);
        res.status(500).json({ message: 'Erro ao cadastrar reserva' });
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Rota para a página de dashboard
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/animais', (req, res) => {
    res.sendFile(path.join(__dirname, 'animais.html'));
});

app.get('/hospede', (req, res) => {
    res.sendFile(path.join(__dirname, 'hospede.html'));
});

app.get('/inicial', (req, res) => {
    res.sendFile(path.join(__dirname, 'inicial.html'));
});

app.get('/navbar', (req, res) => {
    res.sendFile(path.join(__dirname, 'navbar.html'));
});

app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

app.get('/quarto', (req, res) => {
    res.sendFile(path.join(__dirname, 'quarto.html'));
});

app.get('/reserva', (req, res) => {
    res.sendFile(path.join(__dirname, 'reserva.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} http://localhost:5500`);
});

app.get('/tiposervico', async (req, res) => {
    try {
        // Consulta ao banco de dados para obter os valores possíveis para tipo_servico
        const tiposServico = await pool.query('select id_service_plan, nom_service from service_plan');
        
        // Extrai a matriz de resultados dos tipos de serviço
        const tiposServicoRows = tiposServico[0];
        
        // Retorna apenas a matriz de resultados como JSON
        res.json(tiposServicoRows);
    } catch (error) {
        console.error('Erro ao buscar opções do tipo de serviço:', error);
        res.status(500).json({ message: 'Erro ao buscar opções do tipo de serviço' });
    }
});

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
        const result = await pool.query(`SELECT 
        id_reserva, reserva.cpf_resp, num_quarto, id_service_plan, id_pag, nome, date_check_in, date_check_out 
        FROM reserva 
        inner join hospede on reserva.cpf_resp = hospede.cpf_resp
        WHERE id_reserva = ${numeroReserva}`);       
        // Verifica se há pelo menos um resultado retornado
        if (result && result.length > 0 && result[0][0] && result[0][0].id_reserva !== undefined) {
            // Acessa o primeiro resultado (único neste caso)
            const reserva = {
                id_reserva: result[0][0].id_reserva,
                cpf_resp: result[0][0].cpf_resp,
                num_quarto: result[0][0].num_quarto,
                id_service_plan: result[0][0].id_service_plan,
                id_pag: result[0][0].id_pag,
                nome: result[0][0].nome,
                date_check_in: result[0][0].date_check_in,
                date_check_out: result[0][0].date_check_out
            };
            console.log('Reserva encontrada:', reserva);
            res.json(reserva); // Envia a reserva como resposta
        } else {
            // Se não houver resultados, envia uma resposta com status 404
            res.status(404).json({ message: 'Reserva não encontrada' });
        }
    } catch (err) {
        console.error('Erro ao buscar reserva', err);
        res.status(500).json({ message: 'Erro ao buscar reserva' });
    }
});

app.post('/reserva', async (req, res) => {
    const { id_reserva, cpf_resp, num_quarto, id_service_plan, id_pag, date_check_in, date_check_out, nome } = req.body;
    console.log('Chamou o post: ' + id_reserva);
    console.log(typeof date_check_in);
    try {
        await pool.query(
            `INSERT INTO reserva 
            (id_reserva, cpf_resp, num_quarto, id_service_plan, id_pag, date_check_in, date_check_out) 
            VALUES (${id_reserva}, ${cpf_resp}, ${num_quarto}, ${id_service_plan}, ${id_pag}, 
                '${formatarDataParaBanco(date_check_in)}', '${formatarDataParaBanco(date_check_out)}')`
        );
        const result = await pool.query(
            `SELECT 
            id_reserva, reserva.cpf_resp, num_quarto, id_service_plan, id_pag, nome, date_check_in, date_check_out 
            FROM reserva 
            inner join hospede on reserva.cpf_resp = hospede.cpf_resp
            WHERE id_reserva = ${id_reserva}`
        );
        const novaReserva = {
            id_reserva: result[0][0].id_reserva,
            cpf_resp: result[0][0].cpf_resp,
            num_quarto: result[0][0].num_quarto,
            id_service_plan: result[0][0].id_service_plan,
            id_pag: result[0][0].id_pag,
            nome: result[0][0].nome,
            date_check_in: result[0][0].date_check_in,
            date_check_out: result[0][0].date_check_out,
            nome: result[0][0].nome
        };
        res.status(201).json(novaReserva);
    } catch (err) {
        console.error('Erro ao cadastrar reserva', err);
        res.status(500).json({ message: 'Erro ao cadastrar reserva' });
    }
});

app.put('/reserva/:id_reserva', async (req, res) => {
    const id_reserva = req.params.id_reserva;
    const { cpf_resp, num_quarto, id_service_plan, id_pag, date_check_in, date_check_out, nome } = req.body;

    try {
        // Verifica se a reserva com o ID especificado existe no banco de dados
        // Se não existir, retorna um erro 404 (Not Found)
        const reservaExistente = await pool.query(`SELECT * FROM reserva WHERE id_reserva = ${id_reserva}`);
        if (!(reservaExistente && reservaExistente.length > 0 && reservaExistente[0][0] && reservaExistente[0][0].id_reserva !== undefined)) {
            return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        // Atualiza a reserva no banco de dados com os novos valores
        await pool.query(
            `UPDATE reserva 
             SET cpf_resp = ${cpf_resp}, num_quarto = ${num_quarto}, id_service_plan = ${id_service_plan}, id_pag = ${id_pag}, 
                 date_check_in = '${formatarDataParaBanco(date_check_in)}', date_check_out = '${formatarDataParaBanco(date_check_out)}'
             WHERE id_reserva = ${id_reserva}`
        );

        const result = await pool.query(
            `SELECT 
            id_reserva, reserva.cpf_resp, num_quarto, id_service_plan, id_pag, nome, date_check_in, date_check_out 
            FROM reserva 
            inner join hospede on reserva.cpf_resp = hospede.cpf_resp
            WHERE id_reserva = ${id_reserva}`
        );
        const novaReserva = {
            id_reserva: result[0][0].id_reserva,
            cpf_resp: result[0][0].cpf_resp,
            num_quarto: result[0][0].num_quarto,
            id_service_plan: result[0][0].id_service_plan,
            id_pag: result[0][0].id_pag,
            nome: result[0][0].nome,
            date_check_in: result[0][0].date_check_in,
            date_check_out: result[0][0].date_check_out,
            nome: result[0][0].nome
        };
        res.status(200).json(novaReserva);
    } catch (err) {
        console.error('Erro ao atualizar reserva:', err);
        res.status(500).json({ message: 'Erro ao atualizar reserva' });
    }
});

app.delete('/reserva/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultSelect = await pool.query(
            `SELECT 
            id_reserva
            FROM reserva
            WHERE id_reserva = ${id}`
        );
        const reserva = {
            id: resultSelect[0][0].id_reserva
        };
        console.log(reserva.id);
        // Realize a consulta para excluir a reserva com o ID fornecido
        if(reserva.id != undefined) {
            const result = await pool.query(
                `DELETE FROM reserva WHERE id_reserva = ${id}`
            );
            res.status(200).json({ message: 'Reserva removida com sucesso.' });
        } else {
            res.status(404).json({ message: 'Reserva não encontrada.' });
        }
    } catch (err) {
        console.error('Erro ao remover reserva:', err);
        res.status(500).json({ message: 'Erro ao remover reserva.' });
    }
});

// Rota para pesquisar reserva pelo número de reserva
app.get('/hospede/:cpfHospede', async (req, res) => {
    const cpfHospede = req.params.cpfHospede;
    try {
        const result = await pool.query(`SELECT 
        cpf_resp, nome, data_nasc, genero, nom_genero 
        FROM hospede 
        inner join genero on genero.id_gen = hospede.genero
        WHERE cpf_resp = ${cpfHospede}`);       
        // Verifica se há pelo menos um resultado retornado
        if (result && result.length > 0 && result[0][0] && result[0][0].cpf_resp !== undefined) {
            // Acessa o primeiro resultado (único neste caso)
            const reserva = {
                cpf_resp: result[0][0].cpf_resp,
                data_nasc: result[0][0].data_nasc,
                nome: result[0][0].nome,
                genero: result[0][0].genero,
                nom_genero: result[0][0].nom_genero
            };
            console.log('Hospede encontrado:', reserva);
            res.json(reserva); // Envia a reserva como resposta
        } else {
            // Se não houver resultados, envia uma resposta com status 404
            res.status(404).json({ message: 'Hospede não encontrada' });
        }
    } catch (err) {
        console.error('Erro ao buscar Hospede', err);
        res.status(500).json({ message: 'Erro ao buscar Hospede' });
    }
});

app.post('/hospede', async (req, res) => {
    const { cpf_resp, nome, genero, data_nasc } = req.body;
    try {
        await pool.query(
            `INSERT INTO hospede 
            (cpf_resp, nome, genero, data_nasc) 
            VALUES (${cpf_resp}, '${nome}', ${genero}, '${formatarDataParaBanco(data_nasc)}')`
        );        
        const result = await pool.query(`SELECT 
        cpf_resp, nome, data_nasc, genero, nom_genero 
        FROM hospede 
        inner join genero on genero.id_gen = hospede.genero
        WHERE cpf_resp = ${cpf_resp}`);
        const novoHospede = {
            cpf_resp: result[0][0].cpf_resp,
            nome: result[0][0].nome,
            genero: result[0][0].genero,
            data_nasc: result[0][0].data_nasc
        };
        res.status(201).json(novoHospede);
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

app.get('/tipopagamento', async (req, res) => {
    try {
        // Consulta ao banco de dados para obter os valores possíveis para tipo_servico
        const tiposPagamento = await pool.query('select id_pag, nom_pag from pagamento');
        
        // Extrai a matriz de resultados dos tipos de pagamento
        const tiposPagamentoRows = tiposPagamento[0];
        
        // Retorna apenas a matriz de resultados como JSON
        res.json(tiposPagamentoRows);
    } catch (error) {
        console.error('Erro ao buscar opções do tipo de Pagamento:', error);
        res.status(500).json({ message: 'Erro ao buscar opções do tipo de pagamento' });
    }
});

app.get('/genero', async (req, res) => {
    try {
        // Consulta ao banco de dados para obter os valores possíveis para tipo_servico
        const tiposGenero = await pool.query('select id_gen, nom_genero from genero');
        
        // Extrai a matriz de resultados dos tipos de pagamento
        const tiposGeneroRows = tiposGenero[0];
        
        // Retorna apenas a matriz de resultados como JSON
        res.json(tiposGeneroRows);
    } catch (error) {
        console.error('Erro ao buscar opções do tipo de genero:', error);
        res.status(500).json({ message: 'Erro ao buscar opções do tipo de genero' });
    }
});

function formatarDataParaBanco(data) {
    // Divide a data em partes (dia, mês, ano)
    const partes = data.split('/');
    // Reorganiza as partes para o formato YYYY-MM-DD
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    return dataFormatada;
}
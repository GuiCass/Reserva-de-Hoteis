const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = 5500;

const pool = require('./models/db')
app.use(bodyParser.json());

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Rota para pesquisar reserva pelo número de reserva
app.get('/reserva/:numeroReserva', async (req, res) => {
    const numeroReserva = req.params.numeroReserva;
    try {
        const result = await pool.query(`SELECT 
        id_reserva, reserva.cpf_resp, id_service_plan, id_pag, nome, date_check_in, date_check_out 
        FROM reserva 
        inner join hospede on reserva.cpf_resp = hospede.cpf_resp
        WHERE id_reserva = ${numeroReserva}`);       
        // Verifica se há pelo menos um resultado retornado
        if (result && result.length > 0 && result[0][0] && result[0][0].id_reserva !== undefined) {
            // Acessa o primeiro resultado (único neste caso)
            const reserva = {
                id_reserva: result[0][0].id_reserva,
                cpf_resp: result[0][0].cpf_resp,
                id_service_plan: result[0][0].id_service_plan,
                id_pag: result[0][0].id_pag,
                nome: result[0][0].nome,
                date_check_in: result[0][0].date_check_in,
                date_check_out: result[0][0].date_check_out
            };
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
    const { id_reserva, cpf_resp, id_service_plan, id_pag, date_check_in, date_check_out, nome } = req.body;
    try {
        await pool.query(
            `INSERT INTO reserva 
            (id_reserva, cpf_resp, id_service_plan, id_pag, date_check_in, date_check_out) 
            VALUES (${id_reserva}, ${cpf_resp}, ${id_service_plan}, ${id_pag}, 
                '${formatarDataParaBanco(date_check_in)}', '${formatarDataParaBanco(date_check_out)}')`
        );
        const result = await pool.query(
            `SELECT 
            id_reserva, reserva.cpf_resp, id_service_plan, id_pag, nome, date_check_in, date_check_out 
            FROM reserva 
            inner join hospede on reserva.cpf_resp = hospede.cpf_resp
            WHERE id_reserva = ${id_reserva}`
        );
        const novaReserva = {
            id_reserva: result[0][0].id_reserva,
            cpf_resp: result[0][0].cpf_resp,
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
    const { cpf_resp, id_service_plan, id_pag, date_check_in, date_check_out } = req.body;

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
             SET cpf_resp = ${cpf_resp}, id_service_plan = ${id_service_plan}, id_pag = ${id_pag}, 
                 date_check_in = '${formatarDataParaBanco(date_check_in)}', date_check_out = '${formatarDataParaBanco(date_check_out)}'
             WHERE id_reserva = ${id_reserva}`
        );

        const result = await pool.query(
            `SELECT 
            id_reserva, reserva.cpf_resp, id_service_plan, id_pag, nome, date_check_in, date_check_out 
            FROM reserva 
            inner join hospede on reserva.cpf_resp = hospede.cpf_resp
            WHERE id_reserva = ${id_reserva}`
        );
        const novaReserva = {
            id_reserva: result[0][0].id_reserva,
            cpf_resp: result[0][0].cpf_resp,
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

app.put('/hospede/:cpf_resp', async (req, res) => {
    const cpfHospede = req.params.cpfHospede;
    const { cpf_resp, nome, genero, data_nasc } = req.body;

    try {
        // Verifica se a reserva com o ID especificado existe no banco de dados
        // Se não existir, retorna um erro 404 (Not Found)
        const hospedeExistente = await pool.query(`SELECT * FROM hospede WHERE cpf_resp = ${cpf_resp}`);
        if (!(hospedeExistente && hospedeExistente.length > 0 && hospedeExistente[0][0] && hospedeExistente[0][0].cpf_resp !== undefined)) {
            return res.status(404).json({ message: 'Hospede não encontrada' });
        }

        // Atualiza a Hospede no banco de dados com os novos valores
        await pool.query(
            `UPDATE hospede 
             SET nome = '${nome}', data_nasc = '${formatarDataParaBanco(data_nasc)}', genero = ${genero}
             where cpf_resp = ${cpf_resp}`
        );

        const result = await pool.query(
            `SELECT 
            cpf_resp, nome, data_nasc, genero 
            FROM hospede 
            WHERE cpf_resp = ${cpf_resp}`
        );
        const novoHospede = {
            cpf_resp: result[0][0].cpf_resp,
            nome: result[0][0].nome,
            genero: result[0][0].genero,
            data_nasc: result[0][0].data_nasc
        };
        res.status(200).json(novoHospede);
    } catch (err) {
        console.error('Erro ao atualizar Hospede:', err);
        res.status(500).json({ message: 'Erro ao atualizar Hospede' });
    }
});

app.delete('/hospede/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultSelect = await pool.query(
            `SELECT 
            cpf_resp
            FROM hospede
            WHERE cpf_resp = ${id}`
        );
        const hospede = {
            id: resultSelect[0][0].cpf_resp
        };
        // Realize a consulta para excluir a hospede com o ID fornecido
        if(hospede.id != undefined) {
            const result = await pool.query(
                `DELETE FROM hospede WHERE cpf_resp = ${id}`
            );
            res.status(200).json({ message: 'Hospede removida com sucesso.' });
        } else {
            res.status(404).json({ message: 'Hospede não encontrada.' });
        }
    } catch (err) {
        console.error('Erro ao remover Hospede:', err);
        res.status(500).json({ message: 'Erro ao remover Hospede.' });
    }
});

app.get('/quarto/reserva/:idReserva', async (req, res) => {
    const { idReserva } = req.params;
    try {
        const quartos = await pool.query(`
            select quarto.num_quarto, 
            status_quarto, 
            quarto.id_reserva, hospede.cpf_resp,
            reserva.date_check_in,
            reserva.date_check_out
            from quarto
            inner join reserva on reserva.id_reserva = quarto.id_reserva
            inner join hospede on hospede.cpf_resp = reserva.cpf_resp
            where quarto.id_reserva = ${idReserva}
            order by quarto.num_quarto asc
        `);
        res.json(quartos[0]);
    } catch (error) {
        console.error('Erro ao pesquisar quartos por reserva:', error);
        res.status(500).json({ message: 'Erro ao pesquisar quartos por reserva.' });
    }
});

app.get('/quarto/numero/:numQuarto', async (req, res) => {
    const nume_quarto = req.params.numQuarto;
    try {
        const quartos = await pool.query(`
            select quarto.num_quarto, 
            status_quarto, 
            quarto.id_reserva, hospede.cpf_resp,
            reserva.date_check_in,
            reserva.date_check_out
            from quarto
            inner join reserva on reserva.id_reserva = quarto.id_reserva
            inner join hospede on hospede.cpf_resp = reserva.cpf_resp
            where quarto.num_quarto = ${nume_quarto}
            order by quarto.num_quarto asc
        `);
        res.json(quartos[0]);
    } catch (error) {
        console.error('Erro ao pesquisar quartos por numero:', error);
        res.status(500).json({ message: 'Erro ao pesquisar quartos por numero.' });
    }
});

app.post('/quarto', async (req, res) => {
    const { num_quarto, status_quarto_ocupado, status_quarto_livre, id_reserva } = req.body;
    try {
        var status;
        if (status_quarto_ocupado == true) {
            status = 2;
        } else {
            status = 1;
        }
        await pool.query(
            `INSERT INTO quarto 
            (num_quarto, status_quarto, id_reserva) 
            VALUES (${num_quarto}, '${status_quarto_ocupado == true ? 1 : 2}', ${id_reserva})`
        );        
        const result = await pool.query(`select quarto.num_quarto, 
            status_quarto, 
            quarto.id_reserva, hospede.cpf_resp,
            reserva.date_check_in,
            reserva.date_check_out
            from quarto
            inner join reserva on reserva.id_reserva = quarto.id_reserva
            inner join hospede on hospede.cpf_resp = reserva.cpf_resp
            where quarto.id_reserva = ${id_reserva}
            order by quarto.num_quarto asc`);
            res.json(result[0]);
    } catch (err) {
        console.error('Erro ao cadastrar quarto', err);
        res.status(500).json({ message: 'Erro ao cadastrar quarto' });
    }
});

app.put('/quarto/:numQuarto', async (req, res) => {
    const { num_quarto, status_quarto_ocupado, id_reserva, id_reserva_go } = req.body;
    const reservaInicial = id_reserva;

    try {
        // Verifica se a quarto com o ID especificado existe no banco de dados
        // Se não existir, retorna um erro 404 (Not Found)
        const quartoExistente = await pool.query(`SELECT * FROM quarto WHERE num_quarto = ${num_quarto}`);
        if (!(quartoExistente && quartoExistente.length > 0 && quartoExistente[0][0] && quartoExistente[0][0].num_quarto !== undefined)) {
            return res.status(404).json({ message: 'Quarto não encontrada' });
        }

        // Atualiza a Quarto no banco de dados com os novos valores
        await pool.query(
            `UPDATE quarto 
             SET status_quarto = '${status_quarto_ocupado == true ? 1 : 2}', 
             id_reserva = '${id_reserva_go}'
             where num_quarto = ${num_quarto}`
        );

        const result = await pool.query(
            `select quarto.num_quarto, 
            status_quarto, 
            quarto.id_reserva, hospede.cpf_resp,
            reserva.date_check_in,
            reserva.date_check_out
            from quarto
            inner join reserva on reserva.id_reserva = quarto.id_reserva
            inner join hospede on hospede.cpf_resp = reserva.cpf_resp
            where quarto.id_reserva = ${reservaInicial}
            order by quarto.num_quarto asc`
        );
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao atualizar Hospede:', err);
        res.status(500).json({ message: 'Erro ao atualizar Hospede' });
    }
});

app.delete('/quarto/:num_quarto', async (req, res) => {
    const { id_reserva } = req.body;
    const { num_quarto } = req.params;
    try {
        const resultSelect = await pool.query(
            `SELECT * FROM quarto WHERE num_quarto = ${num_quarto}`
        );
        const quarto = {
            num_quarto: resultSelect[0][0].num_quarto
        };
        // Realize a consulta para excluir a hospede com o ID fornecido
        if(quarto.num_quarto != undefined) {
            await pool.query(
                `DELETE FROM quarto WHERE num_quarto = ${num_quarto}`
            );
            const result = await pool.query(
                `select quarto.num_quarto, 
                status_quarto, 
                quarto.id_reserva, hospede.cpf_resp,
                reserva.date_check_in,
                reserva.date_check_out
                from quarto
                inner join reserva on reserva.id_reserva = quarto.id_reserva
                inner join hospede on hospede.cpf_resp = reserva.cpf_resp
                where quarto.id_reserva = ${id_reserva}
                order by quarto.num_quarto asc`
            );
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'quarto não encontrada.' });
        }
    } catch (err) {
        console.error('Erro ao remover quarto:', err);
        res.status(500).json({ message: 'Erro ao remover quarto.' });
    }
});

app.post('/animal', async (req, res) => {
    const { numero_reserva, nom_animal, status_quarto_ocupado, raca } = req.body;
    console.log
    try {
        await pool.query(
            `INSERT INTO animal 
            (id_reserva, nom_animal, id_raca, pedigre) 
            VALUES ('${numero_reserva}', '${nom_animal}', ${raca}, '${status_quarto_ocupado == true ? 1 : 2}')`
        );        
        const result = await pool.query(`select 
            id_animal, id_reserva, nom_animal, id_raca, pedigre
            from animal
            where id_reserva = '${numero_reserva}'
            order by id_animal asc`);
            res.json(result[0]);
    } catch (err) {
        console.error('Erro ao cadastrar quarto', err);
        res.status(500).json({ message: 'Erro ao cadastrar quarto' });
    }
});

app.get('/animal/reserva/:numReserva', async (req, res) => {
    const numReserva = req.params.numReserva;
    try {
        const animal = await pool.query(`
            select 
            id_animal, id_reserva, nom_animal, id_raca, pedigre
            from animal
            where id_reserva = '${numReserva}'
            order by id_animal asc
        `);
        res.json(animal[0]);
    } catch (error) {
        console.error('Erro ao pesquisar animais por numero:', error);
        res.status(500).json({ message: 'Erro ao pesquisar animais por reserva.' });
    }
});

app.get('/animal/id/:numid', async (req, res) => {
    const numId = req.params.numid;
    try {
        const animal = await pool.query(`
            select 
            id_animal, id_reserva, nom_animal, id_raca, pedigre
            from animal
            where id_animal = '${numId}'
            order by id_animal asc
        `);
        res.json(animal[0]);
    } catch (error) {
        console.error('Erro ao pesquisar animais por numero:', error);
        res.status(500).json({ message: 'Erro ao pesquisar animais por reserva.' });
    }
});

app.put('/animal/:id_animal', async (req, res) => {
    const { id_animal, numero_reserva, status_quarto_ocupado, raca, reserva_go, nome_go, raga_go } = req.body;

    try {
        // Verifica se a animal com o ID especificado existe no banco de dados
        // Se não existir, retorna um erro 404 (Not Found)
        const animalExistente = await pool.query(`SELECT * FROM animal WHERE id_animal = ${id_animal}`);
        if (!(animalExistente && animalExistente.length > 0 && animalExistente[0][0] && animalExistente[0][0].id_animal !== undefined)) {
            return res.status(404).json({ message: 'Quarto não encontrada' });
        }

        // Atualiza a Quarto no banco de dados com os novos valores
        await pool.query(
            `UPDATE animal 
             SET pedigre = '${status_quarto_ocupado == true ? 1 : 2}', 
             id_reserva = '${reserva_go}',
             nom_animal = '${nome_go}',
             id_raca = '${raga_go}'
             where id_animal = ${id_animal}`
        );

        const result = await pool.query(
            `select 
            id_animal, id_reserva, nom_animal, id_raca, pedigre
            from animal
            where id_reserva = '${numero_reserva}'
            order by id_animal asc`
        );
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao atualizar Hospede:', err);
        res.status(500).json({ message: 'Erro ao atualizar Hospede' });
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

app.get('/raca', async (req, res) => {
    try {
        // Consulta ao banco de dados para obter os valores possíveis para tipo_servico
        const tiposRaca = await pool.query('select id_raca, nom_raca from raca');
        
        // Extrai a matriz de resultados dos tipos de pagamento
        const tiposRacaRows = tiposRaca[0];
        
        // Retorna apenas a matriz de resultados como JSON
        res.json(tiposRacaRows);
    } catch (error) {
        console.error('Erro ao buscar opções do tipo de raca:', error);
        res.status(500).json({ message: 'Erro ao buscar opções do tipo de raca' });
    }
});

function formatarDataParaBanco(data) {
    // Divide a data em partes (dia, mês, ano)
    const partes = data.split('/');
    // Reorganiza as partes para o formato YYYY-MM-DD
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    return dataFormatada;
}
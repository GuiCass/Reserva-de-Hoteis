function pesquisarReserva() {
    const numeroReserva = document.getElementById('numero_reserva').value;
    console.log("batata")
    console.log(numeroReserva)

    // Realiza a solicitação usando fetch
    fetch('/reserva/' + numeroReserva)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao pesquisar reserva');
            }
            return response.json();
        })
        .then(reserva => {
            // Manipula a resposta recebida do servidor

            // Preenche os outros campos com os valores da reserva
            console.log(reserva);
            document.getElementById('cpf').value = reserva.cpf_resp;
            //document.getElementById('nome').value = reserva.nome;
            document.getElementById('quarto').value = reserva.num_quarto;
            //document.getElementById('tipo_servico').value = reserva.id_service_plan;
            //document.getElementById('tipo_pagamento').value = reserva.id_pag;
            //document.getElementById('checkin_in').value = reserva.date_check_in;
            //document.getElementById('checkin_out').value = reserva.date_check_out;
        })
        .catch(error => {
            // Manipula erros de solicitação
            console.error('Erro ao pesquisar reserva:', error);
            alert('Erro ao pesquisar reserva: ' + error.message);
        });

    console.log("batata2")
}

function cadastrarReserva() {
    // Obtém os valores inseridos nos campos do formulário
    const numeroReserva = $('#numero_reserva').val();
    const cpf = $('#cpf').val();
    const nome = $('#nome').val();
    const quarto = $('#quarto').val();
    const tipoServico = $('#tipo_servico').val();
    const tipoPagamento = $('#tipo_pagamento').val();
    const checkinIn = $('#checkin_in').val();
    const checkinOut = $('#checkin_out').val();

    // Cria um objeto com os dados da reserva
    const reserva = {
        numero_reserva: numeroReserva,
        cpf: cpf,
        nome: nome,
        quarto: quarto,
        tipo_servico: tipoServico,
        tipo_pagamento: tipoPagamento,
        checkin_in: checkinIn,
        checkin_out: checkinOut
    };

    // Realiza a solicitação AJAX usando jQuery
    $.ajax({
        url: '/reserva',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(reserva),
        success: function(response) {
            alert('Reserva cadastrada com sucesso!');
            // Limpa os campos do formulário após o cadastro
            limparCampos();
        },
        error: function(error) {
            console.error('Erro ao cadastrar reserva:', error);
            alert('Erro ao cadastrar reserva. Verifique o console para mais detalhes.');
        }
    });
}


function atualizarReserva() {
    // Lógica para atualizar a reserva
    alert("Função de atualização ainda não implementada!");
}

function removerReserva() {
    // Lógica para remover a reserva
    alert("Função de remoção ainda não implementada!");
}

function cadastrarQuarto() {
    // Aqui você pode adicionar o código JavaScript para enviar os dados do formulário para o servidor
    // Por exemplo, usando AJAX para enviar uma solicitação POST para um endpoint no backend
    // Você também pode validar os campos do formulário antes de enviar os dados
    alert("Quarto cadastrada com sucesso!");
}

function atualizarQuarto() {
    // Lógica para atualizar a reserva
    alert("Função de atualização ainda não implementada!");
}

function removerQuarto() {
    // Lógica para remover a reserva
    alert("Função de remoção ainda não implementada!");
}

function pesquisarQuarto() {
    // Aqui você pode adicionar o código JavaScript para pesquisar a reserva com base no número de reserva
    // Por exemplo, usando AJAX para enviar uma solicitação GET para buscar os detalhes da reserva no backend
    alert("Pesquisando quarto...");
}

function pesquisarAnimal() {
    // Aqui você pode adicionar o código JavaScript para pesquisar a reserva com base no número de reserva
    // Por exemplo, usando AJAX para enviar uma solicitação GET para buscar os detalhes da reserva no backend
    alert("Pesquisando animal...");
}

function atualizarAnimal() {
    // Lógica para atualizar a reserva
    alert("Função de atualização ainda não implementada!");
}

function removerAnimal() {
    // Lógica para remover a reserva
    alert("Função de remoção ainda não implementada!");
}

function cadastrarAnimal() {
    // Aqui você pode adicionar o código JavaScript para enviar os dados do formulário para o servidor
    // Por exemplo, usando AJAX para enviar uma solicitação POST para um endpoint no backend
    // Você também pode validar os campos do formulário antes de enviar os dados
    alert("Animal cadastrada com sucesso!");
}

// Seleção exclusiva dos checkboxes
const checkboxes = document.querySelectorAll('.checkbox-select input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        checkboxes.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });
    });
});

$(document).ready(function () {
    // Aplicar máscara de CPF
    $('.cpf-mask').mask('000.000.000-00', { reverse: true });

    // Aplicar máscara de data e hora para Check-In e Check-Out
    $('.datetime-mask').mask('00/00/0000 00:00:00');

    // Aplicar máscara de data e hora para Check-In e Check-Out
    $('.datetime-mask-only-date').mask('00/00/0000');

    $('.numeros-apenas').keydown(function (event) {
        // Permite: backspace, delete, tab, escape, enter e .
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Permite: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Permite: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // Não faz nada
            return;
        }
        // Garante que é um número e para a propagação do evento
        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    });
});

$(document).ready(function() {
    $.ajax({
        url: '/tiposervico',
        type: 'GET',
        dataType: 'json', // Força a interpretação da resposta como JSON
        success: function(data) {
            // Limpa as opções atuais do campo tipo_servico
            $('#tipo_servico').empty();
            
            // Adiciona as novas opções ao campo tipo_servico
            data.forEach(function(opcao) {
                var option = $('<option></option>').attr('value', opcao.id_service_plan).text(opcao.nom_service);
                $('#tipo_servico').append(option);
            });
        },
        error: function(error) {
            console.error('Erro ao carregar opções do tipo de serviço:', error);
        }
    });
});


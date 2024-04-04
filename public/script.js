function pesquisarReserva() {
    const numeroReserva = document.getElementById('numero_reserva').value;

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
            document.getElementById('cpf').value = reserva.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            document.getElementById('nome').value = reserva.nome;
            document.getElementById('quarto').value = reserva.num_quarto;
            document.getElementById('tipo_servico').value = reserva.id_service_plan;
            document.getElementById('tipo_pagamento').value = reserva.id_pag;
            document.getElementById('checkin_in').value = formatarDataBanco(reserva.date_check_in);
            document.getElementById('checkin_out').value = formatarDataBanco(reserva.date_check_out);
        })
        .catch(error => {
            // Manipula erros de solicitação
            console.error('Erro ao pesquisar reserva:', error);
            alert('Erro ao pesquisar reserva: ' + error.message);
        });
}

function cadastrarReserva() {
    // Obtém os valores inseridos nos campos do formulário
    const id_reserva = $('#numero_reserva').val();
    const cpf_resp = cpfParaNumeros($('#cpf').val());
    const num_quarto = $('#quarto').val();
    const id_service_plan = $('#tipo_servico').val();
    const id_pag = $('#tipo_pagamento').val();
    const date_check_in = $('#checkin_in').val();
    const date_check_out = $('#checkin_out').val();
    const nome = $('#nome').val();

    // Cria um objeto com os dados da reserva
    const reserva = {
        id_reserva: id_reserva,
        cpf_resp: cpf_resp,
        num_quarto: num_quarto,
        id_service_plan: id_service_plan,
        id_pag: id_pag,
        date_check_in: date_check_in,
        date_check_out: date_check_out,
        nome: nome
    };

    // Realiza a solicitação AJAX usando jQuery
    $.ajax({
        url: '/reserva',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(reserva),
        success: function(response) {
            document.getElementById('cpf').value = response.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            document.getElementById('nome').value = response.nome;
            document.getElementById('quarto').value = response.num_quarto;
            document.getElementById('tipo_servico').value = response.id_service_plan;
            document.getElementById('tipo_pagamento').value = response.id_pag;
            document.getElementById('checkin_in').value = formatarDataBanco(response.date_check_in);
            document.getElementById('checkin_out').value = formatarDataBanco(response.date_check_out);
            alert('Reserva cadastrada com sucesso!');
        },
        error: function(error) {
            console.error('Erro ao cadastrar reserva:', error);
            alert('Erro ao cadastrar reserva. Verifique o console para mais detalhes.');
        }
    });
}


async function atualizarReserva() {
    // Obtém os valores inseridos nos campos do formulário
    const id_reserva = $('#numero_reserva').val();
    const cpf_resp = cpfParaNumeros($('#cpf').val());
    const num_quarto = $('#quarto').val();
    const id_service_plan = $('#tipo_servico').val();
    const id_pag = $('#tipo_pagamento').val();
    const date_check_in = $('#checkin_in').val();
    const date_check_out = $('#checkin_out').val();
    const nome = $('#nome').val();

    // Cria um objeto com os dados da reserva
    const reserva = {
        id_reserva: id_reserva,
        cpf_resp: cpf_resp,
        num_quarto: num_quarto,
        id_service_plan: id_service_plan,
        id_pag: id_pag,
        date_check_in: date_check_in,
        date_check_out: date_check_out,
        nome: nome
    };

    // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
    $.ajax({
        url: `/reserva/${id_reserva}`, // Assume que existe um endpoint GET /reserva/:id_reserva no servidor
        type: 'GET',
        success: async function(response) {
            if (response) {
                // A reserva existe, então podemos prosseguir com a atualização
                try {
                    await $.ajax({
                        url: `/reserva/${id_reserva}`, // Assume que existe um endpoint PUT /reserva/:id_reserva no servidor para atualização
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(reserva),
                        success: function(response) {
                            document.getElementById('cpf').value = response.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                            document.getElementById('nome').value = response.nome;
                            document.getElementById('quarto').value = response.num_quarto;
                            document.getElementById('tipo_servico').value = response.id_service_plan;
                            document.getElementById('tipo_pagamento').value = response.id_pag;
                            document.getElementById('checkin_in').value = formatarDataBanco(response.date_check_in);
                            document.getElementById('checkin_out').value = formatarDataBanco(response.date_check_out);
                            alert('Reserva atualizada com sucesso!');
                        },
                        error: function(error) {
                            console.error('Erro ao atualizar reserva:', error);
                            alert('Erro ao atualizar reserva. Verifique o console para mais detalhes.');
                        }
                    });
                } catch (err) {
                    console.error('Erro ao realizar a atualização:', err);
                    alert('Erro ao realizar a atualização. Verifique o console para mais detalhes.');
                }
            } else {
                alert('A reserva com o ID especificado não foi encontrada.');
            }
        },
        error: function(error) {
            console.error('Erro ao verificar reserva:', error);
            alert('Erro ao verificar reserva. Verifique o console para mais detalhes.');
        }
    });
}

function removerReserva() {
    const id_reserva = $('#numero_reserva').val(); // Supondo que o número da reserva esteja no campo 'numero_reserva'
    $.ajax({
        url: `/reserva/${id_reserva}`,
        type: 'DELETE',
        success: function(response) {
            alert(response.message);
            limparReserva(); // Limpa os campos do formulário após a remoção
        },
        error: function(error) {
            console.error('Erro ao remover reserva:', error);
            alert('Erro ao remover reserva. Verifique o console para mais detalhes.');
        }
    });
}

function pesquisarHospede() {
    const cpfHospede = cpfParaNumeros(document.getElementById('cpf').value);

    // Realiza a solicitação usando fetch
    fetch('/hospede/' + cpfHospede)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao pesquisar hospede');
            }
            return response.json();
        })
        .then(hospede => {
            // Manipula a resposta recebida do servidor

            // Preenche os outros campos com os valores do hospede
            document.getElementById('cpf').value = hospede.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            document.getElementById('nome').value = hospede.nome;
            document.getElementById('dtcNasc').value = formatarDataBanco(hospede.data_nasc);
            document.getElementById('genero').value = hospede.genero;
        })
        .catch(error => {
            // Manipula erros de solicitação
            console.error('Erro ao pesquisar hospede:', error);
            alert('Erro ao pesquisar hospede: ' + error.message);
        });
}

function cadastrarHospede() {
    // Obtém os valores inseridos nos campos do formulário
    const cpf_resp = cpfParaNumeros($('#cpf').val());
    const data_nasc = $('#dtcNasc').val();
    const genero = $('#genero').val();
    const nome = $('#nome').val();

    // Cria um objeto com os dados da hospede
    const hospede = {
        cpf_resp: cpf_resp,
        data_nasc: data_nasc,
        genero: genero,
        nome: nome
    };

    // Realiza a solicitação AJAX usando jQuery
    $.ajax({
        url: '/hospede',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(hospede),
        success: function(response) {
            document.getElementById('cpf').value = response.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            document.getElementById('nome').value = response.nome;
            document.getElementById('dtcNasc').value = formatarDataBanco(response.data_nasc);
            document.getElementById('genero').value = response.genero;
            alert('Reserva cadastrada com sucesso!');
        },
        error: function(error) {
            console.error('Erro ao cadastrar hospede:', error);
            alert('Erro ao cadastrar hospede. Verifique o console para mais detalhes.');
        }
    });
}

async function atualizarHospede() {
    // Obtém os valores inseridos nos campos do formulário
    const cpf_resp = cpfParaNumeros($('#cpf').val());
    const data_nasc = $('#dtcNasc').val();
    const genero = $('#genero').val();
    const nome = $('#nome').val();

    // Cria um objeto com os dados da reserva
    const hospede = {
        cpf_resp: cpf_resp,
        data_nasc: data_nasc,
        genero: genero,
        nome: nome
    };

    // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
    $.ajax({
        url: `/hospede/${cpf_resp}`,
        type: 'GET',
        success: async function(response) {
            if (response) {
                // A hospede existe, então podemos prosseguir com a atualização
                try {
                    await $.ajax({
                        url: `/hospede/${cpf_resp}`, 
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(hospede),
                        success: function(response) {
                            document.getElementById('cpf').value = response.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                            document.getElementById('nome').value = response.nome;
                            document.getElementById('dtcNasc').value = formatarDataBanco(response.data_nasc);
                            document.getElementById('genero').value = response.genero;
                            alert('Reserva atualizada com sucesso!');
                        },
                        error: function(error) {
                            console.error('Erro ao atualizar Hospede:', error);
                            alert('Erro ao atualizar Hospede. Verifique o console para mais detalhes.');
                        }
                    });
                } catch (err) {
                    console.error('Erro ao realizar a atualização:', err);
                    alert('Erro ao realizar a atualização. Verifique o console para mais detalhes.');
                }
            } else {
                alert('A Hospede com o CPD especificado não foi encontrada.');
            }
        },
        error: function(error) {
            console.error('Erro ao verificar Hospede:', error);
            alert('Erro ao verificar Hospede. Verifique o console para mais detalhes.');
        }
    });
}

function removerHospede() {
    const cpf_resp = cpfParaNumeros($('#cpf').val());
    $.ajax({
        url: `/hospede/${cpf_resp}`,
        type: 'DELETE',
        success: function(response) {
            alert(response.message);
            limparHospede(); // Limpa os campos do formulário após a remoção
        },
        error: function(error) {
            console.error('Erro ao remover hospede:', error);
            alert('Erro ao remover hospede. Verifique o console para mais detalhes.');
        }
    });
}

function pesquisarQuarto() {
    const idReserva = $('#idReserva').val();
    
    $.ajax({
        url: `/quarto/reserva/${idReserva}`,
        type: 'GET',
        success: function(response) {
            // Limpa a tabela antes de preenchê-la
            $('#tabelaQuartos tbody').empty();
            limparTabela();
            // Preenche a tabela com os quartos encontrados
            response.forEach(quarto => {
                $('#tabelaQuartos tbody').append(`
                    <tr>
                        <td><input type="number" value="${quarto.num_quarto}" readonly style="border: none;"></td>
                        <td><input type="text" value="${quarto.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00" readonly style="border: none;"></td>
                        <td>
                            <select>
                                <option value="1" ${quarto.status_quarto == 1 ? 'selected' : ''}>Sim</option>
                                <option value="2" ${quarto.status_quarto == 2 ? 'selected' : ''}>Não</option>
                            </select>
                        </td>
                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_in)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>
                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_out)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>    
                        <td><input type="number" value="${quarto.id_reserva}" id="idReservaTable${quarto.num_quarto}"></td>
                        <td>
                            <button onclick="atualizarQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-primary">Atualizar</button>
                            <button onclick="removerQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-danger">Remover</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(error) {
            console.error('Erro ao pesquisar quartos por reserva:', error);
            alert('Erro ao pesquisar quartos por reserva. Verifique o console para mais detalhes.');
        }
    });
}


function cadastrarQuarto() {
    // Obtém os valores inseridos nos campos do formulário
    const num_quarto = $('#numero_quarto').val();
    const status_quarto_ocupado = $('#ocupado_sim').is(':checked');
    const status_quarto_livre = $('#ocupado_nao').is(':checked');
    const id_reserva = $('#idReserva').val();

    // Cria um objeto com os dados da hospede
    const quarto = {
        num_quarto: num_quarto,
        status_quarto_ocupado: status_quarto_ocupado,
        status_quarto_livre: status_quarto_livre,
        id_reserva: id_reserva
    };

    // Realiza a solicitação AJAX usando jQuery
    $.ajax({
        url: '/quarto',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(quarto),
        success: function(response) {
            limparTabela();
            response.forEach(quarto => {
                $('#tabelaQuartos tbody').append(`
                    <tr>
                        <td><input type="number" value="${quarto.num_quarto}" readonly style="border: none;"></td>
                        <td><input type="text" value="${quarto.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00" readonly style="border: none;"></td>
                        <td>
                            <select>
                                <option value="1" ${quarto.status_quarto == 1 ? 'selected' : ''}>Sim</option>
                                <option value="2" ${quarto.status_quarto == 2 ? 'selected' : ''}>Não</option>
                            </select>
                        </td>
                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_in)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>
                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_out)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>    
                        <td><input type="number" value="${quarto.id_reserva}" id="idReservaTable${quarto.num_quarto}"></td>
                        <td>
                            <button onclick="atualizarQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-primary">Atualizar</button>
                            <button onclick="removerQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-danger">Remover</button>
                        </td>
                    </tr>
                `);
            });
            alert('Quarto cadastrada com sucesso!');
        },
        error: function(error) {
            console.error('Erro ao cadastrar quarto:', error);
            alert('Erro ao cadastrar quarto. Verifique o console para mais detalhes.');
        }
    });
}

function atualizarQuarto(num_quarto, id_reserva_go) {
    // Obtém os valores inseridos nos campos do formulário
    const status_quarto_ocupado = $('#ocupado_sim').is(':checked');
    const status_quarto_livre = $('#ocupado_nao').is(':checked');
    const id_reserva = $('#idReserva').val();

    // Cria um objeto com os dados da reserva
    const quarto = {
        num_quarto: num_quarto,
        status_quarto_ocupado: status_quarto_ocupado,
        status_quarto_livre: status_quarto_livre,
        id_reserva: id_reserva,
        id_reserva_go: id_reserva_go
    };

    // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
    $.ajax({
        url: `/quarto/numero/${num_quarto}`,
        type: 'GET',
        success: async function(response) {
            if (response) {
                // A Quarto existe, então podemos prosseguir com a atualização
                try {
                    await $.ajax({
                        url: `/quarto/${num_quarto}`, 
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(quarto),
                        success: function(response) {
                            limparTabela();
                            response.forEach(quarto => {
                                $('#tabelaQuartos tbody').append(`
                                    <tr>
                                        <td><input type="number" value="${quarto.num_quarto}" readonly style="border: none;"></td>
                                        <td><input type="text" value="${quarto.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00" readonly style="border: none;"></td>
                                        <td>
                                            <select>
                                                <option value="1" ${quarto.status_quarto == 1 ? 'selected' : ''}>Sim</option>
                                                <option value="2" ${quarto.status_quarto == 2 ? 'selected' : ''}>Não</option>
                                            </select>
                                        </td>
                                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_in)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>
                                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_out)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>    
                                        <td><input type="number" value="${quarto.id_reserva}" id="idReservaTable${quarto.num_quarto}"></td>
                                        <td>
                                            <button onclick="atualizarQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-primary">Atualizar</button>
                                            <button onclick="removerQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-danger">Remover</button>
                                        </tr>
                                `);
                            });
                            alert('Quarto atualizada com sucesso!');
                        },
                        error: function(error) {
                            console.error('Erro ao atualizar Quarto:', error);
                            alert('Erro ao atualizar Quarto. Verifique o console para mais detalhes.');
                        }
                    });
                } catch (err) {
                    console.error('Erro ao realizar a atualização:', err);
                    alert('Erro ao realizar a atualização. Verifique o console para mais detalhes.');
                }
            } else {
                alert('A Quarto com o numero especificado não foi encontrada.');
            }
        },
        error: function(error) {
            console.error('Erro ao verificar Hospede:', error);
            alert('Erro ao verificar Hospede. Verifique o console para mais detalhes.');
        }
    });
}

function removerQuarto(num_quarto, id_reserva) {
    // Obtém os valores inseridos nos campos do formulário
    const status_quarto_ocupado = $('#ocupado_sim').is(':checked');
    const status_quarto_livre = $('#ocupado_nao').is(':checked');
    //const id_reserva = $('#idReserva').val();
    //const teste = $(`#idReservaTable${num_quarto}`).val();

    // Cria um objeto com os dados da reserva
    const quarto = {
        num_quarto: num_quarto,
        status_quarto_ocupado: status_quarto_ocupado,
        status_quarto_livre: status_quarto_livre,
        id_reserva: id_reserva
    };

    $.ajax({
        url: `/quarto/${num_quarto}`,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(quarto),
        success: function(response) {
            limparTabela(); // Limpa os campos do formulário após a remoção
            response.forEach(quarto => {
                $('#tabelaQuartos tbody').append(`
                    <tr>
                        <td><input type="number" value="${quarto.num_quarto}" readonly style="border: none;"></td>
                        <td><input type="text" value="${quarto.cpf_resp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00" readonly style="border: none;"></td>
                        <td>
                            <select>
                                <option value="1" ${quarto.status_quarto == 1 ? 'selected' : ''}>Sim</option>
                                <option value="2" ${quarto.status_quarto == 2 ? 'selected' : ''}>Não</option>
                            </select>
                        </td>
                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_in)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>
                        <td><input type="text" value="${formatarDataBanco(quarto.date_check_out)}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>    
                        <td><input type="number" value="${quarto.id_reserva}" id="idReservaTable${quarto.num_quarto}"></td>
                        <td>
                            <button onclick="atualizarQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-primary">Atualizar</button>
                            <button onclick="removerQuarto(${quarto.num_quarto}, $('#idReservaTable${quarto.num_quarto}').val())" class="btn btn-danger">Remover</button>
                        </td>
                    </tr>
                `);
            });
            //alert(response.message);
            alert('Sucesso');
        },
        error: function(error) {
            console.error('Erro ao remover quarto:', error);
            alert('Erro ao remover quarto. Verifique o console para mais detalhes.');
        }
    });
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

$(document).ready(function() {
    // Adiciona a opção "Selecione" ao campo tipo_servico
    $('#tipo_servico').append('<option value="">Selecione</option>');

    // Realiza a requisição AJAX para obter os dados dos tipos de serviço
    $.ajax({
        url: '/tiposervico',
        type: 'GET',
        dataType: 'json', // Força a interpretação da resposta como JSON
        success: function(data) {
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

$(document).ready(function() {
    // Adiciona a opção "Selecione" ao campo tipo_servico
    $('#tipo_pagamento').append('<option value="">Selecione</option>');

    // Realiza a requisição AJAX para obter os dados dos tipos de serviço
    $.ajax({
        url: '/tipopagamento',
        type: 'GET',
        dataType: 'json', // Força a interpretação da resposta como JSON
        success: function(data) {
            // Adiciona as novas opções ao campo tipo_servico
            data.forEach(function(opcao) {
                var option = $('<option></option>').attr('value', opcao.id_pag).text(opcao.nom_pag);
                $('#tipo_pagamento').append(option);
            });
        },
        error: function(error) {
            console.error('Erro ao carregar opções do tipo de pagamento:', error);
        }
    });
});

$(document).ready(function() {
    // Adiciona a opção "Selecione" ao campo tipo_servico
    $('#genero').append('<option value="">Selecione</option>');

    // Realiza a requisição AJAX para obter os dados dos tipos de serviço
    $.ajax({
        url: '/genero',
        type: 'GET',
        dataType: 'json', // Força a interpretação da resposta como JSON
        success: function(data) {
            // Adiciona as novas opções ao campo tipo_servico
            data.forEach(function(opcao) {
                var option = $('<option></option>').attr('value', opcao.id_gen).text(opcao.nom_genero);
                $('#genero').append(option);
            });
        },
        error: function(error) {
            console.error('Erro ao carregar opções do tipo de genero:', error);
        }
    });
});

function formatarCPF(campo) {
    var valor = campo.value.replace(/\D/g, '');
    if (valor.length > 3) {
        valor = valor.substring(0, 3) + '.' + valor.substring(3);
    }
    if (valor.length > 7) {
        valor = valor.substring(0, 7) + '.' + valor.substring(7);
    }
    if (valor.length > 11) {
        valor = valor.substring(0, 11) + '-' + valor.substring(11);
    }
    campo.value = valor;
}

function formatarData(input) {
    var valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    // Verifica se o valor está vazio
    if (valor.length === 0) {
        return;
    }

    // Verifica se o valor ultrapassou o tamanho máximo
    if (valor.length > 8) {
        valor = valor.substring(0, 8);
    }

    // Formata a data
    var dataFormatada = valor.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');

    // Atualiza o valor do campo de entrada com a data formatada
    input.value = dataFormatada;
}

function formatarDataBanco(data) {
    // Verifica se a entrada é uma string e se está no formato 'yyyy/mm/dd'
    if (typeof data === 'string' && /^\d{4}\-\d{2}\-\d{2}$/.test(data)) {
        // Dividindo a data em partes (ano, mês, dia)
        var partes = data.split('-');

        // Reorganizando as partes na ordem desejada (dia, mês, ano)
        var dataFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
        // Retorna a data formatada
        return dataFormatada;
    } else {
        // Retorna a própria data se não estiver no formato correto
        return data;
    }
}

function cpfParaNumeros(cpf) {
    // Remove todos os caracteres que não são dígitos e converte para inteiro
    return parseInt(cpf.replace(/\D/g, ''));
}

function limparReserva() {
    // Limpa os valores dos campos do formulário
    document.getElementById('numero_reserva').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('quarto').value = '';
    document.getElementById('tipo_servico').value = '';
    document.getElementById('tipo_pagamento').value = '';
    document.getElementById('checkin_in').value = '';
    document.getElementById('checkin_out').value = '';
}

function limparHospede() {
    // Limpa os valores dos campos do formulário
    document.getElementById('cpf').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('dtcNasc').value = '';
}

function limparQuarto(){
    // Limpa os campos de entrada
    $('#numero_quarto').val('');
    $('#ocupado_sim').prop('checked', false);
    $('#ocupado_nao').prop('checked', false);
    $('#idReserva').val('');
}

function limparTabela(){
    $('#tabelaQuartos tbody').empty();
}
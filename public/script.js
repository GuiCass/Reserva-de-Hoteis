function pesquisarReserva() {
  const numeroReserva = document.getElementById("numero_reserva").value;

  $.ajax({
    url: `/reserva/all`,
    type: "GET",
    success: function (response) {
      // Limpa a tabela antes de preenchê-la
      $("#tabelaReserva tbody").empty();
      limparReserva(); // Limpa os campos do formulário após a remoção
      limparTabelaReserva();
      response.forEach((reserva) => {
        tabelaReserva(reserva);
      });
    },
    error: function (error) {
      console.error("Erro ao pesquisar reserva:", error);
      alert(
        "Erro ao pesquisar reserva. Verifique o console para mais detalhes."
      );
    },
  });
}

function cadastrarReserva() {
  // Obtém os valores inseridos nos campos do formulário
  const id_reserva = $("#numero_reserva").val();
  const cpf_resp = cpfParaNumeros($("#cpf").val());
  const id_service_plan = $("#tipo_servico").val();
  const id_pag = $("#tipo_pagamento").val();
  const date_check_in = $("#checkin_in").val();
  const date_check_out = $("#checkin_out").val();
  const nome = $("#nome").val();

  // Cria um objeto com os dados da reserva
  const reserva = {
    id_reserva: id_reserva,
    cpf_resp: cpf_resp,
    id_service_plan: id_service_plan,
    id_pag: id_pag,
    date_check_in: date_check_in,
    date_check_out: date_check_out,
    nome: nome,
  };

  // Realiza a solicitação AJAX usando jQuery
  $.ajax({
    url: "/reserva",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(reserva),
    success: function (response) {
      pesquisarReserva();
      alert("Reserva cadastrada com sucesso!");
    },
    error: function (error) {
      console.error("Erro ao cadastrar reserva:", error);
      alert(
        "Erro ao cadastrar reserva. Verifique o console para mais detalhes."
      );
    },
  });
}

async function atualizarReserva(id_reserva_) {
  // Obtém os valores inseridos nos campos do formulário
  const id_reserva = id_reserva_;
  let cpf_resp = $(`#idCPFTable${id_reserva_}`).val();
  const id_service_plan = $(`#idServicoTable${id_reserva_}`).val();
  const id_pag = $(`#idPagTable${id_reserva_}`).val();
  const date_check_in = $(`#idInTable${id_reserva_}`).val();
  const date_check_out = $(`#idOutTable${id_reserva_}`).val();
  const nome = $(`#idNomeTable${id_reserva_}`).val();

  // Formata o CPF para deixar apenas números
  cpf_resp = cpf_resp.replace(/\D/g, "");

  // Cria um objeto com os dados da reserva
  const reserva = {
    id_reserva: id_reserva,
    cpf_resp: cpf_resp,
    id_service_plan: id_service_plan,
    id_pag: id_pag,
    date_check_in: date_check_in,
    date_check_out: date_check_out,
    nome: nome,
  };

  // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
  $.ajax({
    url: `/reserva/${id_reserva}`, // Assume que existe um endpoint GET /reserva/:id_reserva no servidor
    type: "GET",
    success: async function (response) {
      if (response) {
        // A reserva existe, então podemos prosseguir com a atualização
        try {
          await $.ajax({
            url: `/reserva/${id_reserva}`, // Assume que existe um endpoint PUT /reserva/:id_reserva no servidor para atualização
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(reserva),
            success: function (response) {
              pesquisarReserva();
              alert("Reserva atualizada com sucesso!");
            },
            error: function (error) {
              console.error("Erro ao atualizar reserva:", error);
              alert(
                "Erro ao atualizar reserva. Verifique o console para mais detalhes."
              );
            },
          });
        } catch (err) {
          console.error("Erro ao realizar a atualização:", err);
          alert(
            "Erro ao realizar a atualização. Verifique o console para mais detalhes."
          );
        }
      } else {
        alert("A reserva com o ID especificado não foi encontrada.");
      }
    },
    error: function (error) {
      console.error("Erro ao verificar reserva:", error);
      alert(
        "Erro ao verificar reserva. Verifique o console para mais detalhes."
      );
    },
  });
}

function removerReserva(id_reserva_) {
  const id_reserva = id_reserva_;
  $.ajax({
    url: `/reserva/${id_reserva}`,
    type: "DELETE",
    success: function (response) {
      pesquisarReserva();
      alert(response.message);
    },
    error: function (error) {
      console.error("Erro ao remover reserva:", error);
      alert("Erro ao remover reserva. Verifique o console para mais detalhes.");
    },
  });
}

function pesquisarHospede() {
  $.ajax({
    url: `/hospede/all`,
    type: "GET",
    success: function (response) {
      // Limpa a tabela antes de preenchê-la
      $("#tabelaHospede tbody").empty();
      limparHospede(); // Limpa os campos do formulário após a remoção
      limparTabelaHospede();
      response.forEach((hospede) => {
        tabelaHospede(hospede);
      });
    },
    error: function (error) {
      console.error("Erro ao pesquisar quartos por reserva:", error);
      alert(
        "Erro ao pesquisar quartos por reserva. Verifique o console para mais detalhes."
      );
    },
  });
}

function cadastrarHospede() {
  // Obtém os valores inseridos nos campos do formulário
  const cpf_resp = cpfParaNumeros($("#cpf").val());
  const data_nasc = $("#dtcNasc").val();
  const genero = $("#genero").val();
  const nome = $("#nome").val();

  // Cria um objeto com os dados da hospede
  const hospede = {
    cpf_resp: cpf_resp,
    data_nasc: data_nasc,
    genero: genero,
    nome: nome,
  };

  // Realiza a solicitação AJAX usando jQuery
  $.ajax({
    url: "/hospede",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(hospede),
    success: function (response) {
      pesquisarHospede();
      alert("Reserva cadastrada com sucesso!");
    },
    error: function (error) {
      console.error("Erro ao cadastrar hospede:", error);
      alert(
        "Erro ao cadastrar hospede. Verifique o console para mais detalhes."
      );
    },
  });
}

async function atualizarHospede(cpf_resp_) {
  // Obtém os valores inseridos nos campos do formulário
  const cpf_resp = cpf_resp_;
  const data_nasc = $(`#idNascimentoTable${cpf_resp_}`).val();
  const genero = $(`#idGeneroTable${cpf_resp_}`).val();
  const nome = $(`#idNomeTable${cpf_resp_}`).val();
  console.log(cpf_resp, data_nasc, genero, nome);

  // Cria um objeto com os dados da reserva
  const hospede = {
    cpf_resp: cpf_resp,
    data_nasc: data_nasc,
    genero: genero,
    nome: nome,
  };

  // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
  $.ajax({
    url: `/hospede/${cpf_resp}`,
    type: "GET",
    success: async function (response) {
      if (response) {
        // A hospede existe, então podemos prosseguir com a atualização
        try {
          await $.ajax({
            url: `/hospede/${cpf_resp}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(hospede),
            success: function (response) {
              pesquisarHospede();
              alert("Reserva atualizada com sucesso!");
            },
            error: function (error) {
              console.error("Erro ao atualizar Hospede:", error);
              alert(
                "Erro ao atualizar Hospede. Verifique o console para mais detalhes."
              );
            },
          });
        } catch (err) {
          console.error("Erro ao realizar a atualização:", err);
          alert(
            "Erro ao realizar a atualização. Verifique o console para mais detalhes."
          );
        }
      } else {
        alert("A Hospede com o CPD especificado não foi encontrada.");
      }
    },
    error: function (error) {
      console.error("Erro ao verificar Hospede:", error);
      alert(
        "Erro ao verificar Hospede. Verifique o console para mais detalhes."
      );
    },
  });
}

function removerHospede(cpf_resp) {
  const cpf_resp_ = cpf_resp;
  $.ajax({
    url: `/hospede/${cpf_resp_}`,
    type: "DELETE",
    success: function (response) {
      pesquisarHospede();
      alert(response.message);
    },
    error: function (error) {
      console.error("Erro ao remover hospede:", error);
      alert("Erro ao remover hospede. Verifique o console para mais detalhes.");
    },
  });
}

function pesquisarQuarto() {
  const idReserva = $("#idReserva").val();

  $.ajax({
    url: `/quarto/reserva/${idReserva}`,
    type: "GET",
    success: function (response) {
      // Limpa a tabela antes de preenchê-la
      $("#tabelaQuartos tbody").empty();
      limparTabela();
      // Preenche a tabela com os quartos encontrados
      response.forEach((quarto) => {
        tabelaQuarto(quarto);
      });
    },
    error: function (error) {
      console.error("Erro ao pesquisar quartos por reserva:", error);
      alert(
        "Erro ao pesquisar quartos por reserva. Verifique o console para mais detalhes."
      );
    },
  });
}

function cadastrarQuarto() {
  // Obtém os valores inseridos nos campos do formulário
  const num_quarto = $("#numero_quarto").val();
  const status_quarto_ocupado = $("#ocupado_sim").is(":checked");
  const status_quarto_livre = $("#ocupado_nao").is(":checked");
  const id_reserva = $("#idReserva").val();

  // Cria um objeto com os dados da hospede
  const quarto = {
    num_quarto: num_quarto,
    status_quarto_ocupado: status_quarto_ocupado,
    status_quarto_livre: status_quarto_livre,
    id_reserva: id_reserva,
  };

  // Realiza a solicitação AJAX usando jQuery
  $.ajax({
    url: "/quarto",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(quarto),
    success: function (response) {
      limparTabela();
      response.forEach((quarto) => {
        tabelaQuarto(quarto);
      });
      alert("Quarto cadastrada com sucesso!");
    },
    error: function (error) {
      console.error("Erro ao cadastrar quarto:", error);
      alert(
        "Erro ao cadastrar quarto. Verifique o console para mais detalhes."
      );
    },
  });
}

function atualizarQuarto(num_quarto, id_reserva_go) {
  // Obtém os valores inseridos nos campos do formulário
  const status_quarto_ocupado2 = $("#ocupado_sim").is(":checked");
  const status_quarto_ocupado = $(`#idStsQuarto${num_quarto}`).val();
  const id_reserva = $("#idReserva").val();

  // Cria um objeto com os dados da reserva
  const quarto = {
    num_quarto: num_quarto,
    status_quarto_ocupado: status_quarto_ocupado,
    id_reserva: id_reserva,
    id_reserva_go: id_reserva_go,
  };

  // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
  $.ajax({
    url: `/quarto/numero/${num_quarto}`,
    type: "GET",
    success: async function (response) {
      if (response) {
        // A Quarto existe, então podemos prosseguir com a atualização
        try {
          await $.ajax({
            url: `/quarto/${num_quarto}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(quarto),
            success: function (response) {
              limparTabela();
              response.forEach((quarto) => {
                tabelaQuarto(quarto);
              });
              alert("Quarto atualizada com sucesso!");
            },
            error: function (error) {
              console.error("Erro ao atualizar Quarto:", error);
              alert(
                "Erro ao atualizar Quarto. Verifique o console para mais detalhes."
              );
            },
          });
        } catch (err) {
          console.error("Erro ao realizar a atualização:", err);
          alert(
            "Erro ao realizar a atualização. Verifique o console para mais detalhes."
          );
        }
      } else {
        alert("A Quarto com o numero especificado não foi encontrada.");
      }
    },
    error: function (error) {
      console.error("Erro ao verificar Hospede:", error);
      alert(
        "Erro ao verificar Hospede. Verifique o console para mais detalhes."
      );
    },
  });
}

function removerQuarto(num_quarto, id_reserva) {
  // Obtém os valores inseridos nos campos do formulário
  const status_quarto_ocupado = $("#ocupado_sim").is(":checked");
  const status_quarto_livre = $("#ocupado_nao").is(":checked");

  // Cria um objeto com os dados da reserva
  const quarto = {
    num_quarto: num_quarto,
    status_quarto_ocupado: status_quarto_ocupado,
    status_quarto_livre: status_quarto_livre,
    id_reserva: id_reserva,
  };

  $.ajax({
    url: `/quarto/${num_quarto}`,
    type: "DELETE",
    contentType: "application/json",
    data: JSON.stringify(quarto),
    success: function (response) {
      limparTabela(); // Limpa os campos do formulário após a remoção
      response.forEach((quarto) => {
        tabelaQuarto(quarto);
      });
      //alert(response.message);
      alert("Sucesso");
    },
    error: function (error) {
      console.error("Erro ao remover quarto:", error);
      alert("Erro ao remover quarto. Verifique o console para mais detalhes.");
    },
  });
}

function pesquisarAnimal() {
  const numReserva = $("#numero_reserva").val();

  $.ajax({
    url: `/animal/reserva/${numReserva}`,
    type: "GET",
    success: function (response) {
      // Limpa a tabela antes de preenchê-la
      $("#tabelaAnimal tbody").empty();
      limparTabelaAnimal();
      // Preenche a tabela com os quartos encontrados
      response.forEach((animal) => {
        tabelaAnimal(animal);
      });
    },
    error: function (error) {
      console.error("Erro ao pesquisar quartos por reserva:", error);
      alert(
        "Erro ao pesquisar quartos por reserva. Verifique o console para mais detalhes."
      );
    },
  });
}

function cadastrarAnimal() {
  // Obtém os valores inseridos nos campos do formulário
  const numero_reserva = $("#numero_reserva").val();
  const nom_animal = $("#nom_animal").val();
  const status_quarto_ocupado = $("#pedigre_sim").is(":checked");
  const raca = $("#raca").val();

  // Cria um objeto com os dados do animal
  const animal = {
    numero_reserva: numero_reserva,
    nom_animal: nom_animal,
    status_quarto_ocupado: status_quarto_ocupado,
    raca: raca,
  };

  // Realiza a solicitação AJAX para cadastrar o animal
  $.ajax({
    url: "/animal",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(animal),
    success: function (response) {
      // Limpa a tabela
      limparTabelaAnimal();

      // Carrega os dados do animal na tabela
      response.forEach((animal) => {
        tabelaAnimal(animal);
      });

      alert("Animal cadastrado com sucesso!");
    },
    error: function (error) {
      console.error("Erro ao cadastrar animal:", error);
      alert(
        "Erro ao cadastrar animal. Verifique o console para mais detalhes."
      );
    },
  });
}

function atualizarAnimal(id_animal, reserva_go, nome_go, raga_go, ped_go) {
  // Obtém os valores inseridos nos campos do formulário
  const numero_reserva = $("#numero_reserva").val();
  const nom_animal = $("#nom_animal").val();
  const status_quarto_ocupado = $(`#idPedigreTable${id_animal}`).val();
  const raca = $("#raca").val();
  console.log(status_quarto_ocupado);
  // Cria um objeto com os dados do animal
  const animal = {
    numero_reserva: numero_reserva,
    nom_animal: nom_animal,
    status_quarto_ocupado: status_quarto_ocupado,
    raca: raca,
    id_animal: id_animal,
    reserva_go: reserva_go,
    nome_go: nome_go,
    raga_go: raga_go,
    ped_go: ped_go,
  };

  // Realiza a solicitação AJAX usando jQuery para verificar se a reserva existe
  $.ajax({
    url: `/animal/id/${id_animal}`,
    type: "GET",
    success: async function (response) {
      if (response) {
        // A Quarto existe, então podemos prosseguir com a atualização
        try {
          await $.ajax({
            url: `/animal/${id_animal}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(animal),
            success: function (response) {
              limparTabelaAnimal();
              response.forEach((animal) => {
                tabelaAnimal(animal);
              });
              alert("Animal atualizada com sucesso!");
            },
            error: function (error) {
              console.error("Erro ao atualizar Quarto:", error);
              alert(
                "Erro ao atualizar Animal. Verifique o console para mais detalhes."
              );
            },
          });
        } catch (err) {
          console.error("Erro ao realizar a atualização:", err);
          alert(
            "Erro ao realizar a atualização. Verifique o console para mais detalhes."
          );
        }
      } else {
        alert("A Animal com o numero especificado não foi encontrada.");
      }
    },
    error: function (error) {
      console.error("Erro ao verificar Animal:", error);
      alert(
        "Erro ao verificar Animal. Verifique o console para mais detalhes."
      );
    },
  });
}

function removerAnimal(id_animal, reserva_go, nome_go, raga_go, ped_go) {
  // Obtém os valores inseridos nos campos do formulário
  const numero_reserva = $("#numero_reserva").val();
  const nom_animal = $("#nom_animal").val();
  const status_quarto_ocupado = $("#ocupado_sim").is(":checked");
  const raca = $("#raca").val();

  // Cria um objeto com os dados do animal
  const animal = {
    numero_reserva: numero_reserva,
    nom_animal: nom_animal,
    status_quarto_ocupado: status_quarto_ocupado,
    raca: raca,
    id_animal: id_animal,
    reserva_go: reserva_go,
    nome_go: nome_go,
    raga_go: raga_go,
    ped_go: ped_go,
  };

  $.ajax({
    url: `/animal/${id_animal}`,
    type: "DELETE",
    contentType: "application/json",
    data: JSON.stringify(animal),
    success: function (response) {
      limparTabelaAnimal(); // Limpa os campos do formulário após a remoção
      response.forEach((animal) => {
        tabelaAnimal(animal);
      });
      //alert(response.message);
      alert("Sucesso");
    },
    error: function (error) {
      console.error("Erro ao remover quarto:", error);
      alert("Erro ao remover quarto. Verifique o console para mais detalhes.");
    },
  });
}

// Seleção exclusiva dos checkboxes
const checkboxes = document.querySelectorAll(
  '.checkbox-select input[type="checkbox"]'
);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    checkboxes.forEach((otherCheckbox) => {
      if (otherCheckbox !== checkbox) {
        otherCheckbox.checked = false;
      }
    });
  });
});

$(document).ready(function () {
  // Adiciona a opção "Selecione" ao campo tipo_servico
  $("#tipo_servico").append('<option value="">Selecione</option>');

  // Realiza a requisição AJAX para obter os dados dos tipos de serviço
  $.ajax({
    url: "/tiposervico",
    type: "GET",
    dataType: "json", // Força a interpretação da resposta como JSON
    success: function (data) {
      // Adiciona as novas opções ao campo tipo_servico
      data.forEach(function (opcao) {
        var option = $("<option></option>")
          .attr("value", opcao.id_service_plan)
          .text(opcao.nom_service);
        $("#tipo_servico").append(option);
      });
    },
    error: function (error) {
      console.error("Erro ao carregar opções do tipo de serviço:", error);
    },
  });
});

$(document).ready(function () {
  // Adiciona a opção "Selecione" ao campo tipo_servico
  $("#tipo_pagamento").append('<option value="">Selecione</option>');

  // Realiza a requisição AJAX para obter os dados dos tipos de serviço
  $.ajax({
    url: "/tipopagamento",
    type: "GET",
    dataType: "json", // Força a interpretação da resposta como JSON
    success: function (data) {
      // Adiciona as novas opções ao campo tipo_servico
      data.forEach(function (opcao) {
        var option = $("<option></option>")
          .attr("value", opcao.id_pag)
          .text(opcao.nom_pag);
        $("#tipo_pagamento").append(option);
      });
    },
    error: function (error) {
      console.error("Erro ao carregar opções do tipo de pagamento:", error);
    },
  });
});

$(document).ready(function () {
  // Adiciona a opção "Selecione" ao campo tipo_servico
  $("#genero").append('<option value="">Selecione</option>');

  // Realiza a requisição AJAX para obter os dados dos tipos de serviço
  $.ajax({
    url: "/genero",
    type: "GET",
    dataType: "json", // Força a interpretação da resposta como JSON
    success: function (data) {
      // Adiciona as novas opções ao campo tipo_servico
      data.forEach(function (opcao) {
        var option = $("<option></option>")
          .attr("value", opcao.id_gen)
          .text(opcao.nom_genero);
        $("#genero").append(option);
      });
    },
    error: function (error) {
      console.error("Erro ao carregar opções do tipo de genero:", error);
    },
  });
});

$(document).ready(function () {
  // Adiciona a opção "Selecione" ao campo tipo_servico
  $("#raca").append('<option value="">Selecione</option>');

  // Realiza a requisição AJAX para obter os dados dos tipos de serviço
  $.ajax({
    url: "/raca",
    type: "GET",
    dataType: "json", // Força a interpretação da resposta como JSON
    success: function (data) {
      // Adiciona as novas opções ao campo tipo_servico
      data.forEach(function (opcao) {
        var option = $("<option></option>")
          .attr("value", opcao.id_raca)
          .text(opcao.nom_raca);
        $("#raca").append(option);
      });
    },
    error: function (error) {
      console.error("Erro ao carregar opções do tipo de raca:", error);
    },
  });
});

function formatarCPF(campo) {
  var valor = campo.value.replace(/\D/g, "");
  if (valor.length > 3) {
    valor = valor.substring(0, 3) + "." + valor.substring(3);
  }
  if (valor.length > 7) {
    valor = valor.substring(0, 7) + "." + valor.substring(7);
  }
  if (valor.length > 11) {
    valor = valor.substring(0, 11) + "-" + valor.substring(11);
  }
  campo.value = valor;
}

function formatarData(input) {
  var valor = input.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

  // Verifica se o valor está vazio
  if (valor.length === 0) {
    return;
  }

  // Verifica se o valor ultrapassou o tamanho máximo
  if (valor.length > 8) {
    valor = valor.substring(0, 8);
  }

  // Formata a data
  var dataFormatada = valor.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");

  // Atualiza o valor do campo de entrada com a data formatada
  input.value = dataFormatada;
}

function formatarDataBanco(data) {
  // Verifica se a entrada é uma string e se está no formato 'yyyy/mm/dd'
  if (typeof data === "string" && /^\d{4}\-\d{2}\-\d{2}$/.test(data)) {
    // Dividindo a data em partes (ano, mês, dia)
    var partes = data.split("-");

    // Reorganizando as partes na ordem desejada (dia, mês, ano)
    var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
    // Retorna a data formatada
    return dataFormatada;
  } else {
    // Retorna a própria data se não estiver no formato correto
    return data;
  }
}

function cpfParaNumeros(cpf) {
  // Remove todos os caracteres que não são dígitos e converte para inteiro
  return parseInt(cpf.replace(/\D/g, ""));
}

function limparReserva() {
  $("#numero_reserva").val("");
  $("#cpf").val("");
  $("#nome").val("");
  $("#quarto").val("");
  $("#tipo_servico").val("");
  $("#tipo_pagamento").val("");
  $("#checkin_in").val("");
  $("#checkin_out").val("");
}

function limparHospede() {
  // Limpa os valores dos campos do formulário
  document.getElementById("cpf").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("dtcNasc").value = "";
}

function limparQuarto() {
  // Limpa os campos de entrada
  $("#numero_quarto").val("");
  $("#ocupado_sim").prop("checked", false);
  $("#ocupado_nao").prop("checked", false);
  $("#idReserva").val("");
}

function limparAnimal() {
  // Limpa os campos de entrada
  $("#numero_reserva").val("");
  $("#pedigre_sim").prop("checked", false);
  $("#pedigre_nao").prop("checked", false);
  $("#nom_animal").val("");
  $("#raca").val("");
}

function limparTabela() {
  $("#tabelaQuartos tbody").empty();
}

function limparTabelaAnimal() {
  $("#tabelaAnimal tbody").empty();
}

function limparTabelaHospede() {
  $("#tabelaHospede tbody").empty();
}

function limparTabelaReserva() {
  $("#tabelaReserva tbody").empty();
}

function addOpcoesRaca(idAnimal, idRacaSelecionada) {
  $.ajax({
    url: "/raca",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const select = $(`select[id="idRacaTable${idAnimal}"]`);
      select.append('<option value="">Selecione</option>'); // Adiciona a opção "Selecione"
      data.forEach(function (opcao) {
        const option = $("<option></option>")
          .attr("value", opcao.id_raca)
          .text(opcao.nom_raca);
        if (opcao.id_raca === idRacaSelecionada) {
          option.prop("selected", true); // Seleciona a raça do animal
        }
        select.append(option);
      });
      select.prop("disabled", false); // Habilita a dropdown list para edição
    },
    error: function (error) {
      console.error("Erro ao carregar opções de raça:", error);
    },
  });
}

function addOpcoesGenero(cpf_resp, id_gen_selecionado) {
  console.log(id_gen_selecionado);
  $.ajax({
    url: "/genero",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const select = $(`select[id="idGeneroTable${cpf_resp}"]`);
      select.append('<option value="">Selecione</option>'); // Adiciona a opção "Selecione"
      data.forEach(function (opcao) {
        const option = $("<option></option>")
          .attr("value", opcao.id_gen)
          .text(opcao.nom_genero);
        if (opcao.id_gen === id_gen_selecionado) {
          console.log("alooo");
          option.prop("selected", true); // Seleciona a raça do animal
        }
        select.append(option);
      });
      select.prop("disabled", false); // Habilita a dropdown list para edição
    },
    error: function (error) {
      console.error("Erro ao carregar opções de genero:", error);
    },
  });
}

function addOpcoesPagamento(id_reserva, id_pag_selecionado) {
  $.ajax({
    url: "/tipopagamento",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const select = $(`select[id="idPagTable${id_reserva}"]`);
      select.append('<option value="">Selecione</option>'); // Adiciona a opção "Selecione"
      data.forEach(function (opcao) {
        const option = $("<option></option>")
          .attr("value", opcao.id_pag)
          .text(opcao.nom_pag);
        if (opcao.id_pag === id_pag_selecionado) {
          option.prop("selected", true); // Seleciona a raça do animal
        }
        select.append(option);
      });
      select.prop("disabled", false); // Habilita a dropdown list para edição
    },
    error: function (error) {
      console.error("Erro ao carregar opções de genero:", error);
    },
  });
}

function addOpcoesServico(id_reserva, id_serv_selecionado) {
  $.ajax({
    url: "/tiposervico",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const select = $(`select[id="idServicoTable${id_reserva}"]`);
      select.append('<option value="">Selecione</option>'); // Adiciona a opção "Selecione"
      data.forEach(function (opcao) {
        const option = $("<option></option>")
          .attr("value", opcao.id_service_plan)
          .text(opcao.nom_service);
        if (opcao.id_service_plan === id_serv_selecionado) {
          option.prop("selected", true); // Seleciona a raça do animal
        }
        select.append(option);
      });
      select.prop("disabled", false); // Habilita a dropdown list para edição
    },
    error: function (error) {
      console.error("Erro ao carregar opções de genero:", error);
    },
  });
}

function tabelaAnimal(animal) {
  $("#tabelaAnimal tbody").append(`
                                      <tr>
                                          <td><input type="number" value="${
                                            animal.id_animal
                                          }" readonly style="border: none;"></td>
                                          <td><input type="text" id="idNomeTable${
                                            animal.id_animal
                                          }" value="${animal.nom_animal}"></td>
                                          <td>
                                              <select class="form-control edit-raca" id="idRacaTable${
                                                animal.id_animal
                                              }">
                                                  <!-- Opções da dropdown list são carregadas via JavaScript -->
                                              </select>
                                          </td>
                                          <td>
                                              <select id="idPedigreTable${
                                                animal.id_animal
                                              }">
                                                  <option value="1" ${
                                                    animal.pedigre == 1
                                                      ? "selected"
                                                      : ""
                                                  }>Sim</option>
                                                  <option value="2" ${
                                                    animal.pedigre == 2
                                                      ? "selected"
                                                      : ""
                                                  }>Não</option>
                                              </select>
                                          </td>
                                          <td><input type="number" value="${
                                            animal.id_reserva
                                          }" id="idReservaTable${
    animal.id_animal
  }"></td>
                                          <td>
                                              <button onclick="atualizarAnimal(${
                                                animal.id_animal
                                              }, $('#idReservaTable${
    animal.id_animal
  }').val(), $('#idNomeTable${animal.id_animal}').val(), $('#idRacaTable${
    animal.id_animal
  }').val(), $('#idPedigreTable${
    animal.id_animal
  }').val())" class="btn btn-primary">Atualizar</button>
                                              <button onclick="removerAnimal(${
                                                animal.id_animal
                                              }, $('#idReservaTable${
    animal.id_animal
  }').val(), $('#idNomeTable${animal.id_animal}').val(), $('#idRacaTable${
    animal.id_animal
  }').val(), $('#idPedigreTable${
    animal.id_animal
  }').val())" class="btn btn-danger">Remover</button>
                                          </td>
                                      </tr>
                                  `);

  // Adiciona as opções da dropdown list para a raça deste animal
  addOpcoesRaca(animal.id_animal, animal.id_raca);
}

function tabelaQuarto(quarto) {
  $("#tabelaQuartos tbody").append(`
                      <tr>
                          <td><input type="number" value="${
                            quarto.num_quarto
                          }" readonly style="border: none;"></td>
                          <td><input type="text" value="${quarto.cpf_resp.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00" readonly style="border: none;"></td>
                          <td>
                              <select id="idStsQuarto${quarto.num_quarto}">
                                  <option value="1" ${
                                    quarto.status_quarto == 1 ? "selected" : ""
                                  }>Sim</option>
                                  <option value="2" ${
                                    quarto.status_quarto == 2 ? "selected" : ""
                                  }>Não</option>
                              </select>
                          </td>
                          <td><input type="text" value="${formatarDataBanco(
                            quarto.date_check_in
                          )}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>
                          <td><input type="text" value="${formatarDataBanco(
                            quarto.date_check_out
                          )}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;"></td>    
                          <td><input type="number" value="${
                            quarto.id_reserva
                          }" id="idReservaTable${quarto.num_quarto}"></td>
                          <td>
                              <button onclick="atualizarQuarto(${
                                quarto.num_quarto
                              }, $('#idReservaTable${
    quarto.num_quarto
  }').val())" class="btn btn-primary">Atualizar</button>
                              <button onclick="removerQuarto(${
                                quarto.num_quarto
                              }, $('#idReservaTable${
    quarto.num_quarto
  }').val())" class="btn btn-danger">Remover</button>
                          </td>
                      </tr>
                  `);
}

function tabelaHospede(hospede) {
  $("#tabelaHospede tbody").append(`
    <tr>
        <td><input type="text" value="${hospede.cpf_resp.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        )}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00" readonly style="border: none;"></td>
        <td><input type="text" id="idNomeTable${hospede.cpf_resp}" value="${
    hospede.nome
  }"></td>
        <td><input type="text" value="${formatarDataBanco(
          hospede.data_nasc
        )}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" readonly style="border: none;" id="idNascimentoTable${
    hospede.cpf_resp
  }"></td>
        <td>
                                              <select class="form-control edit-raca" id="idGeneroTable${
                                                hospede.cpf_resp
                                              }">
                                              </select>
                                          </td>
    <td>
                              <button onclick="atualizarHospede(${
                                hospede.cpf_resp
                              })" class="btn btn-primary">Atualizar</button>
                              <button onclick="removerHospede(${
                                hospede.cpf_resp
                              })" class="btn btn-danger">Remover</button>
                          </td>
    </tr>
`);

  // Adiciona as opções da dropdown list para a genero
  addOpcoesGenero(hospede.cpf_resp, hospede.genero);
}

function tabelaReserva(reserva) {
  $("#tabelaReserva tbody").append(`
    <tr>
    <td><input type="number" value="${
      reserva.id_reserva
    }" readonly style="border: none;"></td>
        <td><input type="text" id="idCPFTable${
          reserva.id_reserva
        }" value="${reserva.cpf_resp.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  )}" maxlength="14" oninput="formatarCPF(this)" placeholder="000.000.000-00"></td>
        <td><input type="text" id="idNomeTable${reserva.id_reserva}" value="${
    reserva.nome
  }"></td>

        <td>
        <select class="form-control edit-raca" id="idServicoTable${
          reserva.id_reserva
        }">
        </select>
    </td>

    <td>
                                              <select class="form-control edit-raca" id="idPagTable${
                                                reserva.id_reserva
                                              }">
                                              </select>
                                          </td>

        <td><input type="text" value="${formatarDataBanco(
          reserva.date_check_in
        )}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" id="idInTable${
    reserva.id_reserva
  }"></td>
        <td><input type="text" value="${formatarDataBanco(
          reserva.date_check_out
        )}" maxlength="10" oninput="formatarData(this)" placeholder="DD/MM/YYYY" id="idOutTable${
    reserva.id_reserva
  }"></td>
    <td>
                              <button onclick="atualizarReserva(${
                                reserva.id_reserva
                              })" class="btn btn-primary">Atualizar</button>
                              <button onclick="removerReserva(${
                                reserva.id_reserva
                              })" class="btn btn-danger">Remover</button>
                          </td>
    </tr>
`);

  // Adiciona as opções da dropdown list para a genero
  addOpcoesPagamento(reserva.id_reserva, reserva.id_pag);
  addOpcoesServico(reserva.id_reserva, reserva.id_service_plan);
}

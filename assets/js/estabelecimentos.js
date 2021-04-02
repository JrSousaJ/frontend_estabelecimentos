let listagemCategorias = [];

$(document).ready(function () {
    carregarEstabelecimentos();
  
    $('.telefone').mask('(00)00000-0000');
    $('.telefone_alterar').mask('(00)00000-0000');
    $('.agencia').mask('000-0');
    $('.agencia_alterar').mask('000-0');
    $('.conta').mask('00.000-0');
    $('.conta_alterar').mask('00.000-0');
    $('.cnpj').mask('00.000.000/0000-00', {reverse: true});
    $('.cnpj_alterar').mask('00.000.000/0000-00', {reverse: true});

    $('.adicionarEstabelecimentos').submit(function (event) {
        event.preventDefault();
        adicionarEstabelecimento();
    });
    $('.alterarEstabelecimentos').submit(function (event) {
        event.preventDefault();
        alterarEstabelecimento();
    });
    $.ajax({
        url: "http://localhost:800/public/api/categoria/listar",
        type: "GET",
        async: true,
        success: function (categorias) {

            let tabela = $(".categoriaAdicionar");
            const listaCategorias = categorias.categoria
            for (let i = 0; i < listaCategorias.length; i++) {
                listagemCategorias[listaCategorias[i].id] = listaCategorias[i].nome
                tabela.append(
                    `
                        <option value="${listaCategorias[i].id}">${listaCategorias[i].nome}</option>
                    `
                );
            }
        },
        error: function (error) {
            $(".message").html("falha ao carregar informações.");
            $(".message_card").show();
        },
    });
    $('.categoriaAdicionar').on('change',function() {
        if($('.categoriaAdicionar option:selected').text() === "Supermercado")
        {
            $('.email').prop('required',true);
        }
        else
        {
            $('.email').prop('required',false);
        }
    });
    $('.categoriaAlterar').on('change', function() {
        if($('.categoriaAlterar option:selected').text() === "Supermercado")
        {
            $('.email_alterar').prop('required',true);
        }
        else
        {
            $('.email_alterar').prop('required',false);
        }
    });
    $('.fecharVisualizacao').click(function() {
        $('.visualizarModal').empty();
    

    });
    $('.alert_card').hide();
});

function carregarEstabelecimentos() {
    $.ajax({
        url: "http://localhost:800/public/api/estabelecimento/listar",
        type: "GET",
        async: true,
        success: function (estabelecimentos) {

            let tabela = $(".estabelecimentos");
            const listaEstabelecimentos = estabelecimentos.estabelecimento
            for (let i = 0; i < listaEstabelecimentos.length; i++) {
                tabela.append(
                    `
                    <tr>
                        <th scope="row">${listaEstabelecimentos[i].id_estabelecimento}</th>
                        <td>${listaEstabelecimentos[i].razao_social}</td>
                        <td>${listaEstabelecimentos[i].cnpj}</td>
                        <td>
                            <button type="button" class="btn btn-info" onClick="visualizarEstabelecimento(${listaEstabelecimentos[i].id_estabelecimento})"><i class="fas fa-eye"></i></i></button>
                            <button type="button" class="btn btn-primary" onClick="alterarEstabelecimentoModal(${listaEstabelecimentos[i].id_estabelecimento})"><i class="fas fa-edit"></i></button>
                            <button type="button" class="btn btn-danger" onClick="excluirEstabelecimento(${listaEstabelecimentos[i].id_estabelecimento})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    `
                );
            }
        },
        error: function (error) {
            $(".mensagem").html("Falha ao carregar as informações.");
            $(".alert_card").show();
        },
    });
}
function visualizarEstabelecimento(id)
{
    let visualizacao = $("div .visualizarModal");
    const query = {
        id : id
    };
    $.ajax({
        url: "http://localhost:800/public/api/estabelecimento/buscaPorId",
        type: "GET",
        data: query,
        async: false,
        success: function (estabelecimentos) {
            const estabelecimentoEditar = estabelecimentos.estabelecimento;
            visualizacao.append(
                `
                    <div>
                        <p><strong>Razão Social</strong>: ${estabelecimentoEditar.razao_social}</p>
                        <p><strong>CNPJ</strong>: ${estabelecimentoEditar.cnpj}</p>
                        <p><strong>Categoria</strong>: ${listagemCategorias[estabelecimentoEditar.categoria_id] ? listagemCategorias[estabelecimentoEditar.categoria_id] : 'Não possui!' }</p>
                        <p><strong>Nome Fantasia</strong>: ${estabelecimentoEditar.nome_fantasia ? estabelecimentoEditar.nome_fantasia : 'Não possui!'}</p>
                        <p><strong>E-mail</strong>: ${estabelecimentoEditar.email ? estabelecimentoEditar.email : 'Não possui!'}</p>
                        <p><strong>Endereço</strong>: ${estabelecimentoEditar.endereco ? estabelecimentoEditar.endereco : 'Não possui!'}</p>
                        <p><strong>Cidade</strong>: ${estabelecimentoEditar.cidade ? estabelecimentoEditar.cidade : 'Não possui!'}</p>
                        <p><strong>Estado</strong>: ${estabelecimentoEditar.estado ? estabelecimentoEditar.estado : 'Não possui!'}</p>
                        <p><strong>Telefone</strong>: ${estabelecimentoEditar.telefone ? estabelecimentoEditar.telefone : 'Não possui!'}</p>
                        <p><strong>Agência</strong>: ${estabelecimentoEditar.agencia ? estabelecimentoEditar.agencia : 'Não possui!'}</p>
                        <p><strong>Conta</strong>: ${estabelecimentoEditar.conta ? estabelecimentoEditar.conta : 'Não possui!'}</p>
                        <p><strong>Status</strong>: ${estabelecimentoEditar.status ? 'Ativo' : 'Inativo'}</p>
                    </div>

                `
            );
            $('#modalVisualizar').modal('show');
        },
        error: function (error) {
            const listaErros = error.responseJSON.error.nome;
            let erros = '<strong>Não foi possível inserir!</strong><br>';
            for(let i = 0; i<listaErros.length; i++)
            {
                erros+=
                `
                    ${listaErros[i]}<br>
                `;
            }
            $(".mensagem").html(erros);
            $(".alert_card").show();
        },
    }); 
}
function adicionarEstabelecimento()
{
    const data = new Date();
    const dataFormatada = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate();
    const body = {
        razao_social :  $('.razao_social').val(),
        cnpj :  $('.cnpj').val(),
        nome_fantasia :  $('.nome_fantasia').val(),
        categoria_id :  $('.categoriaAdicionar').val(),
        email :  $('.email').val(),
        endereco :  $('.endereco').val(),
        estado :  $('.estado').val(),
        telefone :  $('.telefone').val(),
        status :  1,
        agencia :  $('.agencia').val(),
        conta :  $('.conta').val(),
        data_cadastro : dataFormatada
    };
    $.ajax({
        url: "http://localhost:800/public/api/estabelecimento/salvarEstabelecimento",
        type: "POST",
        data: body,
        async: true,
        success: function (estabelecimento) {
            $("#modalAdiconar").modal('hide');
            $('.razao_social').val('');
            $('.cnpj').val('');
            $('.nome_fantasia').val('');
            $('.categoria').val('');
            $('.email').val('');
            $('.endereco').val('');
            $('.estado').val('');
            $('.telefone').val('');
            $('.agencia').val('');
            $('.conta').val('');
                
            location.reload();
        },
        error: function (error) {
            const listaErros = Object.values(error.responseJSON.error);
            let erros = '<strong>Não foi possível inserir!</strong><br>';
            for(let i = 0; i<listaErros.length; i++)
            {
                erros+=
                `
                    ${listaErros[i]}<br>
                `;
            }
            $("#modalAdiconar").modal('hide');
            $(".mensagem").html(erros);
            $(".alert_card").show();
        },
    });
}
function alterarEstabelecimentoModal(id)
{
    const query = {
        id : id
    };
   
    let select = $(".categoriaAlterar");

    $.ajax({
        url: "http://localhost:800/public/api/categoria/listar",
        type: "GET",
        async: false,
        success: function (categoriaResponse) {
            const categorias = categoriaResponse.categoria
            for (let i = 0; i < categorias.length; i++) {
                if(categorias[i].id != $('.categoriaAlterar').val())
                {
                    select.append(
                        `
                            <option value="${categorias[i].id}">${categorias[i].nome}</option>
                        `
                    );
                }
            }
        },
        error: function (error) {
            $(".mensagem").html('Errro ao alterar');
            $(".alert_card").show();
        },
    });

    $.ajax({
        url: "http://localhost:800/public/api/estabelecimento/buscaPorId",
        type: "GET",
        data: query,
        async: false,
        success: function (estabelecimentos) {
            const estabelecimentoEditar = estabelecimentos.estabelecimento;
            $('.idEstabelecimento').val(estabelecimentoEditar.id_estabelecimento);
            $('.razao_social_alterar').val(estabelecimentoEditar.razao_social);
            $('.cnpj_alterar').val(estabelecimentoEditar.cnpj);
            $('.nome_fantasia_alterar').val(estabelecimentoEditar.nome_fantasia);
            $('.categoriaAlterar').val(estabelecimentoEditar.categoria_id);
            $('.email_alterar').val(estabelecimentoEditar.email);
            $('.endereco_alterar').val(estabelecimentoEditar.endereco);
            $('.cidade_alterar').val(estabelecimentoEditar.cidade);
            $('.estado_alterar').val(estabelecimentoEditar.estado);
            $('.telefone_alterar').val(estabelecimentoEditar.telefone);
            $('.agencia_alterar').val(estabelecimentoEditar.agencia);
            $('.conta_alterar').val(estabelecimentoEditar.conta);
            $('.status').val(estabelecimentoEditar.status)
            $('#modalAlterar').modal('show');
        },
        error: function (error) {
            const listaErros = error.responseJSON.error.nome;
            $(".mensagem").html('Erro ao alterar!');
            $(".alert_card").show();
        },
    }); 
    
}
function alterarEstabelecimento()
{
    const body = {
        id_estabelecimento : $('.idEstabelecimento').val(),
        razao_social :  $('.razao_social_alterar').val(),
        cnpj :  $('.cnpj_alterar').val(),
        nome_fantasia :  $('.nome_fantasia_alterar').val(),
        categoria_id :  $('.categoriaAlterar').val(),
        email :  $('.email_alterar').val(),
        endereco :  $('.endereco_alterar').val(),
        cidade :  $('.cidade_alterar').val(),
        estado :  $('.estado_alterar').val(),
        telefone :  $('.telefone_alterar').val(),
        agencia :  $('.agencia_alterar').val(),
        conta :  $('.conta_alterar').val(),
        status : $('.status').val()
    };
    $.ajax({
        url: "http://localhost:800/public/api/estabelecimento/atualizarEstabelecimento",
        type: "PUT",
        data: body,
        async: true,
        success: function (estabelecimento) {
            $('#modalAlterar').modal('hide');
            $('.razao_social').val('');
            $('.cnpj').val('');
            $('.nome_fantasia').val('');
            $('.categoriaAlterar').val('');
            $('.email').val('');
            $('.endereco').val('');
            $('.estado').val('');
            $('.telefone').val('');
            $('.agencia').val('');
            $('.conta').val('');
            $('.status').val('')
            location.reload();
        },
        error: function (error) {
            const listaErros = Object.values(error.responseJSON.error);
            console.log(listaErros)
            let erros = '<strong>Não foi possível alterar!</strong><br>';
            for(let i = 0; i<listaErros.length; i++)
            {
                erros+=
                `
                    ${listaErros[i]}<br>
                `;
            }
            $("#modalAlterar").modal('hide');
            $(".mensagem").html(erros);
            $(".alert_card").show();
        },
    });
}
function excluirEstabelecimento(id)
{
    if(confirm("Deseja mesmo excluir o estabelecimento?"))
    {
        body = {
            id : id
        };
        $.ajax({
            url: "http://localhost:800/public/api/estabelecimento/deletarEstabelecimento",
            type: "DELETE",
            data: body,
            async: true,
            success: function (estabelecimento) {
                location.reload();
            },
            error: function (error) {
                const listaErros = error.responseJSON.error.nome;
                let erros = '<strong>Não foi possível excluir!</strong><br>';
                for(let i = 0; i<listaErros.length; i++)
                {
                    erros+=
                    `
                        ${listaErros[i]}<br>
                    `;
                }
                $(".mensagem").html(erros);
                $(".alert_card").show();
            },
        });
    }
}
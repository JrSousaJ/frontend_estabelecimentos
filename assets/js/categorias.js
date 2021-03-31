$(document).ready(function () {
    carregarCategorias();
});
function carregarCategorias() {
    $.ajax({
        url: "http://localhost:800/public/api/categoria/listar",
        type: "GET",
        async: true,
        success: function (categorias) {

            let tabela = $(".categorias");
            const listaCategorias = categorias.categoria
            for (let i = 0; i < listaCategorias.length; i++) {
             
                tabela.append(
                    `
                    <tr>
                        <th scope="row">${listaCategorias[i].id}</th>
                        <td>${listaCategorias[i].nome}</td>
                        <td>
                            <button type="button" class="btn btn-primary" onClick="alterarCategoriaModal(${listaCategorias[i].id})"><i class="fas fa-edit"></i></button>
                            <button type="button" class="btn btn-danger" onClick="excluirCategoria(${listaCategorias[i].id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    `
                );
            }
        },
        error: function (error) {
            $(".message").html("falha ao carregar informações.");
            $(".message_card").show();
        },
    });
}
function adicionarCategoria()
{
    const nomeCategoria = $('.nome').val();
    const body = {
        nome : nomeCategoria,
    };
    $.ajax({
        url: "http://localhost:800/public/api/categoria/salvarCategoria",
        type: "POST",
        data: body,
        async: true,
        success: function (categorias) {
            $("#modalAdiconar").hide();
            carregarCategorias();
        },
        error: function (error) {
            $(".message").html("falha ao carregar informações.");
            $(".message_card").show();
        },
    });
}
function alterarCategoriaModal(id)
{
    const query = {
        id : id
    }
    $.ajax({
        url: "http://localhost:800/public/api/categoria/buscaPorId",
        type: "GET",
        data: query,
        async: true,
        success: function (categoria) {
            const categoriaEditar = categoria.categoria;
            $('.idAlterar').val(categoriaEditar.id);
            $('.nomeAlterar').val(categoriaEditar.nome);
            $('#modalAlterar').modal('show');
        },
        error: function (error) {
            $(".message").html("falha ao carregar informações.");
            $(".message_card").show();
        },
    });
}
function alterarCategoria()
{
    const id = $('.idAlterar').val();
    const nomeCategoria = $('.nomeAlterar').val();

    $.ajax({
        url: "http://localhost:800/public/api/categoria/atualizarCategoria",
        type: "PUT",
        data: {id: id, nome: nomeCategoria},
        async: true,
        success: function (categoria) {
            $('#modalAlterar').modal('hide');
            location.reload();
        },
        error: function (error) {
            $(".message").html("falha ao carregar informações.");
            $(".message_card").show();
        },
    });
}
function excluirCategoria(id)
{
    if(confirm("Deseja mesmo excluir a categoria?"))
    {
        body = {
            id : id
        };
        $.ajax({
            url: "http://localhost:800/public/api/categoria/deletarCategoria",
            type: "DELETE",
            data: body,
            async: true,
            success: function (categoria) {
                carregarCategorias();
            },
            error: function (error) {
                $(".message").html("falha ao carregar informações.");
                $(".message_card").show();
            },
        });
    }
    
}
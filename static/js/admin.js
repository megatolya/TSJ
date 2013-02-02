$(function() {
    $('.to-answer-form').click(function() {
        var id = $(this).parents('tr').attr('id');
        $('.modal').modal();
        $('.msg-id').val(id); 
    });
    $('.im-send').click(function() {
        var text = $('.im-form textarea').val();
        var idMsg = $('.im-form input').val();
        $.ajax({
            url: '/admin/msg',
            type: 'POST',
            data: { text: text, idMsg : idMsg },
            success : function(data) {
                $('.modal').modal('hide');
                $('#'+idMsg).remove();
            },
            error : function(data) {
                console.log(err);
            }
        });
    });
    $('.reload').click(function() {
        $.ajax({
            url: '/admin/msgs',
            type: 'GET',
            success : function(data) {
                $('.im-table').html(data);
                console.log('ajax');
            },
            error : function(data) {
                $('.im-table').html(data);
            }
        });
    });
});

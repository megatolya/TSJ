$(function() {
    $('body').on('click','.to-answer-form', function() {
        var id = $(this).parents('tr').attr('id');
        $('.modal').modal();
        $('.modal textarea').val('');
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
                console.log(data);
                $('.modal').modal('hide');
                $('.reload').click();
            },
            error : function(data) {
                console.log(data);
            }
        });
    });
    $('.reload').click(function() {
        $.ajax({
            url: '/admin/msgs',
            type: 'GET',
            success : function(data) {
                console.log(data);
                var html = Templating.tpl('admin-ajax-im.jade', data);
                $('.im-table').html(html);
            },
            error : function(data) {
                $('.im-table').html(data);
            }
        });
    });
});

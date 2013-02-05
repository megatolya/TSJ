$(function() {
    $('body').on('click','.to-answer-form', function() {
        var id = $(this).parents('tr').attr('id');
        $('.modal').modal();
        $('.modal textarea').val('');
        $('.msg-id').val(id); 
    });
    $('.spisat').click(function(e) {
        e.preventDefault();
        $(this).attr('disabled', 'disabled');
        $.ajax({
            url: '/spisat',
            type: 'GET',
            success : function (data) {
                $.ajax({
                    url: '/admin/ajax-payments',
                    type: 'GET',
                    success : function(data) {
                        var html = Templating.tpl('admin-ajax-payments.jade', data);
                        $('.balances').html(html);
                        $('.last-updated-time').text(data.data.i18n.now);
                    },
                    error : function(data) {
                        console.log('error');
                        console.log(data);
                    }
                });
            },
            error : function  (data) {
                console.log(data);
            }
        });
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

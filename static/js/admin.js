$(function() {
    $('body').on('click','.to-answer-form', function() {
        var id = $(this).parents('tr').attr('id');
        $('.modal').modal();
        $('.modal textarea').val('');
        $('.msg-id').val(id); 
    });
    $('.spisat').click(function(e) {
        var $this = $(this);
        e.preventDefault();
        if ($this.attr('disabled')) return;
        $this.attr('disabled', 'disabled');
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
                console.log('error');
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
        var $this = $(this);

        $this.attr('disabled', 'disabled');
        $.ajax({
            url: '/admin/msgs',
            type: 'GET',
            success : function(data) {
                $this.removeAttr('disabled');
                console.log(data);
                var html = Templating.tpl('admin-ajax-im.jade', data);
                $('.im-table').html(html);
            },
            error : function(data) {
                $('.im-table').html(data);
            }
        });
    });
    $('.get-db').click(function() {
        var link = $(this);
        var table = link.data('get');

        $.ajax({
            url: '/db/' + table,
            type: 'GET',
            success : function(data) {
                var html = Templating.tpl('db-table.jade', data);
                var content = $(link.parents('.table').find('.table-content'))
                content.html(html);
                $(content.find('input')).blur(function(){
                    var input = $(this);
                    var table = input.parents('table').data('table');
                    var key = input.data('key');
                    var value = input.val();
                    var oldValue = input.data('old-val');
                    if (oldValue != value) {
                        var id = input.parents('tr').addClass('success').data('id');
                        var req = {
                            id: id,
                            table: table,
                            key: key,
                            value: value
                        };
                        $.ajax({
                            url: '/db/save',
                            type: 'POST',
                            data: req,
                            success : function(data) {
                                console.log(data);
                                input.parents('tr').removeClass('success');
                            }
                        });
                    }
                });
            }, error : function(data) {
                console.log('error');
                console.log(data);
            }
        });
    });
});

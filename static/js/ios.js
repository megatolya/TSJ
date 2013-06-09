$(function () {
    $('a, li').mousedown(function () {
        var href  = $(this).attr('href');
        if (!href)
            return;

        if (typeof href !== 'undefined' && href !== false) {
            window.location.href=href;
        }
    });
    $('.show-im-form').mousedown(function () {
        $(this).hide();
        $('.im-form').show();
    });
    $('.segmented-controller a').mousedown(function() {
        $('.segmented-controller li').removeClass('active');
        $(this).parent().addClass('active');
        $('.call').val($(this).data('call'));
    });
    var path = URL.parse(location.href).path;
    function reload() {
        $.ajax({
            url: '/im-ajax',
            type: 'GET',
            success : function(data) {
                var html = Templating.tpl('ios-ajax-im.jade', data);
                $('.ims').html(html);
            },
            error : function(data) {
                clearInterval(interval);
            }
        });
    }
    if ( path == '/im' ) {
        reload();
        //var interval = setInterval(reload, 900);
    }
    $('.pay').mousedown(function(){
        var pay = prompt('Сколько положить на счет?');
        if (pay) {
            $.ajax({
                url: '/pay/' + pay,
                type: 'GET',
                success : function(data) {
                    window.location.reload();
                },
                error : function(data) {
                }
            });

        }
    });
    $('.change-status').live('mousedown', function() {
        $('.change-status-popover').show();
        $('.change-status-popover .change-status-btn').attr('data-id', $(this).data('id'));
    });
    $('.set-pay-val').mousedown(function() {
        var $this = $(this),
            payment = $this.data('payment'),
            id = $this.data('id'),
            newVal = +prompt('Указать количество');

        if (!newVal || isNaN(newVal))
            return;

        $.ajax({
            url: '/change-payment-val',
            type: 'POST',
            data: {
                payment: payment,
                id: id,
                newVal: newVal
            },
            success : function(data) {
                location.reload();
            },
            error : function(data) {
                location.reload();
            }
        });
    });
    $('.im-form').submit(function() {
        var type = $($('.segmented-controller').find('.active a')).data('call');
        $.ajax({
            url: '/im',
            type: 'POST',
            data: {
                text: $('textarea').val(),
                type: type
            },
            success : function(data) {
                location.reload();
            },
            error : function(data) {
                location.reload();
            }
        });
        return false;
    });

    $('.close-popover').mousedown(function() {
        $('.popover').hide();
    });
    $('.change-status-btn').live('mousedown', function() {
        var id = $(this).data('id'),
            status = $(this).data('act');

        $.ajax({
            url: '/status',
            type: 'POST',
            data: {
                id: id,
                status: status
            },
            success : function(data) {
                $('.close-popover').click();
                reload();
            },
            error : function(data) {
                $('.close-popover').click();
                reload();
            }
        });
    });
});

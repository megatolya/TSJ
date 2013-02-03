$(function () {
    $('a').mousedown(function () {
        var href  = $(this).attr('href');
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
    if ( path == '/im' ) {
        var interval = setInterval(function() {
            $.ajax({
                url: '/im-ajax',
                type: 'GET',
                success : function(data) {
                    console.log(data);
                    var html = Templating.tpl('ios-ajax-im.jade', data);
                    $('.ims').html(html);
                },
                error : function(data) {
                    alert('error!');
                    clearInterval(interval);
                }
            });
        },900);
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
                    alert('error!');
                }
            });

        };
    });
});

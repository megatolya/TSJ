$(function () {
    $('a').click(function () {
        var href  = $(this).attr('href');
        if (typeof href !== 'undefined' && href !== false) {
            window.location.href=href;
        }
    });
    $('.show-im-form').click(function () {
        $(this).hide();
        $('.im-form').show();
    });
    $('.segmented-controller a').click(function() {
        $('.segmented-controller li').removeClass('active');
        $(this).parent().addClass('active');
        $('.call').val($(this).data('call'));
    });
    $('.pay').click(function(){
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

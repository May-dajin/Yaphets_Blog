let wcli = $('.icon-wechat');
let wcdiv = wcli.find('.wechat-div');
wcli.on('mouseenter', () => {
    wcdiv.show();
});
wcli.on('mouseleave', () => {
    wcdiv.hide();
});
$(window).on('scroll', () => {
    if ($(this).scrollTop() > 600) {
        $('#backTop').show();
    } else {
        $('#backTop').hide();
    }
});
$('#backTop').on('click', () => {
    $('html,body').animate({scrollTop: 0}, 500);
});
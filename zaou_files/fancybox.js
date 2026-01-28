$(function() {
    // WP標準のギャラリー対応
    $('.gallery').each(function(index ,item) {
        var $item = $(item);
        var id = $item.attr('id');
        $item.find('a').attr('data-fancybox', id);
    });

    $('[data-fancybox], .lightbox').fancybox({buttons: ['close']});
});

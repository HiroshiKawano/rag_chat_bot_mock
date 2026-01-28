/**
 * Slick(slider plugin) setup code
 */

$(function() {
    if (typeof slickParam !== 'undefined') {
        $('.slider').slick(
            slickParam
        );
    }
});
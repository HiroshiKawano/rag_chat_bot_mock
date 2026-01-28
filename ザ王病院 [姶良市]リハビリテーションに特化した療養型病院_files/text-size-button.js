
(function($){

    $(function(){

        $('.font-size #font_size_default').click(function(e){
            onClickTextSizeButton(e);
        });
        $('.font-size #font_size_large').click(function(e){
            onClickTextSizeButton(e);
        });

        var style = Cookies.get('style');
        var defaultSize = $('.font-size #font_size_default');
        var largeSize = $('.font-size #font_size_large');
        if(typeof style == 'string' && style.length > 0){
            if(style == defaultSize.data("css-url")){
                setChecked(defaultSize,style);
            }

            if(style == largeSize.data("css-url")){
                setChecked(largeSize,style);
            }

            setStyle(style);
        }else{
            var cssUrl = defaultSize.data("css-url");
            setChecked(defaultSize,cssUrl);
            setStyle(cssUrl);
        }
    });

    function setChecked(jQueryElement,cssUrl){
        var url = jQueryElement.data("css-url");
        if(url == cssUrl){
            jQueryElement.attr({checked:true});
        }
    }

    function onClickTextSizeButton(event){
        var cssUrl = $(event.target).data("css-url");
        $(event.target).attr({checked:true});
        setStyle(cssUrl);
    }

    function setStyle(cssurl){
        $('#jstyle').attr({href:cssurl});
        Cookies.set('style',cssurl,{expires:30,path:'/'})
    }

})(jQuery);
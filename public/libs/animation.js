$(document).ready(function(){
    $('.absolute-body').addClass('slide-up');
    $(document).on( 'click', '.toggleMenu', function () {
        var isOpen = $( ".menuBar" ).hasClass( "openMenu" );
        if (!isOpen) {
            $(".menuBar").addClass("openMenu");
            $(".menuBar").removeClass("closeMenu");
            $(".right-col").removeClass("w100p");
        } else {
            $(".menuBar").removeClass("openMenu");
            $(".menuBar").addClass("closeMenu");
            $(".right-col").addClass("w100p");
        }
    });
    $(document).on( 'click', '.openSearch', function () {
        $('.inputSearch').val("");
        $(".custom-search").addClass("visible");
        $(".custom-search").removeClass("invisible");
        setTimeout(function(){
            $('.inputSearch').focus();
        }, 10);
    });
    $(document).on( 'click', '.close-search', function () {
        $(".custom-search").addClass("invisible");
        $(".custom-search").removeClass("visible");
    });
    $(document).on( 'click', '.nav.side-menu > li > a', function () {
        windowsize = $(window).width();
        $(".vh100").css("height", "100vh");
        if (windowsize < 992) {
            var isOpen = $( ".menuBar" ).hasClass( "openMenu" );
            if (isOpen) {
                setTimeout(function(){
                    $(".menuBar").removeClass("openMenu");
                    $(".menuBar").addClass("closeMenu");
                    $(".right-col").addClass("w100p");
                }, 10);
            }
        }
        setTimeout(function(){
            var height = $(document).height();
            $(".vh100").css("height", height);
        }, 100);
    });
    $(document).on('click','.content', function() {
        windowsize = $(window).width();
        if (windowsize < 992) {

            var isOpen = $( ".menuBar" ).hasClass( "openMenu" );
            if (isOpen) {
                $(".menuBar").removeClass("openMenu");
                $(".menuBar").addClass("closeMenu");
                $(".right-col").addClass("w100p");
            }
        }
    });
    $(window).resize(function (){
        windowsize = $(window).width();
        if (windowsize < 992) {
            var isOpen = $( ".menuBar" ).hasClass( "openMenu" );
            if (isOpen) {
                setTimeout(function(){
                    $(".menuBar").removeClass("openMenu");
                    $(".menuBar").addClass("closeMenu");
                    $(".right-col").addClass("w100p");
                }, 10);
            }
        }
    });
    setTimeout(function(){
        var height = $(document).height();
        $(".vh100").css("height", height);
        windowsize = $(window).width();
        if (windowsize < 992) {
            var isOpen = $( ".menuBar" ).hasClass( "openMenu" );
            if (isOpen) {
                $(".menuBar").removeClass("openMenu");
                $(".menuBar").addClass("closeMenu");
                $(".right-col").addClass("w100p");
            }
        }
    }, 10);
});

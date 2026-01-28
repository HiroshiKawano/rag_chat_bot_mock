$(function() {
  'use strict';
  var $window = $(window),
      $document = $(document),
      $body = $('body'),
      $menu = $('#menu'),
      $menuBtn = $('#menu_btn'),
      $menuOverlay = $('#menu_overlay'),
      $search = $('#search'),
      $searchInput = $('#search_input'),
      $searchBtn = $('#search_btn'),
      $searchOverlay = $('#search_overlay'),
      $pagetopBtn = $('#pagetop_btn'),
      resize_timer = false,
      current_scrollPos,
      menu_height,
      windowWidth,
      windowWidth_resized,
      opt = {
        'setting': {
          'pc_width': 1080
        },
        'enable': {
          'topicPath': true,
          'enlarge': false // 画像をタップで拡大
        },
        'className': {
          'state_hide': 'state-hide',
          'mainMenuBtn_close': 'menu-btn-close',
          'mainMenu_active': 'main-menu-active',
          'search_active': 'search-active',
          'enlarge': 'sui-enlarge'
        },
        'animate': {
          'duration': 200,
          'easing': 'linear'
        }
      };
  // init
  init();
  function init() {
    $menuBtn.on('click', function() {
      if ($menu.hasClass(opt.className.state_hide)) {
        openMenu();
        $body.addClass(opt.className.mainMenu_active);
      } else {
        closeMenu();
        $body.removeClass(opt.className.mainMenu_active);
      }
      return false;
    });
    $searchBtn.on('click', function() {
      $searchOverlay.toggleClass(opt.className.state_hide);
      $search.toggleClass(opt.className.state_hide);
      $searchInput.focus();
      $body.addClass(opt.className.search_active);
      return false;
    });
    $searchOverlay.on('click', function() {
      $searchOverlay.toggleClass(opt.className.state_hide);
      $search.toggleClass(opt.className.state_hide);
      $searchInput.blur();
      $body.removeClass(opt.className.search_active);
      return false;
    });
    // resize
    windowWidth = $window.width();
    resizeFunc();
    $window.on('orientationchange resize', function() {
      if ($window.width() < opt.setting.pc_width) {
        // $menu.addClass(opt.className.state_hide);
      } else {
        $body.css('height', 'auto');
        $menu.removeClass(opt.className.state_hide)
      }
      if (resize_timer !== false) {
        clearTimeout(resize_timer);
      }
      resize_timer = setTimeout(function() {
        windowWidth_resized = $window.width();
        if (windowWidth != windowWidth_resized) {
          windowWidth = $window.width();
          //
          resizeFunc();
        }
      }, 100);
    });
    // ページ内リンク
    $('a[href^="#"]').on('click', function() {
      var speed = 500,
          href= $(this).attr('href'),
          target = $(href == '#' || href == '' ? 'html' : href),
          position = 0;
      if (target.length > 0) position = target.offset().top;
      $('html, body').animate({scrollTop: position}, speed, 'swing');
      var scrollTargetId = target.attr('id');
      setTimeout(function(){
        if (scrollTargetId) location.hash = scrollTargetId;
        return false;
      }, 500);
    });
    ratio();
  }
  function resizeFunc() {
      if ($window.width() < opt.setting.pc_width) {
        // sp
        closeMenu();
        $searchOverlay.removeClass(opt.className.state_hide);
        $search.removeClass(opt.className.state_hide);
        $body.removeClass(opt.className.search_active);
      } else {
        // pc
        $menu.removeClass(opt.className.state_hide).css('opacity', 1);
        $menuOverlay.addClass(opt.className.state_hide);
        $searchOverlay.addClass(opt.className.state_hide);
        $search.addClass(opt.className.state_hide);
      }
      $body.removeClass(opt.className.mainMenu_active);
  }
  // function initOverlay() {
  //   $overlay.css({
  //     width: $document.width(),
  //     height: $document.height()
  //   });
  // }
  function openMenu() {
    current_scrollPos = $window.scrollTop();
    // menu_height = $menu.height();
    // initOverlay();
    // $pagetopBtn.transition(
    //   {
    //     opacity: 0,
    //   },
    //   opt.animate.duration,
    //   opt.animate.easing,
    //   function() {
    //     $pagetopBtn.addClass(opt.className.state_hide);
    //   }
    // );
    $menuOverlay.removeClass(opt.className.state_hide).transition(
      {
        opacity: 1
      },
      opt.animate.duration,
      opt.animate.easing,
      function() {
        $menu.removeClass(opt.className.state_hide);
        menu_height = $menu.height();
        $window.scrollTop(0);
        $body.css({
          overflow: 'hidden',
          height: menu_height
        });
        $menu.removeClass(opt.className.state_hide).transition(
          {
            opacity: 1
          },
          opt.animate.duration,
          opt.animate.easing
        );
        // menu-btn
        $menuBtn.addClass(opt.className.mainMenuBtn_close);
      }
    );
  }
  function closeMenu() {
    $menu.transition(
      {
        opacity: 0
      },
      opt.animate.duration,
      opt.animate.easing,
      function() {
        $menu.addClass(opt.className.state_hide);
        $body.css({
          overflow: 'auto',
          height: 'auto'
          // top: bodyContentsPos
        });
        $window.scrollTop(current_scrollPos);
        $menuOverlay.transition(
          {
            opacity: 0
          },
          opt.animate.duration,
          opt.animate.easing,
          function() {
            $menuOverlay.addClass(opt.className.state_hide);
          }
        );
        // menu-btn
        $menuBtn.removeClass(opt.className.mainMenuBtn_close);
      }
    );
  }
  function ratio() {
    $('iframe[src*="www.google.com/maps/embed"]', '.editing').each(function() {
      if ((!$(this).parent().hasClass('ratio') && !$(this).parent().hasClass('map')) && !$(this).hasClass('js-no-ratio')) {
        $(this).wrap('<div class="ratio" />');
      }
    });
  }
});
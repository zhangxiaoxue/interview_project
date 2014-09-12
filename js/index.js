(function($) {
    $.fn.touchwipe = function(settings) {
        var config = {min_move_x: 20,min_move_y: 20,wipeLeft: function() {
        },wipeRight: function() {
        },wipeUp: function() {
        },wipeDown: function() {
        },preventDefaultEvents: true};
        if (settings)
            $.extend(config, settings);
        this.each(function() {
            var startX;
            var startY;
            var isMoving = false;
            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false
            }
            function onTouchMove(e) {
                if (config.preventDefaultEvents) {
                    e.preventDefault()
                }
                if (isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if (Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if (dx > 0) {
                            config.wipeLeft()
                        } else {
                            config.wipeRight()
                        }
                    } else if (Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if (dy > 0) {
                            config.wipeDown()
                        } else {
                            config.wipeUp()
                        }
                    }
                }
            }
            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false)
                }
            }
            if ('ontouchstart' in document.documentElement) {
                this.addEventListener('touchstart', onTouchStart, false)
            }
        });
        return this
    }
})(jQuery);

$(document).ready(function(){
    var winW = $(window).width();
    var winH = $(window).height();
    var wrap = $("#view");
    var wrapMd = $("#view .md");
    wrapMd.eq(0).addClass("page0");
    var pageNum = 0;
    var mdSize = wrapMd.size();

    $("html").touchwipe({
        wipeUp: function() {
            if(pageNum > 0){
                pageNum --;
                pageScroll(pageNum, "up");
            }
        },
        wipeDown: function() {
            if(pageNum <= mdSize-2){
                pageNum ++;
                pageScroll(pageNum, "down");
            }
        },
        min_move_x: 80,
        min_move_y: 80,
        preventDefaultEvents: true
    });

    function addAnimation(){
        var effects = {
            '#quote_jack': 'bounceInLeft',
            '#quote_steve': 'bounceInRight',
            '#tencent': 'swing',
            '#eye': 'bounceIn',
            '.check': 'fadeIn',
            '#reward_detail': 'lightSpeedIn',
            '#reward_tips': 'zoomIn',
            '.gift': 'flipInY',
            '.tip': 'fadeIn',
            '#answer': 'zoomIn'
        };

        var $container = $('.current');
        for(var selector in effects){
            $(selector).hide();
            $(selector, $container).show().addClass('animated ' + effects[selector]);
        }
    }
    addAnimation();

    function pageScroll(pageNum, dir){
        var marginT = winH * pageNum;
        wrap.css({"margin-top": -marginT});
        setTimeout(function(){
            if(dir === "up"){
                var parNum = pageNum + 1;
            }else{
                var parNum = pageNum - 1;
            }

            wrapMd.eq(parNum).removeClass('current');
            wrapMd.eq(pageNum).addClass('current');

            addAnimation();
        }, 300);
    }

    $(".next_page").on("click",function(){
        if(pageNum <= mdSize-1){
            pageNum++;
            pageScroll(pageNum);
        }
    });

    var imgUrl = 'https://raw.githubusercontent.com/miyukizhang/interview_project/master/img/interview.jpg';
    var lineLink = location.href;
    var descContent = "9月18日前，完成6道高难度面试单选题，丰厚大礼等你来拿";
    var shareTitle = document.title;
    var appid = '';
    function shareFriend() {
        WeixinJSBridge.invoke('sendAppMessage', {"appid": appid,"img_url": imgUrl,"img_width": "200","img_height": "200","link": lineLink,"desc": descContent,"title": shareTitle}, function(res) {
        })
    }
    function shareTimeline() {
        WeixinJSBridge.invoke('shareTimeline', {"img_url": imgUrl,"img_width": "200","img_height": "200","link": lineLink,"desc": descContent,"title": shareTitle}, function(res) {
        });
    }
    function shareWeibo() {
        WeixinJSBridge.invoke('shareWeibo', {"content": descContent,"url": lineLink}, function(res) {
        });
    }
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            shareFriend();
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            shareTimeline();
        });
        WeixinJSBridge.on('menu:share:weibo', function(argv) {
            shareWeibo();
        });
    }, false);

});
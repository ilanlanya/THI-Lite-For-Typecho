/*! By The Mint Jin | jcl.moe */
var DPlayers = [];var DPlayerOptions = [];var newCommentIndex = 1;
window['Page'] = {
    UserAgent: navigator.userAgent,
    Referer: document.referrer, 
    IsBot: false,
    Console: function() {
        console.log("\n %c THI Lite v1.0.0 %c https://jcl.moe/ \n\n", "color: #fff; background-image: linear-gradient(90deg, #ffb6c1 0%, #f5c8cf 100%); padding:5px 1px;", "background-image: linear-gradient(90deg, #f5c8cf 0%, rgb(255, 255, 255) 100%); padding:5px 0;");
    },
    Init: function () {
        if (LocalConst.ASSETS_URL.indexOf('?') != -1) {
            LocalConst.ASSETS_URL = LocalConst.ASSETS_URL.split('?')[0];
        }

        var showH = '1';

        this.Action ();
        this.Console();
        this.SignBlogTitle();
        
        // Menu
        $("#menu").on('click', function(){
            if ($('body').hasClass('mu')) {
                $('#menu .material-icons').html('menu');
                $('html').removeClass('mu');
                $('body').removeClass('mu');
                //$("#navbar").fadeOut();
            } else {
                $('#menu .material-icons').html('close');
                $('html').addClass('mu');
                $('body').addClass('mu');
                //$("#navbar").fadeIn();
            }
        });

        $('.gototop').css('display', 'inline-block');
        $(window).scroll(function(){ 
            var scroH = $(this).scrollTop();
            if (scroH >= showH) {
                var wintop = $(window).scrollTop()
                    docheight = $(document).height(), winheight = $(window).height(),
                    scrolled = (wintop/(docheight-winheight))*100,
                    gotop = scrolled.toFixed(0);

                $('.goTOP').html(gotop + '%'); 

                $('.gototop').addClass('isVisible')
            } else if (scroH < showH) {
                $(".gototop").removeClass('isVisible');
            }
        });
        $(".gototop").click(function(){
            $('body,html').animate({scrollTop:0},1000);
            return false;
        });
        
        // Header
        $(window).scroll(function() {
            // 判断是否在顶部
            var scroH = $(this).scrollTop();
            if (scroH >= showH) {
                $("#Header").removeClass('top');
                $("nav.postNav").show();
            } else if (scroH < showH) {
                if (!$("#Header").hasClass('top')) {
                    $("#Header").addClass('top');
                    $("nav.postNav").hide();
                }
            }
            
            // 判断滚动方向
            var before = $(window).scrollTop();
            $(window).scroll(function() {
                var after = $(window).scrollTop();
                if (before<after) {
                    $("#Header").addClass('siteHeaderHidden');
                    $(".postNav").addClass('postNavFixed');
                    if ($('body').hasClass('navbar-open')) {
                        $('body').removeClass('navbar-open');
                        $("#navbar").fadeOut();
                    }
                    before = after;
                };
                if (before>after) {
                    $("#Header").removeClass('siteHeaderHidden');
                    $(".postNav").removeClass('postNavFixed');
                    before = after;
                };
            });
        });
        
        if ($('div.index').length) {
            // 适用于 GHOST 版本
            if ($('div.postImage.noCover').length) {
                var i, thumbArr = [];
                const image = [
                    'https://public.misaka.xin/Background/10.jpg!top',
                    'https://public.misaka.xin/Background/14.png',
                    'https://public.misaka.xin/Background/18.jpg',
                    'https://public.misaka.xin/Background/19.jpg',
                    'https://public.misaka.xin/Background/25.jpg',
                    'https://public.misaka.xin/Background/27.png',
                    'https://public.misaka.xin/Background/30.jpg',
                    'https://public.misaka.xin/Background/36.jpg',
                    'https://public.misaka.xin/Background/68.png',
                    'https://public.misaka.xin/Background/70.jpg'
                ];
                $('div.postImage.noCover').each(function(){
                    i = parseInt(Math.random() * image.length);
                    if (image[i].indexOf('!') != -1) {
                        thumbArr = image[i].split("!");
                        $(this).css('background-image', 'url(' + thumbArr[0] + ')');   
                        $(this).css('background-position', ' + thumbArr[1] + ');  
                    }  else {
                        $(this).css('background-image', 'url(' + image[i] + ')');    
                    }
                });
            }
        }
    },
    Action: function () {
        // 一些处理
        $("#navbar").hide();
        $("nav.postNav").hide();
        
        // 加载特效
        this.InitCanvas();
        this.Input();

        // 一言
        this.GetHitokoto();
        
        // Google Analytics
        if (LocalConst.GOOGLEANALYTICS_ID) {
            this.GoogleAnalytics();
        }

        if ($('div.post').length) {
            // 文章内图片处理
            this.SetImages();

            // 文章内容处理
            this.SetContext();
            
            // 激活 PhotoSwipe
            if($("img[data-action=zoom]").length) {
                $('#postContent').photoSwipe('img[data-action=zoom]', {bgOpacity: 0.8, shareEl: false});
            }
            
            // 加载评论
            if (LocalConst.COMMENT_SYSTEM_EMBED === LocalConst.COMMENT_SYSTEM) {
                this.bindAjaxComment();
                $.getScript(LocalConst.ASSETS_URL + '/OwO/OwO.min.js', function(){
                    new OwO({
                        logo: 'OωO',
                        container: document.getElementsByClassName('OwO')[0],
                        target: document.getElementById('textarea'),
                        api: LocalConst.ASSETS_URL + '/OwO/OwO.json',
                        position: 'down',
                        width: '360px'
                    });
                });
            } else if (LocalConst.COMMENT_SYSTEM_EMBED === LocalConst.COMMENT_SYSTEM_DISQUS){
                this.LoadDisqus();
            } else if (LocalConst.COMMENT_SYSTEM_EMBED === LocalConst.COMMENT_SYSTEM_CHANGYAN){
                this.LoadChangyan();
            }
        }
        // 隐藏加载动画
        setTimeout("Page.LoadFinish();", 1500);
    },
    LoadFinish: function() {
		$("#loading-view").addClass('folding');
    },
    SignBlogTitle: function() {
        if(!LocalConst.SIGN_SITE_TITLE) {
            return ;
        }
        var ret = '',
            text = LocalConst.SITE_NAME.split(''),
            sighArr = LocalConst.SIGN_SITE_TITLE.split('');
        $.each(text, function(i, data) {
            ret += '<span data-value="' + text[i].toLocaleUpperCase() + '">' + text[i].toLocaleUpperCase() + '</span> \n ';
        });
        $("#BlogTitle").html(ret);
        $.each(sighArr, function(i, data) {
            $("#BlogTitle > span").each(function(){
                if ($(this).data('value') == data.toLocaleUpperCase()) {
                    $(this).addClass('high');
                }
            });
        });
    },
    bindAjaxComment: function () {
        $('#comment-form').off('submit').on('submit', function (e) {
            var form = $(this);
            var submit = form.find('#submit');

            var respondDiv = form.parents('.respond');
            var respondParent = respondDiv.parent();

            var author = form.find('#author').val();
            var mail = form.find('#mail').val();
            var website = form.find('#url').val();
            var commentText = form.find('#textarea').val();

            if (commentText == null || $.trim(commentText) == '') {
                this.AddNotice(submit.data('empty-comment'));
                return false;
            }

            if (form.find('#author').length == 0 && form.find('#mail').length == 0 && form.find('#url').length == 0) {
                author = $('a[href$="profile.php"]').text();
                mail = $('a[href$="profile.php"]').data('mail') || $('a[href$="/admin/"]').data('mail');
                website = document.location.origin;
            }

            submit.attr('disabled', 'disabled').val(submit.data('posting'));

            var newCommentId = 'newComment-' + newCommentIndex;
            newCommentIndex++;
            var newComment =
                '<li itemscope="" itemtype="http://schema.org/UserComments" id="' + newCommentId + '" class="comment-body">' +
                '<div class="comment-author" itemprop="creator" itemscope="" itemtype="http://schema.org/Person">' +
                '<span itemprop="image"><img class="avatar" src="https://gravatar.meow.moe/avatar/' + md5(mail.toLowerCase()) + '?s=100&amp;r=PG&amp;d=" alt="' + author + '" width="100" height="100"></span>' +
                '<cite class="fn color-main" itemprop="name"><a href="' + website + '" rel="external nofollow" target="_blank">' + author + '</a></cite>' +
                '</div>' +
                '<div class="comment-meta">' +
                '<a href="javascript:void(0)"><time itemprop="commentTime" datetime="' + submit.data('now') + '">' + submit.data('now') + '</time></a>' +
                '<span id="' + newCommentId + '-status" class="comment-posting">' + submit.data('posting') + '</span>' +
                '</div>' +
                '<div class="comment-content" itemprop="commentText">' +
                '<p>' + commentText + '</p>' +
                '</div>' +
                '</li>';
            var added = false;
            var firstComment = false;
            var commentOrderDESC = LocalConst.COMMENTS_ORDER == 'DESC';
            if (respondParent.is('div') && respondParent.attr('id') == 'comments') {
                // 评论为新评论，加在主评论列表中

                // 评论列表存在
                if (respondParent.children('.comment-list').length > 0) {
                    if (commentOrderDESC) {
                        respondParent.children('.comment-list').first().prepend(newComment);
                    } else {
                        respondParent.children('.comment-list').first().append(newComment);
                    }
                } else {
                    // 文章的第一条评论
                    respondParent.append('<div class="comment-separator">'+
                                '<div class="comment-tab-current">'+
                                '<span class="comment-num">已有 1 条评论</span>' +
                                '</div>'+
                                '</div>');
                    respondParent.append('<ol class="comment-list">' + newComment + '</ol>');
                    firstComment = true;
                }
                added = true;
            } else if (respondParent.is('li') && respondParent.hasClass('comment-body')) {
                if (respondParent.parent().parent().is('div') && respondParent.parent().parent().attr('id') == 'comments') {
                    // 评论主评论，加在主评论的子列表中
                    if (respondParent.children('.comment-children').first().children('.comment-list').length > 0) {
                        respondParent.children('.comment-children').first().children('.comment-list').first().append(newComment);
                    } else {
                        var commentList = '<div class="comment-children" itemprop="discusses"><ol class="comment-list">'
                            + newComment + '</ol></div>';
                        respondParent.append(commentList);
                    }
                } else {
                    // 评论子评论，加在子评论列表最后
                    respondParent.parents('.comment-list').first().append(newComment);
                }
                added = true;
            }
            if (added) {
                try {
                    var offset = $('#' + newCommentId).offset();
                    if (typeof offset != 'undefined') {
                        $('html, body').animate(
                            {scrollTop: offset.top - 50}, 300
                        );
                    }
                } catch (e) {
                    console.error(e);
                }
                var error = function () {
                    try {
                        if (firstComment) {
                            respondParent.children('.comment-separator').first().remove();
                            respondParent.children('.comment-list').first().remove();
                        } else {
                            $('#' + newCommentId).remove();
                        }
                        var offset = $('#comment-form').offset();
                        if (typeof offset != 'undefined') {
                            $('html, body').animate(
                                {scrollTop: offset.top - 100}, 300
                            );
                        }
                    } catch (e) {
                        console.error(e);
                    }
                };
                try {
                    $.ajax({
                        url: form.attr('action'),
                        type: form.attr('method'),
                        data: form.serializeArray(),
                        success: function(data) {
                            if (typeof data === 'undefined') {
                                window.location.reload();
                                return false;
                            }
                            if (data.indexOf('<title>' + 'Error</title>') > 0) {
                                var el = $('<div></div>');
                                el.html(data);
                                this.AddNotice($.trim($('.container', el).text()));
                                error();
                            } else {
                                form.find('#textarea').val('');
                                if (typeof(TypechoComment) != 'undefined') {
                                    TypechoComment.cancelReply();
                                }
                                var commentList = data.match(/id="comment-\d+"/g);
                                if (commentList == null || commentList.length == 0) {
                                    window.location.reload();
                                } else {
                                    var new_id = commentList.join().match(/\d+/g).sort(function(a, b) {
                                        return a - b
                                    }).pop();
                                    var el = $('<div></div>');
                                    el.html(data);
                                    var resultElement = $('#comment-' + new_id, el);
                                    if ($.trim(resultElement.children('.comment-author').find('cite.fn a').text()) == $.trim(author)) {
                                        resultElement.children('.comment-meta').append('<span id="comment-' + new_id + '-status" class="comment-posted">' + submit.data('posted') + '</span>');
                                        var content = resultElement.children('.comment-content');
                                        content.html(content.html());
                                        $('#' + newCommentId).replaceWith(resultElement);
                                    } else {
                                        $('#' + newCommentId + "-status").text(submit.data('posted')).removeClass('comment-posting').addClass('comment-posted');
                                    }
                                }
                            }
                            submit.removeAttr('disabled').val(submit.data('init'));
                        },
                        error: function(e) {
                            console.error(e);
                            error();
                            submit.removeAttr('disabled').val(submit.data('init'));
                            // return true;
                        }
                    });
                    return false;
                } catch (e) {
                    console.error(e);
                }
            }
            return false;
        });
    },
    LoadDisqus: function() {
		if ($("#disqus_thread").length) {
			var disqus_identifier = $("#disqus_thread").data("cid");
			var disqus_title = $("#disqus_thread").data('title');
			var disqus_url = window.location.href;
			if (window.DISQUS) {
				DISQUS.reset({
					reload: true
				})
			} else {
				var dsq = document.createElement("script");
				dsq.type = "text/javascript";
				dsq.async = true;
				dsq.src = "//" + LocalConst.DISQUS_SHORT_NAME + ".disqus.com/embed.js"; (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq)
			}
		}
    },
    LoadChangyan: function() {
		if ($("#SOHUCS").length) {
			var appid = LocalConst.CHANGYAN_APPID;
			var conf = LocalConst.CHANGYAN_APPKEY;
			var width = window.innerWidth || document.documentElement.clientWidth;
			if (width < 960) {
				window.document.write('<script id="changyan_mobile_js" charset="utf-8" type="text/javascript" src="//changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + "&conf=" + conf + '"><\/script>')
			} else {
				var loadJs = function(d, a) {
					var c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
					var b = document.createElement("script");
					b.setAttribute("type", "text/javascript");
					b.setAttribute("charset", "UTF-8");
					b.setAttribute("src", d);
					if (typeof a === "function") {
						if (window.attachEvent) {
							b.onreadystatechange = function() {
								var e = b.readyState;
								if (e === "loaded" || e === "complete") {
									b.onreadystatechange = null;
									a()
								}
							}
						} else {
							b.onload = a
						}
					}
					c.appendChild(b)
				};
				loadJs("//changyan.sohu.com/upload/changyan.js",
				function() {
					window.changyan.api.config({
						appid: appid,
						conf: conf
					})
				})
			}
		}
	},
    GoogleAnalytics: function() { 
        (function(i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        i[r] = i[r] ||
        function() { (i[r].q = i[r].q || []).push(arguments)
        },
        i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
        })(window, document, "script", "//static.misaka.xin/Analytics/analytics.js", "ga");
        ga("create", LocalConst.GOOGLEANALYTICS_ID, "auto");
        if (window.ga) {
            var location = window.location.pathname + window.location.search;
            ga("send", "pageview", {
                "page": location,
                "title": document.title
            })
        }
    },
    OriginTitile: function() {
        var OriginTitile = document.title;
        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                $("#web-icon").attr("href", LocalConst.ASSETS_URL + "images/fail.ico");
                document.title = "(●—●)喔哟，崩溃啦！";
            } else {
                $("#web-icon").attr("href", LocalConst.ASSETS_URL + "images/favicon.ico");
                document.title = "(/≧▽≦/)咦！又好了！";
                setTimeout(function() {
                    document.title = OriginTitile
                }, 1000);
            }
        })
    },
    Input: function() {
        POWERMODE.colorful = true; // make power mode colorful
        POWERMODE.shake = false; // turn off shake
        document.body.addEventListener('input', POWERMODE);
    },
    SetContext: function () {
        /*
        var str = $("#postContentTemp").html(),
            reg = '\\[H(.*?) (.*?)\\](.*?)\\[\\/H(.*?)\\](<br>|<br \\/>)*', arr, content, imgclass = '';
        if (arr = str.match(new RegExp(reg, 'g'))) {
            $.each(arr, function(index, value){
                result = value.match(new RegExp(reg));
                if (result[3].match('imageGrid')) {
                    imgclass = ' hasImageGrid';
                }
                if (result[2]) {
                    content = '<section class="chapterSpecs material detail' + imgclass + '">';
                    content += '<div class="postContent" id="postContent">';
                    content += '<h3 class="noselect title" id="' + result[2] + '">' + result[2] + '</h3>';
                    content += '<div class="specsContent">';
                    content += result[3];
                    content += '</div>';
                    content += '</div>';
                    content += '</section>';
                } else {
                    content = '<section class="chapterSpecs material detail' + imgclass + '">';
                    content += '<div class="postContent" id="postContent">';
                    content += result[3];
                    content += '</div>';
                    content += '</section>';
                }
                
                $('#postContent').append(content);
                imgclass = '';
            });
        } else {
            content = '<section class="chapterSpecs material detail">';
            content += '<div class="postContent" id="postContent">';
            content += str;
            content += '</div>';
            content += '</section>';
            $('#postContent').append(content);
        }
        $("#postContent > .specsContent").each(function(){
            $(this).find('br:first').remove();
            $(this).find('br:last').remove();
        });
        */
        
        $("section.hasImageGrid figure.imageGrid figcaption").each(function() {
            $(this).html($(this).parent().parent().parent().find('.title').text());
        });
        
        // 加密文章样式处理
        if ($("form.protected").length) {
            $("form.protected input.submit").addClass('btn-factory-link');
            $("form.protected input[name=protectPassword]").attr('placeholder', $("form.protected p.word").html());
            $("form.protected p.word").remove();
        }
        
        // DPlayer 
        $("#postContent DPlayer").each(function(i){
            var url = $(this).data('url'),
                pic = $(this).data('pic'),
                autoplay = $(this).data('autoplay'),
                thumbnails = $(this).data('thumbnails'),
                subtitle = $(this).data('subtitle'),
                id = md5(md5(md5(LocalConst.SITE_URL + url)));
            if (!url) {
                return;
            }
            var Option = {
                id: id,
                autoplay: autoplay ? autoplay : false,
                video: {
                    url: url,
                },
                danmaku: {
                    id: id,
                    api: 'https://api.meow.moe/DPlayer'
                }
            };
            if (subtitle) {
                Option.push({
                   subtitle: {
                        url: subtitle
                    } 
                });
            }
            if (pic) {
                Option.video.pic = pic;
            }
            if (thumbnails) {
                Option.video.thumbnails = thumbnails;
            }
            var dom = '<div id="DPlayer' + id + '"></div>';
            $(this).html(dom);
            DPlayerOptions.push(Option);
        });
        this.InitDPlayer();
        
        // Links
        $("#postContent link").each(function(i){
            var url = $(this).data('url'),
                name = $(this).data('name'),
                img = $(this).data('img');
            if (!url || !name || !img) {
                return;
            }
            
            var dom = '<li class="link">' +
                '<a href="' + url + '" target="_blank">' + 
                  '<div class="link-img" style="background-image: url(' + img + ')"></div>' +
                '<span>' + name + '</span>' +
                '</a>' +
            '</li>';
            $(this).replaceWith(dom);
        });
        
        // TOC By The Jimmy Cai (jimmehcai@gmail.com)
        document.querySelectorAll('.postBody:not(.postContentDom) h1,.postBody:not(.postContentDom) h2,.postBody:not(.postContentDom) h3,.postBody:not(.postContentDom) h4,.postBody:not(.postContentDom) h5,.postBody:not(.postContentDom) h6').forEach((heading, i) => {
            if (!heading.id) {
                heading.id = heading.textContent;
            };
            
            let toc = $('#toc')[0];
            let active = '';
            if (i == 0) {
                active = ' current';
            }
    
            let li = document.createElement('li');
            li.className = 'toc toc-' + heading.tagName.toLowerCase() + active;
            li.id = 'toc-' + i;
    
            let a = document.createElement('a');
            a.textContent = heading.textContent;
            a.dataset.id = heading.id;
            a.setAttribute('href', window.location.origin + window.location.pathname + '#' + heading.id);
            
            li.appendChild(a);
            toc.appendChild(li);
        });
        var headings = [];
        $(".toc").each(function(i){
            headings.push({
        		el: this,
        		offsetTop: $('#' + $(this).children('a').data('id')).offset().top-128
        	});
        });
        window.addEventListener('scroll', (e) => {
            if (!$("#postBody").length) {
                return ;
            }
            let scrollTop = window.scrollY,
                bottom = document.getElementById('postBody').offsetTop + document.getElementById('postBody').getBoundingClientRect().height;
          
            let currents = headings.filter((heading, i, arr) => {
                let next = arr[i + 1],
                    nextScrollTop;
        
                if (!next) {
                    nextScrollTop = bottom;
                } else {
                    nextScrollTop = next.offsetTop - (window.innerHeight / 5);
                };
        
                let scrollTop = window.scrollY + (window.innerHeight / 2);
                return heading.offsetTop <= scrollTop && nextScrollTop > window.scrollY;
            });
        
            let current = currents[0],
                past = document.getElementById('toc').querySelectorAll('.current')[0];
            if (past) {
                past.classList.remove('current');
            };
        
            if (current) {
                current.el.classList.add('current');
        
            };
        });
        
        $("body").delegate(".toc > a,.header-cta > .btn-factory-link.is-right", "click", function(event){     
            event.preventDefault();
            $('html,body').animate({scrollTop:$(this.hash).offset().top-128},1000);
        });
        
        // Button
        $("#postContent a").each(function(i){
            var text = $(this).text();
            if (text.toLocaleLowerCase() == 'github') {
                $(this).addClass('btn-factory-link')
            }
        });
    },
    InitDPlayer: function () {
        if ('undefined' == typeof(DPlayerOptions) || 'undefined' == typeof(DPlayers)) {
            return;
        }
        var len = DPlayerOptions.length;
        for(var i=0;i<len;i++){
            DPlayers[i] = new DPlayer({
                container: document.getElementById('DPlayer' + DPlayerOptions[i]['id']),
                screenshot: true,
                autoplay: DPlayerOptions[i]['autoplay'],
                video: DPlayerOptions[i]['video'],
                subtitle: DPlayerOptions[i]['subtitle'],
                danmaku: DPlayerOptions[i]['danmaku']
            });
        }
    },
    SetImages: function () {
        if ($('p img').length > 1) {
            var html = '<figure class="imageGrid">';
            $('p img').each(function(){
                var src = $(this).attr("src");
                var alt = $(this).attr("alt");
                html += '<div><img data-action="zoom" src="' + src + '"></div>';
            });
            html += '<figcaption>' + $('p img').attr("alt") + '</figcaption>';
            html += '</figure>';
            var i = 0;
            $('p img').each(function(){
                if (i == 0) {
                    $(this).replaceWith(html);
                } else {
                    $(this).replaceWith('');
                }    
                i++;
            });
            var m = $(".imageGrid img:not(.loaded)").length;
			var n = 0;
			$(".imageGrid img[src]").each(function() {
				$(this).on("load", function() {
					n = n + 1;
					if (n == m) {
						$('.imageGrid').each(function(i, ParentData){
                            $('img', ParentData).each(function(z, ChlidData){
                                    var imgWidth = Math.round($(ChlidData).width()),
                                        imgHeight = Math.round($(ChlidData).height());
                                    $(this).parent().css('width', 200 * imgWidth / imgHeight + 'px');
                                    $(this).parent().css('flex-grow', 200 * imgWidth / imgHeight);
                                    $(this).parent().attr('data-width', imgWidth);
                                    $(this).parent().attr('data-heigth', imgHeight);
                            });
                        });
					}
				})
			});
            $(window).bind("load resize", function() {
				$('.imageGrid').each(function(i, ParentData){
                    $('img', ParentData).each(function(z, ChlidData){
                            var imgWidth = Math.round($(ChlidData).width()),
                                imgHeight = Math.round($(ChlidData).height());
                            $(this).parent().css('width', 200 * imgWidth / imgHeight + 'px');
                            $(this).parent().css('flex-grow', 200 * imgWidth / imgHeight);
                            $(this).parent().attr('data-width', imgWidth);
                            $(this).parent().attr('data-heigth', imgHeight);
                    });
                });
			});
            $('p.imagegrid br').each(function(){
                $(this).replaceWith('');
            });
        } else if($('p img').length == 1) {
            $('p img').each(function(i, data){
                var src = $(this).attr("src");
                var alt = $(this).attr("alt");
                var html = "<figure><img data-action=\"zoom\" src=\"" + src + "\"><figcaption>" + alt + "</figcaption></figure>";
                $(this).replaceWith(html);
            });
        }
    },
    Error: function () {
        var OwOArray = "\\(^\u0414^)/ (\u0387.\u0387) (\u02da\u0394\u02da)b (\u0387_\u0387) (^_^)b (>_<) (o^^)o (;-;) (\u2265o\u2264) \\(o_o)/ (^-^*) (='X'=)".split(" ");
        var i = parseInt(Math.random() * OwOArray.length);
        $("#error-emoji").append(OwOArray[i]);
        $("div.blank-page").removeAttr("style");
    },
    AddNoticeDom: function (msg) {
        var obj = $('#notification');
        if (obj[0]) return false;
        var title = '<i class="material-icons icon">notifications</i>' + msg;
        var html = '<div id="notification" class="js-msg"><div class="title">' + title + '</div><div class="info"></div></div>';
        $('body').append(html);
    },
    RemoveNotice: function () {
        var notification = $('#notification')[0];
        if (notification) notification.remove();
    },
    AddNotice: function (content) {
        this.AddNoticeDom('New Notification');
        var notification = $('#notification'),
            info = $('#notification .info');
        if (info.hasClass('has')) {
            clearTimeout(closeNotification);
            info.removeClass('has');
        }
        var msg = '<span class="msg">'+ content +'</span>';
        info.html(msg);
        info.addClass('has');
        notification.show();
        closeNotification = setTimeout(function() {
            notification.slideUp(300, function() {
                Page.RemoveNotice();
            });
        }, 6000);
    },
    GetHitokoto: function () {
        $.ajax({
            type: 'GET',
            url: 'https://api.meow.moe/Hitokoto',
            dataType: 'json',
            cache: false,
            success:function(result){
                if (result.code == 1){
                    $('hitokoto').html(result.data.hitokoto);
                } else {
                    $('hitokoto').html('读取数据失败了的说…… _(:з」∠)_');
                }
            }
        });
    },
    InitCanvas: function () {
        var App=App||{};!function(){var e=function(){var e,i,t,o,n,a,s,r,c,l,h,p,d,u,g,v=function(){if($(".siteHeaderBG").length)if(o=window.devicePixelRatio&&cssua.ua.mobile?window.devicePixelRatio:1,e=$(window),i=$(".siteHeaderBG"),i.append('<canvas id="wave-canvas"></canvas>'),n=document.getElementById("wave-canvas"),t=new createjs.Stage(n),a=new createjs.Shape,createjs.Ticker.setFPS(30),createjs.Ticker.addEventListener("tick",t),r=n.height-n.height/2.7,c=n.height/6.5,l=60,h=.41,p=2.5,d=340,u=2*Math.PI/d,g=10,Modernizr.canvas){w();var s=_.throttle(f,100);e.on("resize",s),f()}else $(n).remove()},f=function(){if(n.width=i.width()+2,n.height=i.outerHeight(),r=n.height-n.height/2.7,c=n.height/7.5,h=.41,p=2.5,n.width/o<680?(s=new m,r=n.height-10,p=3.8,h=.2,c=45):s=new m,window.devicePixelRatio&&cssua.ua.mobile){var e=n.getAttribute("height"),a=n.getAttribute("width");n.setAttribute("width",Math.round(a*window.devicePixelRatio)),n.setAttribute("height",Math.round(e*window.devicePixelRatio)),n.style.width=a+"px",n.style.height=e+"px",t.scaleX=t.scaleY=window.devicePixelRatio}},w=function(){s=new m,t.addChild(a),C()},m=function(){this.amp=10+12*Math.random(),this.freq=.0044,this.phase=2+4*Math.random(),this.offset=2+4*Math.random(),n.width/o<680&&(this.amp=2+6*Math.random(),this.freq=.018,this.phase=1+2*Math.random(),this.offset=1+2*Math.random()),this.point=function(e){return r-A()+this.offset+this.amp*Math.sin(this.freq*e+this.phase+u*g)}},A=function(){var e=new Date;return c/2*Math.abs(e.getSeconds()+e.getMilliseconds()/1e3-30)/30},C=function(){a.graphics.clear(),a.graphics.beginFill("#fff");for(var e=0;e<n.width+2;e++)a.graphics.lineTo(e,(s.point(e)*p+s.point(e))*h);a.graphics.lineTo(n.width,n.height),a.graphics.lineTo(0,n.height),a.graphics.closePath(),a.graphics.endFill(),g=(g-1)%d,t.update(),setTimeout(C,1e3/l)};return{initialize:v}}();App.waveCanvas=e,App.waveCanvas.initialize()}();
    }
};
$(document).pjax('a:not([nopjax])', '.pjax-container', {scrollTo:false, timeout:8000});
$(document).on('pjax:send', function() {
    $('html').attr('class', '');
    $("#loading-view").removeClass('folding');
});
$(document).on('pjax:complete', function() {
    $("html,body").animate({scrollTop:$('.siteHeaderBG').height()},1300);
    Page.Action();
});
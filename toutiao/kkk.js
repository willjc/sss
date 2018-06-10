riot.tag("weather", '<div class="w-header"> <span class="y-icon icon-location" onclick="{changeLocation}" ga_event="mh_change_city">&nbsp;{options.city}</span> <span class="wind">{options.wind}</span> <span class="air" riot-style="background: {options.level}">{options.air}</span> </div> <ul class="y-box days-weather {show: options.weather_show}"> <li class="y-left day"> <span class="title">浠婂ぉ</span> <div title="{options.weather.current_condition}" class="weather-icon weather-icon-{options.weather.weather_icon_id}"></div> <span class="temperature"> <em>{options.weather.low_temperature}</em>&#176; &#47; <em>{options.weather.high_temperature}</em>&#176; </span> </li> <li class="y-left day"> <span class="title">鏄庡ぉ</span> <div title="{options.weather.tomorrow_condition}" class="weather-icon weather-icon-{options.weather.tomorrow_weather_icon_id}"></div> <span class="temperature"> <em>{options.weather.tomorrow_low_temperature}</em>&#176; &#47; <em>{options.weather.tomorrow_high_temperature}</em>&#176; </span> </li> <li class="y-left day"> <span class="title">鍚庡ぉ</span> <div title="{options.weather.dat_condition}" class="weather-icon weather-icon-{options.weather.dat_weather_icon_id}"></div> <span class="temperature"> <em>{options.weather.dat_low_temperature}</em>&#176; &#47; <em>{options.weather.dat_high_temperature}</em>&#176; </span> </li> </ul> <div class="y-box city-select {show: !options.weather_show}"> <div class="y-box"> <div class="y-left select-style"> <p class="y-box"> <span class="y-left name">{options.current_province}</span> <span class="y-right y-icon icon-more" onclick="{showProvinces}"></span> </p> <div class="y-box province-list {show: options.province_show}"> <a class="y-left item" href="javascript:;" each="{item, i in options.locations}" onclick="{changeProvince}"> {item} </a> </div> </div> <div class="y-right select-style"> <p class="y-box"> <span class="y-left name">{options.current_city}</span> <span class="y-right y-icon icon-more" onclick="{showCities}"></span> </p> <div class="y-box city-list {show: options.city_show}"> <a class="y-left item" href="javascript:;" each="{item, i in options.cities}" onclick="{changeCity}"> {item} </a> </div> </div> </div> <div class="y-box action"> <a href="javascript:;" class="y-left ok-btn" onclick="{onSubmitClick}">纭畾</a> <a href="javascript:;" class="y-right cancel-btn" onclick="{onCancelClick}">鍙栨秷</a> </div> </div>', 'class="y-weather"',
function() {
    function t(t) {
        var i = !0;
        return t >= 0 && 50 >= t ? {
            c: i ? "#5cbf4c": "#5c8828",
            t: "浼�"
        }: t >= 51 && 100 >= t ? {
            c: i ? "#5cbf4c": "#5c8828",
            t: "鑹�"
        }: t >= 101 && 150 >= t ? {
            c: i ? "#ff9f2d": "#c58120",
            t: "杞诲害姹℃煋"
        }: t >= 151 && 200 >= t ? {
            c: i ? "#ff9f2d": "#c58120",
            t: "涓害姹℃煋"
        }: t >= 201 && 300 >= t ? {
            c: i ? "#ff5f5f": "#cf3d3d",
            t: "閲嶅害姹℃煋"
        }: t >= 301 ? {
            c: i ? "#ff5f5f": "#cf3d3d",
            t: "涓ラ噸姹℃煋"
        }: {
            c: "rgba( 214, 117, 3, 0.8 )",
            t: "鍏朵粬"
        }
    }
    this.options = {
        current_province: "鍖椾含",
        current_city: "鍖椾含",
        province_show: !1,
        city_show: !1,
        weather_show: !0
    },
    riot.observable(this),
    this.on("weatherChange",
    function(t) {
        this._renderWeather(t)
    }),
    this.init = function() {
        this._getCities()
    }.bind(this),
    this.showProvinces = function() {
        this.options.city_show = !1,
        this.options.province_show = !this.options.province_show
    }.bind(this),
    this.showCities = function() {
        this.options.province_show = !1,
        this.options.city_show = !this.options.city_show
    }.bind(this),
    this.changeLocation = function() {
        this.options.weather_show = !1
    }.bind(this),
    this.changeProvince = function(t) {
        this.options.city_show = !1,
        this.options.province_show = !1,
        this.options.current_province = t.item.item,
        this._renderCities(t.item.item)
    }.bind(this),
    this.changeCity = function(t) {
        this.options.city_show = !1,
        this.options.province_show = !1,
        this.options.current_city = t.item.item
    }.bind(this),
    this.onSubmitClick = function() {
        var t = this;
        this.options.weather_show = !0,
        this._getWeather({
            city: t.options.current_city
        })
    }.bind(this),
    this.onCancelClick = function() {
        this.options.weather_show = !0
    }.bind(this),
    this._getWeather = function(t) {
        var i = this;
        http({
            url: "/stream/widget/local_weather/data/",
            method: "GET",
            data: t,
            success: function(t) {
                t = t || {},
                "success" === t.message && (i._renderWeather(t.data.weather), Cookies.set("WEATHER_CITY", t.data.city, {
                    expires: 100
                }), i.parent && i.parent.trigger("weatherChange", t.data.weather))
            }
        })
    }.bind(this),
    this._renderWeather = function(i) {
        this.options.weather = i,
        this.options.city = i.city_name,
        this.options.wind = i.wind_direction + i.wind_level + "绾�",
        this.options.air = i.quality_level + " " + i.aqi,
        this.options.level = t(i.aqi).c,
        this.update()
    }.bind(this),
    this._getCities = function() {
        var t = this;
        http({
            url: "/stream/widget/local_weather/city/",
            method: "GET",
            success: function(i) {
                i = i || {},
                "success" === i.message && (t.options.locations = i.data, t._renderCities(t.options.current_province))
            }
        })
    }.bind(this),
    this._renderCities = function(t) {
        this.options.cities = this.options.locations[t];
        for (var i in this.options.cities) {
            this.options.current_city = i;
            break
        }
        this.update()
    }.bind(this),
    this.on("mount",
    function() {
        this.init()
    })
}),
riot.tag("nav", '<div class="nav"> <ul class="y-box nav-list" ga_event="mh_channel"> <li each="{options.navItem}" class="y-left nav-item"> <a class="nav-link {active: location.pathname == url}" href="{url}" target="_blank" ga_event="mh_channel_{en}">{name}</a> </li> <li class="y-left nav-item nav-more"> <a class="nav-link" href="javascript:;"> 鏇村<i class="y-icon icon-more"></i> </a> <div class="nav-layer"> <ul class="nav-more-list"> <li each="{options.navMore}" class="nav-more-item"> <a href="{url}" target="_blank" ga_event="mh_channel_{en}">{name}</a> </li> </ul> </div> </li> </ul> </div>',
function() {
    this.options = {
        navItem: [{
            name: "鎺ㄨ崘",
            url: "/",
            en: "recommend"
        },
        {
            name: "鐑偣",
            url: "/ch/news_hot/",
            en: "hot"
        },
        {
            name: "瑙嗛",
            url: "/ch/video/",
            en: "video"
        },
        {
            name: "鍥剧墖",
            url: "/ch/news_image/",
            en: "image"
        },
        {
            name: "娈靛瓙",
            url: "/ch/essay_joke/",
            en: "essay"
        },
        {
            name: "濞变箰",
            url: "/ch/news_entertainment/",
            en: "entertainment"
        },
        {
            name: "绉戞妧",
            url: "/ch/news_tech/",
            en: "tech"
        },
        {
            name: "姹借溅",
            url: "/ch/news_car/",
            en: "car"
        },
        {
            name: "浣撹偛",
            url: "/ch/news_sports/",
            en: "sports"
        },
        {
            name: "璐㈢粡",
            url: "/ch/news_finance/",
            en: "finance"
        },
        {
            name: "鍐涗簨",
            url: "/ch/news_military/",
            en: "military"
        },
        {
            name: "鍥介檯",
            url: "/ch/news_world/",
            en: "world"
        },
        {
            name: "鏃跺皻",
            url: "/ch/news_fashion/",
            en: "fashion"
        },
        {
            name: "鏃呮父",
            url: "/ch/news_travel/",
            en: "travel"
        }],
        navMore: [{
            name: "鎺㈢储",
            url: "/ch/news_discovery/",
            en: "discovery"
        },
        {
            name: "鑲插効",
            url: "/ch/news_baby/",
            en: "baby"
        },
        {
            name: "鍏荤敓",
            url: "/ch/news_regimen/",
            en: "regimen"
        },
        {
            name: "缇庢枃",
            url: "/ch/news_essay/",
            en: "essay"
        },
        {
            name: "娓告垙",
            url: "/ch/news_game/",
            en: "game"
        },
        {
            name: "鍘嗗彶",
            url: "/ch/news_history/",
            en: "history"
        },
        {
            name: "缇庨",
            url: "/ch/news_food/",
            en: "food"
        }]
    }
}),
riot.tag("wsearch", '<div name="searchBox" class="wsearch"> <form name="searchForm" action="/search/" method="get" target="_blank" onsubmit="{onSearchClick}"> <div name="inputbox" class="y-box input-group"> <input class="y-left input-text" name="keyword" value="{options.keyword}" autocomplete="off" ga_event="mh_search" type="text" placeholder="璇疯緭鍏ュ叧閿瓧" onkeyup="{onKeyup}" onfocus="{onFocus}" onblur="{onBlur}"> <div class="y-right btn-submit"> <button type="submit" href="javascript:;"> <i class="y-icon icon-search" ga_event="mh_search"></i> </button> </div> </div> </form> <div class="layer {layer-show: options.layershow}" if="{options.suggestList.length > 0}"> <ul ga_event="mh_search"> <li each="{item, i in options.suggestList}" class="search-item" onclick="{onSearchItemClick}"> <a href="javascript:;"> <i if="{options.isHotwords}" class="search-no search-no-{i+1}">{i + 1}</i> <i if="{!options.isHotwords}" class="search-sug"></i> <span class="search-txt">{item}</span> </a> </li> </ul> </div> </div>',
function(t) {
    function i(t) { (t >= 65 && 90 >= t || t >= 48 && 57 >= t || t >= 96 && 111 >= t || t >= 186 && 222 >= t || 8 == t || 46 == t || 32 == t || 13 == t) && (clearTimeout(a), a = setTimeout(function() {
            a = null,
            e(),
            s.update()
        },
        200)),
        s.update()
    }
    function e() {
        var t = s.keyword.value;
        "" != t.trim() && http({
            url: "/search/sug/",
            data: {
                keyword: t
            },
            method: "get",
            success: function(t) {
                "success" == t.message ? (s.options.suggestList = t.data, s.options.layershow = !0) : s.options.suggestList = [],
                s.options.isHotwords = !1,
                s.update()
            }
        })
    }
    var s = this,
    o = [];
    this.options = {
        suggestList: [],
        keyword: "",
        searchTip: "澶у閮藉湪鎼滐細",
        layershow: !1,
        isHotwords: !1
    },
    this.on("mount",
    function() {
        this.init()
    }),
    this.init = function() { ! t.noHot && this._getHotWords()
    }.bind(this),
    this._getHotWords = function() {
        http({
            url: "/hot_words/",
            method: "GET",
            success: function(t) {
                t = t.hot_words || t || [],
                _.isArray(t) && 0 !== t.length && (s.options.suggestList = o = t, s.options.isHotwords = !0, s.options.keyword = s.options.searchTip + t[0], s.update())
            }
        })
    }.bind(this),
    this.onKeyup = function(t) {
        "" == this.keyword.value.trim() ? (this.options.isHotwords = !0, this.options.suggestList = o) : i(t.keyCode)
    }.bind(this),
    this.onFocus = function() {
        this.inputbox.style["border-color"] = "#ed4040",
        this.options.keyword = "",
        this.options.layershow = !0
    }.bind(this),
    this.onBlur = function() {
        this.inputbox.style["border-color"] = "#e8e8e8",
        this.options.layershow = !1
    }.bind(this),
    this.onSearchClick = function() {
        var t, i = this.keyword.value;
        return i ? (t = i.slice(0, 6), t !== this.options.searchTip || (this.options.keyword = i.slice(6), this.options.keyword) ? !0 : (this.keyword.focus(), !1)) : (this.keyword.focus(), !1)
    }.bind(this),
    this.onSearchItemClick = function(t) {
        this.options.keyword = t.item.item,
        this.update(),
        this.searchForm.submit()
    }.bind(this);
    var a = null
}),
riot.tag("wtopbar", '<div class="y-box wtopbar"> <ul class="y-left" if="{opts.home}"> <li class="tb-item"> <a class="tb-link" href="http://app.toutiao.com/news_article/" target="_blank" ga_event="mh_nav_others">涓嬭浇APP</a> </li> <li class="tb-item weather" if="{opts.home}"> <a class="tb-link" href="javascript:;"> <span>&nbsp;{ options.city }</span> <span class="city_state">{ options.state }</span> <span class="city_temperature"> <em>{options.low}</em>&#176; &nbsp;&#47;&nbsp; <em>{options.top}</em>&#176; </span> <i class="y-icon icon-more"></i> </a> <div class="weather-box"> <div riot-tag="weather"></div> </div> </li> </ul> <div class="y-left y-nav-topbar" riot-tag="nav" if="{!opts.home}"></div> <ul class="y-right"> <li class="tb-item userbox"> <div riot-tag="wuserbox" userinfo="{opts.userInfo}" abtype="{opts.abType}" pageid="{opts.pageId}"></div> </li> <li class="tb-item"> <a onclick="{feedbackClick}" class="tb-link" href="javascript:void(0)">鍙嶉</a> </li> <li class="tb-item"> <a class="tb-link" href="https://mp.toutiao.com/profile_introduction/infringement/complain" ga_event="mh_nav_complain" target="_blank">鎶曡瘔渚垫潈</a> </li> <li class="tb-item more"> <a class="tb-link" href="/about/">澶存潯浜у搧</a> <div class="layer"> <ul> <li> <a href="https://www.wukong.com" class="layer-item" ga_event="mh_nav_others" target="_blank">闂瓟</a> </li> <li> <a href="https://mp.toutiao.com/" class="layer-item" target="_blank" ga_event="mh_nav_others">澶存潯鍙�</a> </li> <li> <a href="https://tuchong.com/" class="layer-item" target="_blank" ga_event="mh_nav_others">鍥捐櫕</a> </li> <li> <a href="https://stock.tuchong.com/?source=ttweb" target="_blank" ga_event="mh_nav_others" class="layer-item">姝ｇ増鍥惧簱</a> </li> <li> <a href="https://ad.toutiao.com/promotion/?source2=pchometop" class="layer-item" target="_blank" ga_event="mh_nav_ad">骞垮憡鎶曟斁</a> </li> </ul> </div> </li> </ul> <div id="J_userFeedback"></div> </div>',
function(t) {
    this.options = {
        city: "",
        state: "",
        top: 0,
        low: 0,
        userInfo: t.userInfo
    };
    var i = this.tags.weather;
    this.tags.userFeedback,
    this.init = function() {
        if (this.opts.home) {
            var t = Cookies.get("WEATHER_CITY") || "";
            this._getWeather({
                city: t
            })
        }
    }.bind(this),
    this._getWeather = function(t) {
        var e = this;
        http({
            url: "/stream/widget/local_weather/data/",
            method: "GET",
            data: t,
            success: function(t) {
                t = t || {},
                "success" === t.message && (e._renderWeather(t.data.weather), i && i.trigger("weatherChange", t.data.weather))
            }
        })
    }.bind(this),
    this._renderWeather = function(t) {
        this.options.weather = t,
        this.options.city = t.city_name,
        this.options.state = t.current_condition,
        this.options.top = t.high_temperature,
        this.options.low = t.low_temperature,
        this.update()
    }.bind(this),
    this.init(),
    this.on("weatherChange",
    function(t) {
        this._renderWeather(t)
    }),
    this.on("mount",
    function() {
        var t = utils.getHashValue("#userFeedback");
        1 == t && riot.mount(".wtopbar #J_userFeedback", "userFeedback", {})
    }),
    this.feedbackClick = function() {
        riot.mount(".wtopbar #J_userFeedback", "userFeedback", {})
    }.bind(this)
}),
riot.tag("wuserbox", '<div class="y-box wuserbox"> <a if="{options.id && options.isPgc}" class="y-left new-article" href="http://mp.toutiao.com/new_article/" ga_event="mh_write">鍙戞枃</a> <div if="{options.id}" class="y-right username"> <a ga_event="mh_nav_user" class="user-head" href="//www.toutiao.com/c/user/{options.id}/" target="_blank" rel="nofollow"> <div class="user-image"> <img onload="this.style.opacity=1;" riot-src="{options.avatarUrl}"> </div> <span>{options.name}</span> </a> <div class="user-layer"> <ul ga_event="mh_nav_user"> <li><a href="//www.toutiao.com/c/user/{options.id}/?tab=favourite" class="layer-item" target="_blank" rel="nofollow">鎴戠殑鏀惰棌</a></li> <li><a href="//www.toutiao.com/c/user/relation/{options.id}/?tab=following" class="layer-item" target="_blank" rel="nofollow">鎴戠殑鍏虫敞</a></li> <li><a href="//www.toutiao.com/c/user/relation/{options.id}/?tab=followed" class="layer-item" target="_blank" rel="nofollow">鎴戠殑绮変笣</a></li> <li> <a href="https://sso.toutiao.com/logout/" class="layer-item" rel="nofollow">閫€鍑�</a> </li> </ul> </div> </div> <div if="{!options.id}" class="nav-login"> <a ga_event="nav_login" href="javascript:;" onclick="{onLoginClick}"> <span>鐧诲綍</span> </a> <div if="{options.alertMsg}" class="y-box login-layer"> <div class="y-left login-alert-icon"></div> <div class="y-right"> <p>鎵嬫満鍙风櫥褰曚笂绾垮暒锛侊紒锛�</p> <p>鐧诲綍鍚屾澶存潯App闃呰鍏磋叮锛屾帹鑽愭洿绮惧噯锛�</p> </div> <span onclick="{msgCloseClick}"> <i class="y-icon icon-dislikenewfeed"></i> </span> </div> </div> </div>',
function(t) {
    var i = this;
    t.pageid,
    t.abtype,
    this.options = {
        id: t.userinfo.id,
        name: t.userinfo.name,
        avatarUrl: t.userinfo.avatarUrl,
        isPgc: t.userinfo.isPgc || !1,
        alertMsg: !1
    },
    this.onLoginClick = function() {
        window.location.href = "https://sso.toutiao.com/login/"
    }.bind(this),
    window.on("userChange",
    function(t) {
        t && (i.options.id = t.user_id, i.options.name = t.name, i.options.avatarUrl = t.avatar_url, i._isPgc(), i.update())
    }),
    this._isPgc = function() {
        var t = this;
        http({
            url: "/user/pgc_info/",
            method: "get",
            cache: !1,
            success: function(i) {
                i = i || {},
                "success" === i.message && i.data.is_pgc_author && (t.options.isPgc = !0, t.update())
            }
        })
    }.bind(this)
}),
riot.tag("login", '<div class="login-dialog {hide: options.hide}"> <a class="btn" href="javascript:;" onclick="{hide}"> <i class="icon icon-close"></i> </a> <div class="login-dialog-header"> <h3>閭鐧诲綍</h3> </div> <div class="login-dialog-inner" data-node="inner"> <div class="login-pannel bottom-line"> <form action="/auth/login/" method="POST" onsubmit="{onFormSubmit}"> <ul> <li> <div class="input-group"> <div class="input"> <label>閭</label> <input class="name" name="name_or_email" type="text" placeholder="璇蜂娇鐢ㄦ偍鐨勬敞鍐岄偖绠�" autocomplete="off" spellcheck="false"> </div> </div> </li> <li> <div class="input-group"> <div class="input"> <label>瀵嗙爜</label> <input class="password" name="password" type="password" data-node="password" placeholder="瀵嗙爜" autocomplete="off" spellcheck="false"> </div> </div> </li> <li class="captcha-box {show: options.captchaImg}"> <div class="input-group"> <div class="input"> <input class="password" name="captcha" type="text" data-node="captcha" placeholder="楠岃瘉鐮�" autocomplete="off" spellcheck="false"> <img name="captchaImg" riot-src="{options.captchaImg}"> </div> </div> </li> <li> <div class="input-group"> <input type="checkbox" name="remember_me" checked="" style="vertical-align:top"> <label for="remember_me" class="label">璁颁綇璐﹀彿</label> </div> </li> <li> <div class="input-group" style="text-align: center;"> <input type="submit" class="submit-btn" value="鐧诲綍"> <p class="{error: options.errorMsg}">{options.errorMsg}</p> </div> </li> </ul> </form> </div> <div class="login-dialog-header"> <h3>鍚堜綔缃戠珯甯愬彿鐧诲綍</h3> </div> <div class=""> <ul class="y-box sns_login_list" onclick="{onSnsLoginClick}"> <li class="sinaweibo"> <a href="javascript:;" data-pid="sina_weibo" ga_event="login_sina_weibo"> <i class="icon"></i> 鏂版氮寰崥 </a> </li> <li class="qqweibo"> <a href="javascript:;" data-pid="qq_weibo" ga_event="login_tencnet_weibo"> <i class="icon"></i> 鑵捐寰崥 </a> </li> <li class="qzone"> <a href="javascript:;" data-pid="qzone_sns" ga_event="login_qqzone"> <i class="icon"></i> QQ绌洪棿 </a> </li> <li class="renren"> <a href="javascript:;" data-pid="renren_sns" ga_event="login_renren"> <i class="icon"></i> 浜轰汉缃� </a> </li> <li class="weixin"> <a href="javascript:;" style="margin-right:0;" data-pid="weixin" ga_event="login_wechat"> <i class="icon"></i> 寰俊 </a> </li> </ul> </div> </div> </div> <div class="mask {hide: options.hide}"></div>',
function(t) {
    var i = this;
    riot.observable(this),
    this.options = {
        hide: !0,
        errorMsg: "",
        captchaImg: ""
    },
    this.curSpec = {
        successCb: t.successCb ||
        function() {},
        errorCb: t.errorCb ||
        function() {}
    },
    this.hide = function() {
        this.options.hide = !0,
        this.update()
    }.bind(this),
    this.onFormSubmit = function(t) {
        t.preventDefault();
        var i = this,
        e = http.serialize(t.currentTarget);
        user.loginByLoc({
            data: e,
            successCb: function(t) {
                "function" == typeof i.curSpec.successCb && i.curSpec.successCb(t),
                i.hide()
            },
            errorCb: function(t) {
                i.password.value = "",
                t = t || {};
                var e = t.data || {};
                i.options.errorMsg = e.description || "鐧诲綍澶辫触",
                e.captcha ? (i.captcha.value = "", i.options.captchaImg = "data:image/gif;base64," + e.captcha) : (i.captcha.value = "", i.options.captchaImg = ""),
                "function" == typeof i.curSpec.errorCb && i.curSpec.errorCb(t),
                i.update()
            }
        })
    }.bind(this),
    this.onSnsLoginClick = function(t) {
        var i = utils.getTarget(t),
        e = utils.getAttribute(i, "data-pid") || utils.getAttribute(i.parentNode, "data-pid");
        this.hide(),
        user.loginByOther(e, this.curSpec)
    }.bind(this),
    window.on("login",
    function(t) {
        i.options.hide = !1,
        t = t || {},
        i.curSpec = {
            successCb: t.successCb ||
            function() {},
            errorCb: t.errorCb ||
            function() {}
        },
        i.update()
    })
}),
riot.tag("userFeedback", '<div class="feedback_dialog"> <div class="dialog-header"> <h3>鎰忚鍙嶉</h3> </div> <div class="dialog-inner"> <div class="feedback_panel"> <form onsubmit="{onFormSubmit}"> <p class="label">鑱旂郴鏂瑰紡锛堝繀濉級</p> <div class="input-group"> <input class="email" placeholder="鎮ㄧ殑閭/QQ鍙�" type="text" name="feedback-email"> </div> <p class="label">鎮ㄧ殑鎰忚锛堝繀濉級</p> <div class="input-group"> <textarea style="height:100px;" name="feedback-content" class="content" maxlength="140" placeholder="璇峰～鍐欐偍鐨勬剰瑙侊紝涓嶈秴杩�140瀛�"></textarea> </div> <div class="input-group"> <input type="submit" class="{submit-btn:true,disabled:disabled}" value="鎻愪氦" __disabled="{disabled}"> <span class="error">{msg}</span> <a class="close" href="javascript:void(0);" onclick="{hide}">[鍏抽棴]</a> </div> </form> </div> </div> </div>', 'class="userFeedback"',
function() {
    this.message = {
        success: "宸叉彁浜�,鎰熻阿鎮ㄧ殑鎰忚",
        fail: "鎻愪氦閿欒,璇风◢鍚庨噸璇�",
        mail_error: "璇疯緭鍏ユ纭殑鑱旂郴鏂瑰紡",
        content_error: "璇疯緭鍏ユ偍鐨勬剰瑙�",
        content_length_error: "鎰忚闀垮害瓒呭嚭闄愬埗"
    };
    var t = this;
    this.msg = "",
    this.disabled = !1,
    this.showMessage = function(t) {
        this.msg = this.message[t],
        this.update()
    }.bind(this),
    this.hide = function() {
        this.unmount(!0)
    }.bind(this),
    this.onFormSubmit = function() {
        var i = this["feedback-email"],
        e = this["feedback-content"];
        return i.value.length < 5 ? (i.focus(), this.showMessage("mail_error")) : "" === e.value ? (e.focus(), this.showMessage("content_error")) : (this.msg = "", this.disabled = !0, this.update(), void http({
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken")
            },
            url: "/post_message/",
            method: "post",
            data: {
                appkey: "web",
                uuid: i.value,
                content: "[" + window.location.host + "]" + e.value
            },
            success: function(s) {
                return "success" !== s.message ? t.showMessage("fail") : (i.value = "", e.value = "", t.disabled = !1, t.showMessage("success"), void setTimeout(function() {
                    t.hide()
                },
                1e3))
            },
            error: function() {
                t.disabled = !1,
                t.update(),
                t.showMessage("fail")
            }
        }))
    }.bind(this)
}),
riot.tag("toast", '<div name="toast" class="toast-inner" style="opacity: 10; filter:alpha(opacity=1000);"> <span>{opts.msg}</span> </div>', 'class="toast"',
function() {
    var t = this;
    this.on("mount",
    function() {
        var i = this.toast,
        e = i.clientWidth,
        s = i.clientHeight,
        o = new TAnimation;
        i.style.cssText += "margin-top:-" + s / 2 + "px;margin-left:-" + e / 2 + "px",
        o.animate({
            el: i,
            prop: "opacity",
            to: 0,
            transitionDuration: 2e3
        },
        function() {
            t.unmount(!0)
        })
    })
}),
riot.tag("raw", "",
function(t) {
    this.root.innerHTML = t.content
}),
riot.tag("number", '<em class="y-number"><i>{value}</i>{flag}{opts.unit}</em>',
function(t) {
    var i = this,
    e = t.number,
    s = (t.all, t.unit, Math.pow(10, 9)),
    o = Math.pow(10, 8),
    a = Math.pow(10, 7),
    n = Math.pow(10, 5),
    l = Math.pow(10, 4),
    c = Math.pow(10, 3);
    return i.flag = "",
    i.value = "",
    t.all && "true" == t.all ? (i.flag = "", void(i.value = t.number)) : void(e - s >= 0 ? (i.flag = "浜�", i.value = Math.floor(e / o)) : e - o >= 0 ? (i.flag = "浜�", i.value = (Number(Math.floor(e / a) / 10).toFixed(1) + "").replace(/\.0$/, "")) : e - n > 0 ? (i.flag = "涓�", i.value = Math.floor(e / l)) : e - l >= 0 ? (i.flag = "涓�", i.value = (Number(Math.floor(e / c) / 10).toFixed(1) + "").replace(/\.0$/, "")) : i.value = t.number)
}),
riot.tag("yheader", '<a href="{opts.home_url}"><img class="bg-header" riot-src="{bg_img}" alt="澶村儚"></a> <div> <a href="{opts.home_url}" ga_event="user_head_click"><img riot-src="{avtar_img}" alt="浣滆€呭ご鍍�" class="avatar"></a> <ul> <li class="title"> <a href="{opts.home_url}" ga_event="user_head_click"> <span class="name">{opts.name}</span> <span class="y-icon dv" if="{opts.dv}"></span> <span class="tth" if="{opts.pgc_icon}"></span> </a> </li> <li class="des"><a href="{opts.home_url}" ga_event="user_head_click">{abstract}</a></li> </ul> <div if="{!opts.isSelf}" ga_event="user_head_follow" riot-tag="attention" media_id="{opts.media_id}" like="{opts.like}" liked="{opts.liked}" txt="鍏虫敞" activetxt="宸插叧娉�" friendedtxt="浜掔浉鍏虫敞"></div> <span if="{opts.isSelf && opts.ugcUser && opts.supportPublish}" ga_event="user_ugc_publish" class="btn-publish {hangup: hangup}" onclick="{showPublishPop}"> <span class=" y-icon icon-answer_small_wenda"></span> <span>鍙戝竷寰ご鏉�</span> <i>1</i> <b> <span>{popupStatus}</span> </b> </span> </div>', 'class="yheader"',
function(t) {
    function i() {
        var t = document.title,
        i = "瑙嗛杞爜宸插畬鎴愶紝璇锋煡鐪� - 浠婃棩澶存潯(www.toutiao.com)",
        s = !0;
        e.timer = setInterval(function() {
            s ? (document.title = i, s = !1) : (document.title = t, s = !0)
        },
        1e3)
    }
    var e = this,
    s = {
        pending: "鎮ㄦ湁涓€涓繘琛屼腑鐨勪换鍔�",
        done: "瑙嗛杞爜瀹屾垚锛岃鏌ョ湅"
    };
    this.bg_img = t.bg_img,
    this.avtar_img = t.avtar_img,
    this.abstract = t.abstract,
    this.popupStatus = s.pending,
    this.timer = null,
    "2" == t.right_knight_sign_status && (this.abstract += "2" == t.kbanquan_sign_status ? "锛堟湰澶存潯鍙峰凡缁忎笌缁存潈楠戝＋銆佸揩鐗堟潈绛剧害锛�": "锛堟湰澶存潯鍙峰凡缁忎笌缁存潈楠戝＋绛剧害锛�"),
    this.hangup = !1,
    window.on("uploadReady",
    function(t) {
        t.ready === !0 && "video" === t.type && (e.popupStatus = s.done, e.update(), i())
    }),
    this.showPublishPop = function() {
        this.hangup ? window.trigger("uploadShow", {
            type: e.type
        }) : riot.mount("ugcBox", {
            isShowImgTab: t.ugcContentUser
        })
    }.bind(this),
    window.on("uploadHide",
    function(t) {
        e.hangup = !0,
        e.type = t.type,
        e.update()
    }),
    window.on("uploadClose",
    function() {
        e.hangup = !1,
        e.popupStatus = s.pending,
        e.update(),
        clearInterval(e.timer),
        document.title = "浠婃棩澶存潯(www.toutiao.com)"
    });
    var o = utils.getSearchParams("publish");
    o.publish && e.showPublishPop()
}),
riot.tag("tab", '<ul class="tab tab-{opts.idx}" onclick="{click}"> <li each="{item,idx in opts.tabs}" class="{active:idx==parent.opts.idx}" code="{item.code}" idx="{idx}">{item.text}</li> </ul>',
function(t) {
    this.click = function(i) {
        t.click && t.click instanceof Function && t.click.call(this, i)
    }.bind(this)
}),
riot.tag("media", '<ul class="media"> <li each="{item in opts.list}"> <dl class="media-list"> <dd class="avatar-wrap"> <a href="{item.open_url}" target="_blank" ga_event="{parent.opts.ga_event_click}"><img riot-src="{item.url}" alt=""></a> </dd> <dd> <a href="{item.open_url}" target="_blank" ga_event="{parent.opts.ga_event_click}"> <h3>{item.title} <i if="{item.user_verified}" class="y-icon dv"></i><em if="{item.is_pgc}" class="tth"></em></h3> </a> <a href="{item.open_url}" target="_blank" ga_event="{parent.opts.ga_event_click}"> <p>{item.des}</p> </a> <a href="{item.open_url}" target="_blank" ga_event="{parent.opts.ga_event_click}"> <p if="{item.cf_count>0}">鍏卞悓濂藉弸@{item.cf_info}<span if="{item.cf_count>1}">绛墈item.cf_count}浣�</span></p> </a> </dd> <dd class="relation" if="{!item.is_self}"> <div ga_event="user_list_follow" riot-tag="attention" media_id="{item.media_id}" like="{item.is_following}" liked="{item.is_followed}" txt="鍏虫敞" activetxt="宸插叧娉�" friendedtxt="浜掔浉鍏虫敞" from="{parent.opts.from}"></div> </dd> </dl> </li> </ul>',
function() {}),
riot.tag("list", '<ul class="list"> <li id="table"></li> <li if="{empty && !opts.isBanned}" class="empty">{empty_text}</li> <li if="{opts.isBanned}" class="empty ban">璇ュ笎鍙峰凡琚皝绂侊紝鍐呭鏃犳硶鏌ョ湅</li> <li class="cursor" style="height:0;opacity:0"></li> <li if="{loading&&opts.scroll}" class="loading"> 姝ｅ湪鍔犺浇鈥︹€� </li> <li if="{!loading&&noMore}" class="no-more">娌℃湁鏇村浜�</li> </ul>',
function(t) {
    var i = this,
    e = t.scroll,
    s = t.tab,
    o = {
        following: "TA杩樻病鏈夊叧娉ㄤ换浣曚汉",
        followed: "TA杩樻病鏈夌矇涓�",
        recommend: ""
    };
    riot.observable(this),
    i.list = t.list,
    i.loading = !1,
    i.noMore = !1,
    i.is_tab = t.is_tab,
    i.empty = !1,
    i.empty_text = o[_type];
    var a, n, l, c, r = function() {
        a = {
            followed: 0,
            following: 0
        },
        n = {
            following: 20,
            followed: 20
        },
        l = {
            followed: !0,
            following: !0
        },
        c = {
            followed: !1,
            following: !1
        }
    };
    r();
    var h = function(t, e) {
        var s = "following" == t ? "/c/user/following/": "/c/user/followed/";
        i.loading = !0;
        var o = "";
        window.T && (console.log(userInfo.id + "" + a[t]), o = TAC.sign(userInfo.id + "" + a[t])),
        http({
            url: s,
            type: "json",
            data: {
                user_id: userInfo.id,
                cursor: a[t],
                count: n[t],
                _signature: o
            },
            success: function(t) {
                i.loading = !1,
                e && e instanceof Function && e.call(null, t)
            }
        })
    },
    u = function(e) {
        var s;
        e.data && e.data.length ? (s = _.map(e.data,
        function(i) {
            return {
                url: i.avatar_url,
                open_url: i.open_url,
                title: i.name,
                des: i.description,
                media_id: i.user_id,
                is_following: i.is_following,
                is_followed: i.is_followed,
                cf_info: i.cf_info,
                cf_count: i.cf_count,
                is_pgc: i.is_pgc,
                user_verified: i.user_verified,
                is_self: i.user_id === t.userData.id
            }
        }), i.list = i.list.concat(s)) : (i.list = [], i.empty = !0),
        i.noMore = 0 < i.list.length && i.list.length <= 5,
        riot.mount("#table", "media", {
            list: i.list,
            from: "list",
            ga_event_click: "user_list_click"
        }),
        i.update()
    },
    d = function(t, i) {
        var e = t;
        "string" == typeof t && (e = document.querySelector(t));
        var s = e.getBoundingClientRect(),
        o = document.documentElement.clientHeight || document.body.clientHeight;
        if ("top" == i) return s.top > 0 && s.top < o;
        if ("bottom" == i) return s.bottom > 0 && s.bottom < o;
        if ("all" == i) {
            var a = s.top < 0 && s.bottom > o,
            n = s.top > 0 && s.top < o && s.bottom > 0 && s.bottom < o;
            return a || n
        }
    };
    if (window.is_show = d, i.is_tab && window.on("tabChange",
    function(t) {
        s = t,
        r(),
        i.loading = !1,
        i.list.length = 0,
        i.empty = !1,
        i.empty_text = o[s],
        i.update(),
        g(1)
    }), e) {
        var p = window.onscroll,
        g = function(i) {
            if (!t.isBanned && !c[s]) {
                var e = i || d(".cursor", "all");
                e && l[s] && (c[s] = !0, h(s,
                function(t) {
                    c[t.type] = !1,
                    l[t.type] = t.has_more,
                    a[t.type] = t.cursor,
                    u(t)
                }))
            }
        };
        window.onscroll = _.throttle(function() {
            g(),
            p && p instanceof Function && p.call(window)
        },
        100),
        setTimeout(function() {
            g(!0)
        },
        10)
    }
}),
riot.tag("attention", '<span class="btn-attention {following: following, each: each}" onclick="{getInfo}"><em class="text">{text}</em></span>',
function(t) {
    var i = this;
    this.text = t.txt,
    i.media_id = t.media_id;
    var e = t.like;
    this._updateStatus = function(e, s) {
        i.following = e && !s,
        i.each = e && s,
        i.following && (i.text = t.activetxt),
        i.each && (i.text = t.friendedtxt),
        !i.following && !i.each && (i.text = t.txt)
    }.bind(this),
    this._updateStatus(t.like, t.liked),
    this.getInfo = function() {
        var s = e ? "unfollow": "follow",
        o = "/c/user/" + s + "/",
        a = "";
        window.TAC && (a = TAC.sign(i.media_id));
        var n = function() {
            http({
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                },
                url: o,
                method: "get",
                data: {
                    user_id: i.media_id,
                    _signature: a
                },
                success: function(o) {
                    return "success" !== o.message ? void riot.mount("#toast", "toast", {
                        msg: o.message
                    }) : (e = !e, "follow" == s ? (i._updateStatus(!0, t.liked), "list" == t.from && window.trigger("attentionChange", i.media_id, !0)) : (i._updateStatus(!1, t.liked), "list" == t.from && window.trigger("attentionChange", i.media_id, !1)), void i.update())
                }
            })
        };
        user.checkLogin({
            successCb: function() {
                n()
            },
            errorCb: function() {
                window.trigger("login", {
                    successCb: function(t) {
                        window.trigger("userChange", t),
                        n()
                    }
                })
            }
        })
    }.bind(this)
}),
riot.tag("statistics", '<dl class="statistics"> <dt> <a href="{opts.base_url}?tab=following" ga_event="nav_user_list"> <h3 riot-tag="number" number="{opts.guanzhu}"></h3> <p>鍏虫敞</p> </a> </dt> <dd> <a href="{opts.base_url}?tab=followed" ga_event="nav_user_list"> <h3 riot-tag="number" number="{opts.fensi}"></h3> <p>绮変笣</p> </a> </dd> </dl>',
function() {}),
riot.tag("recommend", '<div class="recommend" if="{show}"> <h2>鎺ㄨ崘鍏虫敞</h2> <div riot-tag="rlist" class="rlist"></div> </div>',
function(t) {
    function i() {
        http({
            url: o,
            method: "get",
            data: {
                user_id: s
            },
            success: function(t) {
                "success" == t.message && (e.list = _.map(t.data,
                function(t) {
                    return {
                        url: t.avatar_url,
                        open_url: t.open_url,
                        title: t.name,
                        des: t.description,
                        media_id: t.user_id,
                        is_following: !1,
                        is_followed: !1,
                        user_verified: t.user_verified,
                        is_pgc: t.is_pgc
                    }
                }))
            },
            complete: function() {
                e.show = e.list.length > 0,
                e.update(),
                e.show && riot.mount(".rlist", {
                    list: e.list
                })
            }
        })
    }
    var e = this,
    s = t.user_id,
    o = "/c/user/related/";
    e.show = !1,
    e.list = [],
    i()
}),
riot.tag("rlist", '<div class="list"> <div riot-tag="media" list="{opts.list}" from="recommend" ga_event_click="recommend_user_click"></div> </div>',
function() {}),
riot.tag("top", '<span class="top" onclick="{go}" if="{is_go}" riot-style="left:{left}px"></span>',
function() {
    this.is_go = !1;
    var t = this,
    i = document.querySelector(".right"),
    e = i.getBoundingClientRect();
    e = e.left + e.width + 30,
    t.left = e;
    var s = window.onscroll;
    window.onscroll = _.throttle(function() {
        s && s instanceof Function && s();
        var i = document.body.scrollTop || document.documentElement.scrollTop;
        t.is_go = i > 0 ? !0 : !1,
        t.update()
    },
    100),
    this.go = function() {
        window.scroll(0, 0)
    }.bind(this)
}),
riot.tag("subscribe", '<div class="subscribe" ga_event="follow_pgc"> <div if="{opts.like == true}" class="article-subscribe left-arrow" onclick="{subscribe}"> <i class="y-icon icon-check"></i><span>宸插叧娉�</span> </div> <div if="{opts.like == false}" class="article-unsubscribe left-arrow" onclick="{unsubscribe}"> <i class="y-icon icon-add"></i><span>鍏虫敞</span> </div> </div>',
function(t) {
    this.sendRequest = function(i) {
        var e = this,
        s = t.user_id,
        o = "/c/user/" + i + "/",
        a = function() {
            http({
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                },
                url: o,
                method: "post",
                data: {
                    user_id: s
                },
                success: function(s) {
                    "success" === s.message && (t.like = "follow" == i ? !0 : !1, e.update())
                }
            })
        };
        user.checkLogin({
            successCb: function() {
                a()
            },
            errorCb: function() {
                window.trigger("login", {
                    successCb: function(t) {
                        window.trigger("userChange", t),
                        a()
                    }
                })
            }
        })
    }.bind(this),
    this.subscribe = function() {
        this.sendRequest("unfollow")
    }.bind(this),
    this.unsubscribe = function() {
        this.sendRequest("follow")
    }.bind(this)
}),
Function(function(t) {
    return 'e(e,a,r){(b[e]||(b[e]=t("x,y","x "+e+" y")(r,a)}a(e,a,r){(k[r]||(k[r]=t("x,y","new x[y]("+Array(r+1).join(",x[y]")(1)+")")(e,a)}r(e,a,r){n,t,s={},b=s.d=r?r.d+1:0;for(s["$"+b]=s,t=0;t<b;t)s[n="$"+t]=r[n];for(t=0,b=s=a;t<b;t)s[t]=a[t];c(e,0,s)}c(t,b,k){u(e){v[x]=e}f{g=,ting(bg)}l{try{y=c(t,b,k)}catch(e){h=e,y=l}}for(h,y,d,g,v=[],x=0;;)switch(g=){case 1:u(!)4:f5:u((e){a=0,r=e;{c=a<r;c&&u(e[a]),c}}(6:y=,u((y8:if(g=,lg,g=,y===c)b+=g;else if(y!==l)y9:c10:u(s(11:y=,u(+y)12:for(y=f,d=[],g=0;g<y;g)d[g]=y.charCodeAt(g)^g+y;u(String.fromCharCode.apply(null,d13:y=,h=delete [y]14:59:u((g=)?(y=x,v.slice(x-=g,y:[])61:u([])62:g=,k[0]=65599*k[0]+k[1].charCodeAt(g)>>>065:h=,y=,[y]=h66:u(e(t[b],,67:y=,d=,u((g=).x===c?r(g.y,y,k):g.apply(d,y68:u(e((g=t[b])<"<"?(b--,f):g+g,,70:u(!1)71:n72:+f73:u(parseInt(f,3675:if(){bcase 74:g=<<16>>16g76:u(k[])77:y=,u([y])78:g=,u(a(v,x-=g+1,g79:g=,u(k["$"+g])81:h=,[f]=h82:u([f])83:h=,k[]=h84:!085:void 086:u(v[x-1])88:h=,y=,h,y89:u({e{r(e.y,arguments,k)}e.y=f,e.x=c,e})90:null91:h93:h=0:;default:u((g<<16>>16)-16)}}n=this,t=n.Function,s=Object.keys||(e){a={},r=0;for(c in e)a[r]=c;a=r,a},b={},k={};r'.replace(/[-]/g,
    function(i) {
        return t[15 & i.charCodeAt(0)]
    })
} ("v[x++]=v[--x]t.charCodeAt(b++)-32function return ))++.substrvar .length(),b+=;break;case ;break}".split("")))()('gr$Daten 袠b/s!l y蛼y墓g,(lfi~ah`{mv,-n|jqewVxp{rvmmx,&effkx[!cs"l".Pq%widthl"@q&heightl"vr*getContextx$"2d[!cs#l#,*;?|u.|uc{uq$fontl#vr(fillTextx$$榫樴笐喔犼步2<[#c}l#2q*shadowBlurl#1q-shadowOffsetXl#$$limeq+shadowColorl#vr#arcx88802[%c}l#vr&strokex[ c}l"v,)}eOmyoZB]mx[ cs!0s$l$Pb<k7l l!r&lengthb%^l$1+s$jl  s#i$1ek1s$gr#tack4)zgr#tac$! +0o![#cj?o ]!l$b%s"o ]!l"l$b*b^0d#>>>s!0s%yA0s"l"l!r&lengthb<k+l"^l"1+s"jl  s&l&z0l!$ +["cs\'(0l#i\'1ps9wxb&s() &{s)/s(gr&Stringr,fromCharCodes)0s*yWl ._b&s o!])l l Jb<k$.aj;l .Tb<k$.gj/l .^b<k&i"-4j!+& s+yPo!]+s!l!l Hd>&l!l Bd>&+l!l <d>&+l!l 6d>&+l!l &+ s,y=o!o!]/q"13o!l q"10o!],l 2d>& s.{s-yMo!o!]0q"13o!]*Ld<l 4d#>>>b|s!o!l q"10o!],l!& s/yIo!o!].q"13o!],o!]*Jd<l 6d#>>>b|&o!]+l &+ s0l-l!&l-l!i\'1z141z4b/@d<l"b|&+l-l(l!b^&+l-l&zl\'g,)gk}ejo{cm,)|yn~Lij~em["cl$b%@d<l&zl\'l $ +["cl$b%b|&+l-l%8d<@b|l!b^&+ q$sign ', [TAC = {}]);
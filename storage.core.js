/*pub-1|2013-11-13 14:20:38*/
SNS = window.SNS || {};
SNS.provide = function (a) {
    if (typeof a === "function") {
        a = a()
    }
    for (var b in a) {
        if (this[b] === undefined) {
            this[b] = a[b]
        }
    }
    return this
};
SNS.provide({isFunction: function (a) {
    return Object.prototype.toString.call(a) === "[object Function]"
}, isArray: Array.isArray || function (a) {
    return Object.prototype.toString.call(a) === "[object Array]"
}, isPlainObject: function (a) {
    return a && Object.prototype.toString.call(a) === "[object Object]" && "isPrototypeOf" in a
}, mix: function (c, b, a) {
    if (!b || !c) {
        return c
    }
    for (var d in b) {
        if (SNS.isPlainObject(b[d])) {
            if (a) {
                c[d] = this.mix(c[d] || {}, b[d])
            } else {
                c[d] = b[d]
            }
        } else {
            if (b[d] !== undefined) {
                c[d] = b[d]
            }
        }
    }
    return c
}, each: function (c, d) {
    if (SNS.isArray(c)) {
        for (var b = 0; b < c.length; b++) {
            d.call(c, c[b], b)
        }
    } else {
        for (var a in c) {
            d.call(c, c[a], a)
        }
    }
}, map: function (a, d) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        b[c] = d(a[c])
    }
    return b
}});
if (!window.console) {
    window.console = {};
    window.console.log = function (a) {
    }
}
SNS.provide(function () {
    var b = location.search.indexOf("sns-debug") !== -1;
    var a = {log: function (c) {
        if (b) {
            window.console && console.log(c)
        }
    }, isDebug: function () {
        return b
    }, guid: function () {
        return"sns" + (Math.random() * (1 << 30)).toString(16).replace(".", "")
    }};
    a.extend = function (d, f) {
        var c = Object.create || function (g) {
            function h() {
            }

            h.prototype = g;
            return new h()
        };

        function e() {
            d.apply(this, arguments)
        }

        e.prototype = c(d.prototype);
        SNS.mix(e.prototype, f);
        e.prototype.constructor = e;
        e.superclass = d.prototype;
        e.extend = function (g) {
            return a.extend(this, g)
        };
        return e
    };
    a.buildURI = function () {
        var c = Array.prototype.slice.call(arguments);
        if (c.length < 2) {
            return c[0] || ""
        }
        var d = c.shift();
        d += d.indexOf("?") > 0 ? "&" : "?";
        return d + c.join("&").replace(/&+/g, "&")
    };
    a.addParams = a.buildURI;
    return a
});
SNS.provide(function () {
    var b = location.hostname.indexOf(".daily.") !== -1 || location.protocol == "file:";
    var a = {isDaily: function () {
        return b
    }, domain: {assets: b ? "assets.daily.taobao.net" : "a.tbcdn.cn", server: b ? "daily.taobao.net" : "taobao.com"}, isTBDomain: function () {
        return location.hostname.indexOf(".taobao.") !== -1
    }, normalize: function (c, d) {
        if (a.isDaily()) {
            c = c.replace("a.tbcdn.cn", "assets.daily.taobao.net").replace("taobao.com", "daily.taobao.net")
        } else {
            c = c.replace("assets.daily.taobao.net", "a.tbcdn.cn").replace("daily.taobao.net", "taobao.com")
        }
        if (!d) {
            return c
        } else {
            return SNS.buildURI(c, "t=" + KISSY.now())
        }
    }};
    return a
});
SNS.provide(function () {
    var a = {SM: function () {
        if (!window.UA_Opt || !window.ua) {
            window.ua = "";
            window.UA_Opt = {LogVal: "ua", MaxMCLog: 2, MaxMPLog: 2, MaxKSLog: 2, Token: new Date().getTime() + ":" + Math.random(), SendMethod: 8, Flag: 14222};
            KISSY.getScript("http://acjs.aliyun.com/actionlog/js/ua.js", function () {
                try {
                    UA_Opt.reload()
                } catch (b) {
                }
            }, "GBK")
        }
    }, UA: function () {
        SNS.SM();
        var b = window.ua;
        UA_Opt.Token = new Date().getTime() + ":" + Math.random();
        UA_Opt.reload();
        return b
    }};
    return a
});
SNS.provide(function () {
    var l = SNS;
    var e = location.hostname.indexOf("taobao.net") > -1 ? "http://assets.daily.taobao.net/p" : "http://a.tbcdn.cn/p";
    var m = {base: "", alias: {base: e + "/snsdk", sns: e + "/snsdk/src"}, map: [], load: [], timestamp: Math.floor(new Date().getTime() / 86400000 / 3), skin: true};
    var h = {};
    var j;

    function k(v, t) {
        if (l.isFunction(v)) {
            t = v;
            v = []
        }
        if (!t) {
            return
        }
        var s = b();
        var u = s ? s.src : j;
        var u = u || "";
        h[u] = h[u] || {};
        l.mix(h[u], {url: u, deps: v, factory: t})
    }

    function f(v, w, t) {
        if (l.isFunction(v)) {
            w = v;
            v = []
        } else {
            if (typeof v === "string") {
                v = v.replace(/\s+/g, "");
                v = v.split(",")
            }
        }
        if (!v || v.length == 0) {
            w && w();
            return
        }
        t = t || {url: location.href};
        var u = 0;
        var s = [];
        l.each(v, function (y, x) {
            p(y, function (z) {
                s[x] = z;
                if (++u === v.length) {
                    w && w.apply(undefined, s)
                }
            }, t)
        })
    }

    function p(x, w, v) {
        if (x == null) {
            return w(null)
        }
        for (var u = 0; u < m.load.length; u++) {
            if (m.load[u](x, w, v)) {
                return
            }
        }
        var s = q(x, v && v.url);
        var t = h[s] = h[s] || {url: s};
        if (t.callbacks) {
            if (t.state == "complete") {
                w && w(t.exports)
            } else {
                w && t.callbacks.push(w)
            }
            return
        }
        t.id = x;
        t.callbacks = [w];
        a(s, function () {
            if (h[""]) {
                l.mix(t, h[""]);
                h[""] = null
            }
            t.url = s;
            f(t.deps, function () {
                t.exports = c(t, arguments);
                t.state = "complete";
                l.each(t.callbacks, function (y) {
                    y(t.exports)
                })
            }, t)
        })
    }

    function c(u, t) {
        if (u.url.indexOf(".css") > -1) {
            return
        } else {
            if (l.isFunction(u.factory)) {
                var s = u.factory.apply(u, t);
                if (l.isFunction(s)) {
                    s.prototype.name = u.id.split("/").slice(-1).join("")
                }
                return s
            } else {
                return u.factory
            }
        }
    }

    function q(s, t) {
        t = t || d.base;
        if (s.indexOf("http://") === 0 || s.indexOf("https://") === 0) {
            return s
        }
        l.each(m.alias, function (v, u) {
            if (s == u) {
                s = v
            } else {
                if (s.indexOf(u + "/") == 0) {
                    s = s.replace(u, v)
                }
            }
        });
        l.each(m.map, function (v, u) {
            if (l.isFunction(v)) {
                s = v(s)
            } else {
                if (l.isArray(v)) {
                    s = s.replace(v[0], v[1])
                }
            }
        });
        if (s.indexOf("./") === 0) {
            arr = t.split("/");
            s = arr.slice(0, arr.length - 1).concat(s.slice(2)).join("/")
        }
        if (s.indexOf("../") === 0) {
            arr = t.split("/");
            s = arr.slice(0, arr.length - 2).concat(s.slice(2)).join("/")
        }
        if (s.indexOf("http") != 0) {
            s = m.base + s
        }
        s = s.replace(/([^:\/])\/+/g, "$1/");
        if (s.indexOf(".css") == -1 && s.indexOf("?") == -1 && s.indexOf("#") == -1) {
            s += ".js"
        }
        s += "?t=" + m.timestamp;
        return s
    }

    function a(s, t) {
        j = s;
        g(s, t);
        j = null
    }

    function b() {
        if (document.attachEvent) {
            var s = document.getElementsByTagName("script");
            for (i = s.length - 1; i >= 0; i--) {
                if (s[i].readyState === "interactive") {
                    return s[i]
                }
            }
        }
    }

    var o = document.getElementsByTagName("head")[0];

    function g(t, u) {
        if (t.indexOf(".css") > -1) {
            return n(t, u)
        }
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        if (s.attachEvent) {
            s.attachEvent("onreadystatechange", function () {
                if (s.readyState === "loaded" || s.readyState === "complete") {
                    u && u()
                }
            })
        } else {
            s.addEventListener("load", u, false);
            s.addEventListener("error", u, false)
        }
        s.src = t;
        o.insertBefore(s, o.firstChild);
        return s
    }

    function n(t, v) {
        var s = typeof opera !== "undefined" && opera.toString() === "[object Opera]";
        var u = document.createElement("link");
        u.type = "text/css";
        u.rel = "stylesheet";
        if (u.attachEvent || s) {
            u.onload = u.onerror = v
        } else {
            r(u, v)
        }
        u.href = t;
        o.appendChild(u)
    }

    function r(v, x) {
        if (v.sheet) {
            v._checkCounter = v._checkCounter || 0;
            var w = document.styleSheets;
            for (var u = 0; u < w.length; u++) {
                var t = w[u];
                var s = t.ownerNode ? t.ownerNode : t.owningElement;
                if (s && s == v || v._checkCounter++ > 100) {
                    x();
                    return
                }
            }
        }
        window.setTimeout(r, 10, v, x)
    }

    var d = function (s, v) {
        var u = {};
        if (arguments.length >= 2) {
            u[s] = v
        } else {
            if (l.isPlainObject(s)) {
                u = s
            } else {
                return m[s]
            }
        }
        for (var t in u) {
            if (l.isPlainObject(m[t])) {
                l.mix(m[t], u[t])
            } else {
                if (l.isArray(m[t])) {
                    m[t] = m[t].concat(u[t])
                } else {
                    m[t] = u[t]
                }
            }
        }
    };
    f.resolve = q;
    return{define: k, require: f, modules: h, configs: m, config: d}
});
(function () {
    SNS.config({load: function (a, b) {
        if (a.indexOf("kissy/") !== 0) {
            return
        }
        if (a == "kissy/overlay" && window.KISSY && KISSY.version < "1.2.0") {
            return
        }
        S.use(a.slice(6), function (d, c) {
            b(c)
        });
        return true
    }})
})();
(function () {
    SNS.config({load: function (c, b, a) {
        if (c.indexOf(".css") > -1 && a.skin === null) {
            b();
            return true
        }
    }})
})();
SNS.provide(function () {
    function b(d) {
        var c = this;
        c.__init(d)
    }

    b.extend = function (c) {
        return SNS.extend(b, c)
    };
    SNS.mix(b.prototype, {name: "widget", baseClassName: "sns", configs: {ui: {}, callback: {}}, __init: function (c) {
        this._createWidget(c)
    }, _createWidget: function (c) {
        this._initConfigs(c);
        this._createElement(this.configs.element || this.configs.ui.element);
        this._create();
        this._trigger("create", this.configs);
        this._init();
        this._trigger("init", this.configs);
        this._addConfigListener()
    }, _initConfigs: function (c) {
        var e = SNS.mix({}, b.prototype.configs, true);
        var d = SNS.mix(e, this.configs, true);
        this.configs = SNS.mix(d, c, true)
    }, _setConfigs: function (e) {
        var c = this;
        for (var d in e) {
            c._setConfig(d, e[d])
        }
        return this
    }, _setConfig: function (c, d) {
        this.configs[c] = d;
        return this
    }, _createElement: function (c) {
        if (c && SNS.isFunction(c)) {
            this.element = c()
        } else {
            if (c) {
                this.element = KISSY.DOM.get(c)
            }
        }
        if (this.element) {
            KISSY.DOM.addClass(this.element, "sns-" + this.name);
            KISSY.DOM.addClass(this.element, "sns-widget-ui")
        }
        this.element && (this.element.__sns_widget = this)
    }, _create: function () {
    }, _init: function () {
    }, _addConfigListener: function () {
        var d = this.listeners;
        var e = this, g, j, f, c, h;
        for (var g in d) {
            c = d[g];
            (function (k, l) {
                KISSY.Event.on(e.element, k, function () {
                    l.apply(e, arguments)
                })
            })(g, c)
        }
    }, destroy: function () {
        if (this.element) {
            KISSY.Event.detach(this.element);
            KISSY.DOM.removeData(this.element, "data-" + this.baseClassName);
            KISSY.DOM.removeClass(this.element, this.baseClassName)
        }
        this.hide();
        this._trigger("destroy")
    }, config: function (c, d) {
        var e = c;
        if (arguments.length === 0) {
            return SNS.mix({}, this.configs)
        }
        if (typeof c === "string") {
            if (d === undefined) {
                return this.configs[c]
            }
            e = {};
            e[c] = d
        }
        this._setConfigs(e);
        return this
    }, show: function () {
        if (this.element) {
            this.element.style.display = ""
        }
        this._trigger("show")
    }, hide: function () {
        if (this.element) {
            this.element.style.display = "none"
        }
        this._trigger("hide")
    }, _trigger: function (c, d) {
        var e = this.configs.callback[c];
        SNS.isFunction(e) && e.call(this, d)
    }, $: function (c) {
        return KISSY.all(this.element).all(c)
    }});
    var a = function (d, c) {
        if (SNS.isFunction(d)) {
            SNS.extend(d, c);
            return
        }
        return b.extend(d)
    };
    return{createWidget: a}
});
SNS.provide(function () {
    var a = function (c, e, f) {
        if (c == null) {
            return
        } else {
            if (!(/^sns/.test(c))) {
                c = "sns/widget/" + c
            }
        }
        if (SNS.isFunction(e)) {
            f = e;
            e = {}
        }
        e = SNS.mix({}, e, true);
        e.name = c;
        e.ui = e.ui || {};
        e.callback = e.callback || {};
        var d = e.element || e.ui.element || document.body;
        if (KISSY.DOM.test(d, "iframe") || e.ui.isIframe === true) {
            SNS.require(["sns/core/iframecross"], function (g) {
                g.crossByIframe(d, e, f)
            });
            return true
        }
        if (e.skin === null || e.ui.skin === null) {
            var b = SNS.require.resolve(e.name);
            SNS.modules[b] = SNS.modules[b] || {};
            SNS.modules[b].skin = null
        }
        SNS.require(c, function (g) {
            var h = new g(e);
            f && f(h)
        })
    };
    return{ui: a}
});
SNS.config("logintime", new Date().getTime());
SNS.provide({checkLogin: function (d) {
    if (location.href.indexOf("taobao") == -1) {
        return false
    }
    var e = function (g) {
        var f, c;
        if ((c = String(document.cookie).match(new RegExp("(?:^| )" + g + "(?:(?:=([^;]*))|;|$)")))) {
            f = c[1] ? decodeURIComponent(c[1]) : ""
        }
        return f
    };
    var b;
    if (!d) {
        b = e("_l_g_") && e("_nk_") || e("ck1") && e("tracknick")
    } else {
        b = (e("_l_g_") && e("_nk_") || e("ck1") && e("tracknick")) || e("lgc")
    }
    var a = (new Date().getTime() - SNS.config("logintime")) / (1000 * 60);
    if (a > 30) {
        b = false
    }
    return !!b
}, _getDOMToken: function () {
    var a = document.getElementsByName("_tb_token_")[0];
    if (a && a.value) {
        return a.value
    }
}, _setDOMToken: function (b) {
    var a = document.getElementsByName("_tb_token_");
    if (!a) {
        a = document.createElement("input");
        a.type = "hidden";
        a.name = "_tb_token_";
        document.body.appendChild(a)
    }
    a.value = b
}, fetchToken: function (f, e) {
    var c = "_tb_token_";
    var d = this;
    var b = SNS.config("token") || SNS._getDOMToken();
    if (b && !e) {
        f && f(b);
        return
    }
    if (SNS.isTBDomain() || e) {
        SNS.ajax({_fetchToken: true, url: "http://comment.jianghu.taobao.com/json/token.htm", success: function (g) {
            g = g && g.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
            SNS.config("token", g);
            d._setDOMToken(g);
            f && f(g)
        }})
    } else {
        if (!SNS.isTBDomain() || e) {
            var a;
            if ((location.hostname.indexOf(".daily.") !== -1) || location.protocol == "file:") {
                a = "http://comment.jianghu.daily.taobao.net/json/token.htm"
            } else {
                a = "http://comment.jianghu.taobao.com/json/token.htm"
            }
            SNS.ajax({use: "jsonp", dataType: "jsonp", url: a, data: {_fetchToken: true}, success: function (h) {
                var g = h.token;
                SNS.config("token", g);
                d._setDOMToken(g);
                f && f(g)
            }})
        } else {
            f && f("")
        }
    }
}, login: function (g, f, e) {
    var d = 340, a = 360, c, b;
    if (SNS.checkLogin(e) && !f) {
        g && g();
        return
    }
    if (!SNS.isTBDomain()) {
        b = true
    }
    SNS.ui("login", {logintime: SNS.config("logintime"), force: f || false, ui: {isIframe: b, type: "iframePopup", isIframeShow: false, width: d, height: a}, isLow: e, callback: {check: function (h) {
        if (h.isLogin) {
            g && g()
        } else {
            if (c && c.style) {
                c.style.display = "block"
            }
        }
    }, success: function () {
        g && g()
    }}}, function (h) {
        c = h
    })
}});
SNS.provide(function () {
    var a = {};
    a.goldlog = function (b) {
        new Image().src = "http://gm.mmstat.com/" + b + "?cache=" + new Date().getTime()
    };
    a.storage = function (b, c) {
        if (window.localStorage) {
            if (arguments.length > 1) {
                localStorage.setItem(b, c)
            } else {
                return localStorage.getItem(b)
            }
        } else {
            var f = document.documentElement;
            try {
                if (!f.style.behavior) {
                    f.style.behavior = "url(#default#userData)"
                }
                if (arguments.length > 1) {
                    f.setAttribute(b, c);
                    f.save("sns")
                } else {
                    f.load("sns");
                    return f.getAttribute(b)
                }
            } catch (d) {
            }
        }
    };
    a.removeStorage = function (b) {
        if (window.localStorage) {
            return localStorage.removeItem(b)
        } else {
            var d = document.documentElement;
            try {
                if (!d.style.behavior) {
                    d.style.behavior = "url(#default#userData)"
                }
                d.save("sns", false, -365)
            } catch (c) {
            }
        }
    };
    a.alert = function (e, f, d, b, c) {
        var c = c || {};
        SNS.ui("sns/core/alert", {msg: e, callback: f, autoHide: b, customCls: d, ui: {width: c.width || 900, height: c.height || 400, type: "iframePopup"}, align: c.align || {node: null, points: ["cc", "cc"], offset: [0, 0]}})
    };
    a.confirm = function (d, e, c, b) {
        var b = b || {};
        SNS.ui("sns/core/confirm", {msg: d, callback: e, customCls: c, ui: {width: b.width || 900, height: b.height || 400, type: "iframePopup"}, align: b.align || {node: null, points: ["cc", "cc"], offset: [0, 0]}})
    };
    a.fixHover = function (b, c) {
        if (KISSY.UA.ie <= 6) {
            c = c || "hover";
            KISSY.DOM.query(b).each(function (d) {
                KISSY.Event.on(d, "mouseenter", function () {
                    KISSY.DOM.addClass(d, c)
                });
                KISSY.Event.on(d, "mouseleave", function () {
                    KISSY.DOM.removeClass(d, c)
                })
            })
        }
    };
    SNS.each({api: "sns/core/api", ajax: "sns/core/ajax", get: "sns/core/ajax", post: "sns/core/ajax", overlayAdapt: "sns/core/overlay", placeholder: "placeholder" in document.createElement("input") ? "" : "sns/util/placeholder", maxlength: "maxLength" in document.createElement("textarea") ? "" : "sns/util/maxlength"}, function (c, b) {
        a[b] = function () {
            if (c == "") {
                return
            }
            var d = arguments;
            SNS.require(c, function (e) {
                var f = e[b] || e;
                f.apply(e, d)
            })
        }
    });
    return a
});
SNS.provide(function () {
    var READYTYPE = "sns-widget", WPTYPE = "J_TWidget", CLICKTYPE = "sns-widget-click";

    function initWidgetFun(configs) {
        return function (widget) {
            if (widget) {
                new widget(configs)
            }
        }
    }

    function safeEval(str) {
        var window, top, parent, self, document, location, SNS, KISSY, safeEval, open, XMLHttpRequest, ActiveXObject;
        try {
            return eval(str)
        } catch (e) {
            return{}
        }
    }

    function active(target) {
        if (target._sns_widget_init) {
            return
        }
        target._sns_widget_init = true;
        var attrs = target.attributes;
        for (var j = 0; j < attrs.length; j++) {
            var attrName = attrs[j].name;
            var attrValue = attrs[j].value;
            if (/^data-/.test(attrName)) {
                var configs = attrValue && safeEval("(" + attrValue + ")");
                configs.element = target;
                SNS.ui(attrName.slice(5).replace("-", "/"), configs)
            }
        }
    }

    ready(function () {
        setTimeout(function () {
            var targets = getElementByClassName(READYTYPE);
            for (var i = 0; i < targets.length; i++) {
                active(targets[i])
            }
        })
    });
    function getElementByClassName(clazz) {
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(clazz)
        } else {
            if (document.querySelectorAll) {
                return document.querySelectorAll("." + clazz)
            } else {
                var ret = [];
                var els = document.getElementsByTagName("*");
                for (var i = 0; i < els.length; i++) {
                    if (hasClass(els[i], clazz)) {
                        ret.push(els[i])
                    }
                }
                return ret
            }
        }
    }

    function hasClass(els, clazz) {
        return(" " + els.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + clazz + " ") > -1
    }

    function ready(callback) {
        var isReady = false;
        try {
            KISSY.ready(function () {
                if (isReady) {
                    return
                }
                callback();
                isReady = true
            })
        } catch (e) {
            ready0(function () {
                if (isReady) {
                    return
                }
                callback();
                isReady = true
            })
        }
    }

    function ready0(callback) {
        var doc = document, win = window;
        if (doc.readyState === "complete") {
            callback()
        } else {
            if (doc.addEventListener) {
                doc.addEventListener("DOMContentLoaded", callback, false);
                win.addEventListener("load", callback, false)
            } else {
                function stateChange() {
                    if (doc.readyState === "complete") {
                        callback()
                    }
                }

                doc.attachEvent("onreadystatechange", stateChange);
                win.attachEvent("onload", callback);
                var doScroll = doc.documentElement.doScroll;
                if (doScroll) {
                    function readyScroll() {
                        try {
                            doScroll("left");
                            callback()
                        } catch (ex) {
                            setTimeout(readyScroll, 40)
                        }
                    }

                    readyScroll()
                }
            }
        }
    }

    return{active: active}
});
SNS.provide(function () {
    if (window.KISSY) {
        return
    }
    var b = ["require", "ui", "fixHover"];
    var g = {};
    SNS.each(b, function (h) {
        g[h] = SNS[h];
        SNS[h] = function () {
            var k = this, j = arguments;
            e(function () {
                g[h].apply(k, j)
            })
        }
    });
    var f = "http://a.tbcdn.cn/s/kissy/1.2.0/kissy-min.js";
    var d = null;

    function e(h) {
        if (window.KISSY) {
            c(h);
            return
        }
        if (d != null) {
            d.push(h);
            return
        }
        d = [h];
        setTimeout(function () {
            if (window.KISSY) {
                return c()
            }
            a(f, function () {
                KISSY.Config.base = f.substring(0, f.lastIndexOf("/") + 1);
                c()
            })
        }, 10)
    }

    function c(j) {
        SNS.each(b, function (k) {
            SNS[k] = g[k]
        });
        for (var h = 0; h < d.length; h++) {
            d[h]()
        }
        j && j()
    }

    function a(j, l) {
        var h = document.createElement("script");
        h.type = "text/javascript";
        h.charset = "utf-8";
        h.async = true;
        if (h.attachEvent) {
            h.attachEvent("onreadystatechange", function () {
                if (h.readyState === "loaded" || h.readyState === "complete") {
                    l && l()
                }
            })
        } else {
            h.addEventListener("load", l, false);
            h.addEventListener("error", l, false)
        }
        h.src = j;
        var k = document.getElementsByTagName("head")[0];
        k.insertBefore(h, k.firstChild);
        return h
    }
});
window.console = window.console || (function() {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {}
        ;
        return c;
    }
)();
/*! jQuery v1.11.2 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
            if (!a.document)
                throw new Error("jQuery requires a window with a document");
            return b(a)
        }
        : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    var c = []
        , d = c.slice
        , e = c.concat
        , f = c.push
        , g = c.indexOf
        , h = {}
        , i = h.toString
        , j = h.hasOwnProperty
        , k = {}
        , l = "1.11.2"
        , m = function(a, b) {
        return new m.fn.init(a,b)
    }
        , n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        , o = /^-ms-/
        , p = /-([\da-z])/gi
        , q = function(a, b) {
        return b.toUpperCase()
    };
    m.fn = m.prototype = {
        jquery: l,
        constructor: m,
        selector: "",
        length: 0,
        toArray: function() {
            return d.call(this)
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
        },
        pushStack: function(a) {
            var b = m.merge(this.constructor(), a);
            return b.prevObject = this,
                b.context = this.context,
                b
        },
        each: function(a, b) {
            return m.each(this, a, b)
        },
        map: function(a) {
            return this.pushStack(m.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length
                , c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: f,
        sort: c.sort,
        splice: c.splice
    },
        m.extend = m.fn.extend = function() {
            var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
            for ("boolean" == typeof g && (j = g,
                g = arguments[h] || {},
                h++),
                 "object" == typeof g || m.isFunction(g) || (g = {}),
                 h === i && (g = this,
                     h--); i > h; h++)
                if (null != (e = arguments[h]))
                    for (d in e)
                        a = g[d],
                            c = e[d],
                        g !== c && (j && c && (m.isPlainObject(c) || (b = m.isArray(c))) ? (b ? (b = !1,
                            f = a && m.isArray(a) ? a : []) : f = a && m.isPlainObject(a) ? a : {},
                            g[d] = m.extend(j, f, c)) : void 0 !== c && (g[d] = c));
            return g
        }
        ,
        m.extend({
            expando: "jQuery" + (l + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(a) {
                throw new Error(a)
            },
            noop: function() {},
            isFunction: function(a) {
                return "function" === m.type(a)
            },
            isArray: Array.isArray || function(a) {
                return "array" === m.type(a)
            }
            ,
            isWindow: function(a) {
                return null != a && a == a.window
            },
            isNumeric: function(a) {
                return !m.isArray(a) && a - parseFloat(a) + 1 >= 0
            },
            isEmptyObject: function(a) {
                var b;
                for (b in a)
                    return !1;
                return !0
            },
            isPlainObject: function(a) {
                var b;
                if (!a || "object" !== m.type(a) || a.nodeType || m.isWindow(a))
                    return !1;
                try {
                    if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf"))
                        return !1
                } catch (c) {
                    return !1
                }
                if (k.ownLast)
                    for (b in a)
                        return j.call(a, b);
                for (b in a)
                    ;
                return void 0 === b || j.call(a, b)
            },
            type: function(a) {
                return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
            },
            globalEval: function(b) {
                b && m.trim(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    }
                )(b)
            },
            camelCase: function(a) {
                return a.replace(o, "ms-").replace(p, q)
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
            },
            each: function(a, b, c) {
                var d, e = 0, f = a.length, g = r(a);
                if (c) {
                    if (g) {
                        for (; f > e; e++)
                            if (d = b.apply(a[e], c),
                            d === !1)
                                break
                    } else
                        for (e in a)
                            if (d = b.apply(a[e], c),
                            d === !1)
                                break
                } else if (g) {
                    for (; f > e; e++)
                        if (d = b.call(a[e], e, a[e]),
                        d === !1)
                            break
                } else
                    for (e in a)
                        if (d = b.call(a[e], e, a[e]),
                        d === !1)
                            break;
                return a
            },
            trim: function(a) {
                return null == a ? "" : (a + "").replace(n, "")
            },
            makeArray: function(a, b) {
                var c = b || [];
                return null != a && (r(Object(a)) ? m.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)),
                    c
            },
            inArray: function(a, b, c) {
                var d;
                if (b) {
                    if (g)
                        return g.call(b, a, c);
                    for (d = b.length,
                             c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                        if (c in b && b[c] === a)
                            return c
                }
                return -1
            },
            merge: function(a, b) {
                var c = +b.length
                    , d = 0
                    , e = a.length;
                while (c > d)
                    a[e++] = b[d++];
                if (c !== c)
                    while (void 0 !== b[d])
                        a[e++] = b[d++];
                return a.length = e,
                    a
            },
            grep: function(a, b, c) {
                for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
                    d = !b(a[f], f),
                    d !== h && e.push(a[f]);
                return e
            },
            map: function(a, b, c) {
                var d, f = 0, g = a.length, h = r(a), i = [];
                if (h)
                    for (; g > f; f++)
                        d = b(a[f], f, c),
                        null != d && i.push(d);
                else
                    for (f in a)
                        d = b(a[f], f, c),
                        null != d && i.push(d);
                return e.apply([], i)
            },
            guid: 1,
            proxy: function(a, b) {
                var c, e, f;
                return "string" == typeof b && (f = a[b],
                    b = a,
                    a = f),
                    m.isFunction(a) ? (c = d.call(arguments, 2),
                        e = function() {
                            return a.apply(b || this, c.concat(d.call(arguments)))
                        }
                        ,
                        e.guid = a.guid = a.guid || m.guid++,
                        e) : void 0
            },
            now: function() {
                return +new Date
            },
            support: k
        }),
        m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
            h["[object " + b + "]"] = b.toLowerCase()
        });
    function r(a) {
        var b = a.length
            , c = m.type(a);
        return "function" === c || m.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }
    var s = function(a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date, v = a.document, w = 0, x = 0, y = hb(), z = hb(), A = hb(), B = function(a, b) {
            return a === b && (l = !0),
                0
        }, C = 1 << 31, D = {}.hasOwnProperty, E = [], F = E.pop, G = E.push, H = E.push, I = E.slice, J = function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b)
                    return c;
            return -1
        }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", L = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", N = M.replace("w", "w#"), O = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + L + "*\\]", P = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + O + ")*)|.*)\\)|)", Q = new RegExp(L + "+","g"), R = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$","g"), S = new RegExp("^" + L + "*," + L + "*"), T = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"), U = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]","g"), V = new RegExp(P), W = new RegExp("^" + N + "$"), X = {
            ID: new RegExp("^#(" + M + ")"),
            CLASS: new RegExp("^\\.(" + M + ")"),
            TAG: new RegExp("^(" + M.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + O),
            PSEUDO: new RegExp("^" + P),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)","i"),
            bool: new RegExp("^(?:" + K + ")$","i"),
            needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)","i")
        }, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ab = /[+~]/, bb = /'|\\/g, cb = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)","ig"), db = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, eb = function() {
            m()
        };
        try {
            H.apply(E = I.call(v.childNodes), v.childNodes),
                E[v.childNodes.length].nodeType
        } catch (fb) {
            H = {
                apply: E.length ? function(a, b) {
                        G.apply(a, I.call(b))
                    }
                    : function(a, b) {
                        var c = a.length
                            , d = 0;
                        while (a[c++] = b[d++])
                            ;
                        a.length = c - 1
                    }
            }
        }
        function gb(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w, x;
            if ((b ? b.ownerDocument || b : v) !== n && m(b),
                b = b || n,
                d = d || [],
                k = b.nodeType,
            "string" != typeof a || !a || 1 !== k && 9 !== k && 11 !== k)
                return d;
            if (!e && p) {
                if (11 !== k && (f = _.exec(a)))
                    if (j = f[1]) {
                        if (9 === k) {
                            if (h = b.getElementById(j),
                            !h || !h.parentNode)
                                return d;
                            if (h.id === j)
                                return d.push(h),
                                    d
                        } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j)
                            return d.push(h),
                                d
                    } else {
                        if (f[2])
                            return H.apply(d, b.getElementsByTagName(a)),
                                d;
                        if ((j = f[3]) && c.getElementsByClassName)
                            return H.apply(d, b.getElementsByClassName(j)),
                                d
                    }
                if (c.qsa && (!q || !q.test(a))) {
                    if (s = r = u,
                        w = b,
                        x = 1 !== k && a,
                    1 === k && "object" !== b.nodeName.toLowerCase()) {
                        o = g(a),
                            (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s),
                            s = "[id='" + s + "'] ",
                            l = o.length;
                        while (l--)
                            o[l] = s + rb(o[l]);
                        w = ab.test(a) && pb(b.parentNode) || b,
                            x = o.join(",")
                    }
                    if (x)
                        try {
                            return H.apply(d, w.querySelectorAll(x)),
                                d
                        } catch (y) {} finally {
                            r || b.removeAttribute("id")
                        }
                }
            }
            return i(a.replace(R, "$1"), b, d, e)
        }
        function hb() {
            var a = [];
            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()],
                    b[c + " "] = e
            }
            return b
        }
        function ib(a) {
            return a[u] = !0,
                a
        }
        function jb(a) {
            var b = n.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b),
                    b = null
            }
        }
        function kb(a, b) {
            var c = a.split("|")
                , e = a.length;
            while (e--)
                d.attrHandle[c[e]] = b
        }
        function lb(a, b) {
            var c = b && a
                , d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C);
            if (d)
                return d;
            if (c)
                while (c = c.nextSibling)
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function mb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }
        function nb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function ob(a) {
            return ib(function(b) {
                return b = +b,
                    ib(function(c, d) {
                        var e, f = a([], c.length, b), g = f.length;
                        while (g--)
                            c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    })
            })
        }
        function pb(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        c = gb.support = {},
            f = gb.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return b ? "HTML" !== b.nodeName : !1
            }
            ,
            m = gb.setDocument = function(a) {
                var b, e, g = a ? a.ownerDocument || a : v;
                return g !== n && 9 === g.nodeType && g.documentElement ? (n = g,
                    o = g.documentElement,
                    e = g.defaultView,
                e && e !== e.top && (e.addEventListener ? e.addEventListener("unload", eb, !1) : e.attachEvent && e.attachEvent("onunload", eb)),
                    p = !f(g),
                    c.attributes = jb(function(a) {
                        return a.className = "i",
                            !a.getAttribute("className")
                    }),
                    c.getElementsByTagName = jb(function(a) {
                        return a.appendChild(g.createComment("")),
                            !a.getElementsByTagName("*").length
                    }),
                    c.getElementsByClassName = $.test(g.getElementsByClassName),
                    c.getById = jb(function(a) {
                        return o.appendChild(a).id = u,
                        !g.getElementsByName || !g.getElementsByName(u).length
                    }),
                    c.getById ? (d.find.ID = function(a, b) {
                            if ("undefined" != typeof b.getElementById && p) {
                                var c = b.getElementById(a);
                                return c && c.parentNode ? [c] : []
                            }
                        }
                            ,
                            d.filter.ID = function(a) {
                                var b = a.replace(cb, db);
                                return function(a) {
                                    return a.getAttribute("id") === b
                                }
                            }
                    ) : (delete d.find.ID,
                            d.filter.ID = function(a) {
                                var b = a.replace(cb, db);
                                return function(a) {
                                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                                    return c && c.value === b
                                }
                            }
                    ),
                    d.find.TAG = c.getElementsByTagName ? function(a, b) {
                            return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
                        }
                        : function(a, b) {
                            var c, d = [], e = 0, f = b.getElementsByTagName(a);
                            if ("*" === a) {
                                while (c = f[e++])
                                    1 === c.nodeType && d.push(c);
                                return d
                            }
                            return f
                        }
                    ,
                    d.find.CLASS = c.getElementsByClassName && function(a, b) {
                        return p ? b.getElementsByClassName(a) : void 0
                    }
                    ,
                    r = [],
                    q = [],
                (c.qsa = $.test(g.querySelectorAll)) && (jb(function(a) {
                    o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\f]' msallowcapture=''><option selected=''></option></select>",
                    a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"),
                    a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"),
                    a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="),
                    a.querySelectorAll(":checked").length || q.push(":checked"),
                    a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
                }),
                    jb(function(a) {
                        var b = g.createElement("input");
                        b.setAttribute("type", "hidden"),
                            a.appendChild(b).setAttribute("name", "D"),
                        a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="),
                        a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"),
                            a.querySelectorAll("*,:x"),
                            q.push(",.*:")
                    })),
                (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && jb(function(a) {
                    c.disconnectedMatch = s.call(a, "div"),
                        s.call(a, "[s!='']:x"),
                        r.push("!=", P)
                }),
                    q = q.length && new RegExp(q.join("|")),
                    r = r.length && new RegExp(r.join("|")),
                    b = $.test(o.compareDocumentPosition),
                    t = b || $.test(o.contains) ? function(a, b) {
                            var c = 9 === a.nodeType ? a.documentElement : a
                                , d = b && b.parentNode;
                            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                        }
                        : function(a, b) {
                            if (b)
                                while (b = b.parentNode)
                                    if (b === a)
                                        return !0;
                            return !1
                        }
                    ,
                    B = b ? function(a, b) {
                            if (a === b)
                                return l = !0,
                                    0;
                            var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
                                1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === g || a.ownerDocument === v && t(v, a) ? -1 : b === g || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1)
                        }
                        : function(a, b) {
                            if (a === b)
                                return l = !0,
                                    0;
                            var c, d = 0, e = a.parentNode, f = b.parentNode, h = [a], i = [b];
                            if (!e || !f)
                                return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0;
                            if (e === f)
                                return lb(a, b);
                            c = a;
                            while (c = c.parentNode)
                                h.unshift(c);
                            c = b;
                            while (c = c.parentNode)
                                i.unshift(c);
                            while (h[d] === i[d])
                                d++;
                            return d ? lb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
                        }
                    ,
                    g) : n
            }
            ,
            gb.matches = function(a, b) {
                return gb(a, null, null, b)
            }
            ,
            gb.matchesSelector = function(a, b) {
                if ((a.ownerDocument || a) !== n && m(a),
                    b = b.replace(U, "='$1']"),
                    !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b)))
                    try {
                        var d = s.call(a, b);
                        if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                            return d
                    } catch (e) {}
                return gb(b, n, null, [a]).length > 0
            }
            ,
            gb.contains = function(a, b) {
                return (a.ownerDocument || a) !== n && m(a),
                    t(a, b)
            }
            ,
            gb.attr = function(a, b) {
                (a.ownerDocument || a) !== n && m(a);
                var e = d.attrHandle[b.toLowerCase()]
                    , f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
                return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
            }
            ,
            gb.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            }
            ,
            gb.uniqueSort = function(a) {
                var b, d = [], e = 0, f = 0;
                if (l = !c.detectDuplicates,
                    k = !c.sortStable && a.slice(0),
                    a.sort(B),
                    l) {
                    while (b = a[f++])
                        b === a[f] && (e = d.push(f));
                    while (e--)
                        a.splice(d[e], 1)
                }
                return k = null,
                    a
            }
            ,
            e = gb.getText = function(a) {
                var b, c = "", d = 0, f = a.nodeType;
                if (f) {
                    if (1 === f || 9 === f || 11 === f) {
                        if ("string" == typeof a.textContent)
                            return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling)
                            c += e(a)
                    } else if (3 === f || 4 === f)
                        return a.nodeValue
                } else
                    while (b = a[d++])
                        c += e(b);
                return c
            }
            ,
            d = gb.selectors = {
                cacheLength: 50,
                createPseudo: ib,
                match: X,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(a) {
                        return a[1] = a[1].replace(cb, db),
                            a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db),
                        "~=" === a[2] && (a[3] = " " + a[3] + " "),
                            a.slice(0, 4)
                    },
                    CHILD: function(a) {
                        return a[1] = a[1].toLowerCase(),
                            "nth" === a[1].slice(0, 3) ? (a[3] || gb.error(a[0]),
                                a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                                a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && gb.error(a[0]),
                            a
                    },
                    PSEUDO: function(a) {
                        var b, c = !a[6] && a[2];
                        return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
                            a[2] = c.slice(0, b)),
                            a.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(a) {
                        var b = a.replace(cb, db).toLowerCase();
                        return "*" === a ? function() {
                                return !0
                            }
                            : function(a) {
                                return a.nodeName && a.nodeName.toLowerCase() === b
                            }
                    },
                    CLASS: function(a) {
                        var b = y[a + " "];
                        return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function(a) {
                            return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(a, b, c) {
                        return function(d) {
                            var e = gb.attr(d, a);
                            return null == e ? "!=" === b : b ? (e += "",
                                "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(Q, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                        }
                    },
                    CHILD: function(a, b, c, d, e) {
                        var f = "nth" !== a.slice(0, 3)
                            , g = "last" !== a.slice(-4)
                            , h = "of-type" === b;
                        return 1 === d && 0 === e ? function(a) {
                                return !!a.parentNode
                            }
                            : function(b, c, i) {
                                var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                                if (q) {
                                    if (f) {
                                        while (p) {
                                            l = b;
                                            while (l = l[p])
                                                if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
                                                    return !1;
                                            o = p = "only" === a && !o && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (o = [g ? q.firstChild : q.lastChild],
                                    g && s) {
                                        k = q[u] || (q[u] = {}),
                                            j = k[a] || [],
                                            n = j[0] === w && j[1],
                                            m = j[0] === w && j[2],
                                            l = n && q.childNodes[n];
                                        while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                            if (1 === l.nodeType && ++m && l === b) {
                                                k[a] = [w, n, m];
                                                break
                                            }
                                    } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w)
                                        m = j[1];
                                    else
                                        while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                            if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]),
                                            l === b))
                                                break;
                                    return m -= e,
                                    m === d || m % d === 0 && m / d >= 0
                                }
                            }
                    },
                    PSEUDO: function(a, b) {
                        var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || gb.error("unsupported pseudo: " + a);
                        return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b],
                                d.setFilters.hasOwnProperty(a.toLowerCase()) ? ib(function(a, c) {
                                    var d, f = e(a, b), g = f.length;
                                    while (g--)
                                        d = J(a, f[g]),
                                            a[d] = !(c[d] = f[g])
                                }) : function(a) {
                                    return e(a, 0, c)
                                }
                        ) : e
                    }
                },
                pseudos: {
                    not: ib(function(a) {
                        var b = []
                            , c = []
                            , d = h(a.replace(R, "$1"));
                        return d[u] ? ib(function(a, b, c, e) {
                            var f, g = d(a, null, e, []), h = a.length;
                            while (h--)
                                (f = g[h]) && (a[h] = !(b[h] = f))
                        }) : function(a, e, f) {
                            return b[0] = a,
                                d(b, null, f, c),
                                b[0] = null,
                                !c.pop()
                        }
                    }),
                    has: ib(function(a) {
                        return function(b) {
                            return gb(a, b).length > 0
                        }
                    }),
                    contains: ib(function(a) {
                        return a = a.replace(cb, db),
                            function(b) {
                                return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                            }
                    }),
                    lang: ib(function(a) {
                        return W.test(a || "") || gb.error("unsupported lang: " + a),
                            a = a.replace(cb, db).toLowerCase(),
                            function(b) {
                                var c;
                                do
                                    if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                                        return c = c.toLowerCase(),
                                        c === a || 0 === c.indexOf(a + "-");
                                while ((b = b.parentNode) && 1 === b.nodeType);
                                return !1
                            }
                    }),
                    target: function(b) {
                        var c = a.location && a.location.hash;
                        return c && c.slice(1) === b.id
                    },
                    root: function(a) {
                        return a === o
                    },
                    focus: function(a) {
                        return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                    },
                    enabled: function(a) {
                        return a.disabled === !1
                    },
                    disabled: function(a) {
                        return a.disabled === !0
                    },
                    checked: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && !!a.checked || "option" === b && !!a.selected
                    },
                    selected: function(a) {
                        return a.parentNode && a.parentNode.selectedIndex,
                        a.selected === !0
                    },
                    empty: function(a) {
                        for (a = a.firstChild; a; a = a.nextSibling)
                            if (a.nodeType < 6)
                                return !1;
                        return !0
                    },
                    parent: function(a) {
                        return !d.pseudos.empty(a)
                    },
                    header: function(a) {
                        return Z.test(a.nodeName)
                    },
                    input: function(a) {
                        return Y.test(a.nodeName)
                    },
                    button: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && "button" === a.type || "button" === b
                    },
                    text: function(a) {
                        var b;
                        return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                    },
                    first: ob(function() {
                        return [0]
                    }),
                    last: ob(function(a, b) {
                        return [b - 1]
                    }),
                    eq: ob(function(a, b, c) {
                        return [0 > c ? c + b : c]
                    }),
                    even: ob(function(a, b) {
                        for (var c = 0; b > c; c += 2)
                            a.push(c);
                        return a
                    }),
                    odd: ob(function(a, b) {
                        for (var c = 1; b > c; c += 2)
                            a.push(c);
                        return a
                    }),
                    lt: ob(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; --d >= 0; )
                            a.push(d);
                        return a
                    }),
                    gt: ob(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; ++d < b; )
                            a.push(d);
                        return a
                    })
                }
            },
            d.pseudos.nth = d.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            d.pseudos[b] = mb(b);
        for (b in {
            submit: !0,
            reset: !0
        })
            d.pseudos[b] = nb(b);
        function qb() {}
        qb.prototype = d.filters = d.pseudos,
            d.setFilters = new qb,
            g = gb.tokenize = function(a, b) {
                var c, e, f, g, h, i, j, k = z[a + " "];
                if (k)
                    return b ? 0 : k.slice(0);
                h = a,
                    i = [],
                    j = d.preFilter;
                while (h) {
                    (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h),
                        i.push(f = [])),
                        c = !1,
                    (e = T.exec(h)) && (c = e.shift(),
                        f.push({
                            value: c,
                            type: e[0].replace(R, " ")
                        }),
                        h = h.slice(c.length));
                    for (g in d.filter)
                        !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(),
                            f.push({
                                value: c,
                                type: g,
                                matches: e
                            }),
                            h = h.slice(c.length));
                    if (!c)
                        break
                }
                return b ? h.length : h ? gb.error(a) : z(a, i).slice(0)
            }
        ;
        function rb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++)
                d += a[b].value;
            return d
        }
        function sb(a, b, c) {
            var d = b.dir
                , e = c && "parentNode" === d
                , f = x++;
            return b.first ? function(b, c, f) {
                    while (b = b[d])
                        if (1 === b.nodeType || e)
                            return a(b, c, f)
                }
                : function(b, c, g) {
                    var h, i, j = [w, f];
                    if (g) {
                        while (b = b[d])
                            if ((1 === b.nodeType || e) && a(b, c, g))
                                return !0
                    } else
                        while (b = b[d])
                            if (1 === b.nodeType || e) {
                                if (i = b[u] || (b[u] = {}),
                                (h = i[d]) && h[0] === w && h[1] === f)
                                    return j[2] = h[2];
                                if (i[d] = j,
                                    j[2] = a(b, c, g))
                                    return !0
                            }
                }
        }
        function tb(a) {
            return a.length > 1 ? function(b, c, d) {
                    var e = a.length;
                    while (e--)
                        if (!a[e](b, c, d))
                            return !1;
                    return !0
                }
                : a[0]
        }
        function ub(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++)
                gb(a, b[d], c);
            return c
        }
        function vb(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
                (f = a[h]) && (!c || c(f, d, e)) && (g.push(f),
                j && b.push(h));
            return g
        }
        function wb(a, b, c, d, e, f) {
            return d && !d[u] && (d = wb(d)),
            e && !e[u] && (e = wb(e, f)),
                ib(function(f, g, h, i) {
                    var j, k, l, m = [], n = [], o = g.length, p = f || ub(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : vb(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                    if (c && c(q, r, h, i),
                        d) {
                        j = vb(r, n),
                            d(j, [], h, i),
                            k = j.length;
                        while (k--)
                            (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                    }
                    if (f) {
                        if (e || a) {
                            if (e) {
                                j = [],
                                    k = r.length;
                                while (k--)
                                    (l = r[k]) && j.push(q[k] = l);
                                e(null, r = [], j, i)
                            }
                            k = r.length;
                            while (k--)
                                (l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                        }
                    } else
                        r = vb(r === g ? r.splice(o, r.length) : r),
                            e ? e(null, g, r, i) : H.apply(g, r)
                })
        }
        function xb(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = sb(function(a) {
                return a === b
            }, h, !0), l = sb(function(a) {
                return J(b, a) > -1
            }, h, !0), m = [function(a, c, d) {
                var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                return b = null,
                    e
            }
            ]; f > i; i++)
                if (c = d.relative[a[i].type])
                    m = [sb(tb(m), c)];
                else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches),
                        c[u]) {
                        for (e = ++i; f > e; e++)
                            if (d.relative[a[e].type])
                                break;
                        return wb(i > 1 && tb(m), i > 1 && rb(a.slice(0, i - 1).concat({
                            value: " " === a[i - 2].type ? "*" : ""
                        })).replace(R, "$1"), c, e > i && xb(a.slice(i, e)), f > e && xb(a = a.slice(e)), f > e && rb(a))
                    }
                    m.push(c)
                }
            return tb(m)
        }
        function yb(a, b) {
            var c = b.length > 0
                , e = a.length > 0
                , f = function(f, g, h, i, k) {
                var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || .1, x = u.length;
                for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                    if (e && l) {
                        m = 0;
                        while (o = a[m++])
                            if (o(l, g, h)) {
                                i.push(l);
                                break
                            }
                        k && (w = v)
                    }
                    c && ((l = !o && l) && p--,
                    f && r.push(l))
                }
                if (p += q,
                c && q !== p) {
                    m = 0;
                    while (o = b[m++])
                        o(r, s, g, h);
                    if (f) {
                        if (p > 0)
                            while (q--)
                                r[q] || s[q] || (s[q] = F.call(i));
                        s = vb(s)
                    }
                    H.apply(i, s),
                    k && !f && s.length > 0 && p + b.length > 1 && gb.uniqueSort(i)
                }
                return k && (w = v,
                    j = t),
                    r
            };
            return c ? ib(f) : f
        }
        return h = gb.compile = function(a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)),
                    c = b.length;
                while (c--)
                    f = xb(b[c]),
                        f[u] ? d.push(f) : e.push(f);
                f = A(a, yb(e, d)),
                    f.selector = a
            }
            return f
        }
            ,
            i = gb.select = function(a, b, e, f) {
                var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a);
                if (e = e || [],
                1 === o.length) {
                    if (j = o[0] = o[0].slice(0),
                    j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                        if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0],
                            !b)
                            return e;
                        n && (b = b.parentNode),
                            a = a.slice(j.shift().value.length)
                    }
                    i = X.needsContext.test(a) ? 0 : j.length;
                    while (i--) {
                        if (k = j[i],
                            d.relative[l = k.type])
                            break;
                        if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && pb(b.parentNode) || b))) {
                            if (j.splice(i, 1),
                                a = f.length && rb(j),
                                !a)
                                return H.apply(e, f),
                                    e;
                            break
                        }
                    }
                }
                return (n || h(a, o))(f, b, !p, e, ab.test(a) && pb(b.parentNode) || b),
                    e
            }
            ,
            c.sortStable = u.split("").sort(B).join("") === u,
            c.detectDuplicates = !!l,
            m(),
            c.sortDetached = jb(function(a) {
                return 1 & a.compareDocumentPosition(n.createElement("div"))
            }),
        jb(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || kb("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }),
        c.attributes && jb(function(a) {
            return a.innerHTML = "<input/>",
                a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || kb("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }),
        jb(function(a) {
            return null == a.getAttribute("disabled")
        }) || kb(K, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
            gb
    }(a);
    m.find = s,
        m.expr = s.selectors,
        m.expr[":"] = m.expr.pseudos,
        m.unique = s.uniqueSort,
        m.text = s.getText,
        m.isXMLDoc = s.isXML,
        m.contains = s.contains;
    var t = m.expr.match.needsContext
        , u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
        , v = /^.[^:#\[\.,]*$/;
    function w(a, b, c) {
        if (m.isFunction(b))
            return m.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
        if (b.nodeType)
            return m.grep(a, function(a) {
                return a === b !== c
            });
        if ("string" == typeof b) {
            if (v.test(b))
                return m.filter(b, a, c);
            b = m.filter(b, a)
        }
        return m.grep(a, function(a) {
            return m.inArray(a, b) >= 0 !== c
        })
    }
    m.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"),
            1 === b.length && 1 === d.nodeType ? m.find.matchesSelector(d, a) ? [d] : [] : m.find.matches(a, m.grep(b, function(a) {
                return 1 === a.nodeType
            }))
    }
        ,
        m.fn.extend({
            find: function(a) {
                var b, c = [], d = this, e = d.length;
                if ("string" != typeof a)
                    return this.pushStack(m(a).filter(function() {
                        for (b = 0; e > b; b++)
                            if (m.contains(d[b], this))
                                return !0
                    }));
                for (b = 0; e > b; b++)
                    m.find(a, d[b], c);
                return c = this.pushStack(e > 1 ? m.unique(c) : c),
                    c.selector = this.selector ? this.selector + " " + a : a,
                    c
            },
            filter: function(a) {
                return this.pushStack(w(this, a || [], !1))
            },
            not: function(a) {
                return this.pushStack(w(this, a || [], !0))
            },
            is: function(a) {
                return !!w(this, "string" == typeof a && t.test(a) ? m(a) : a || [], !1).length
            }
        });
    var x, y = a.document, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = m.fn.init = function(a, b) {
            var c, d;
            if (!a)
                return this;
            if ("string" == typeof a) {
                if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : z.exec(a),
                !c || !c[1] && b)
                    return !b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof m ? b[0] : b,
                        m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)),
                    u.test(c[1]) && m.isPlainObject(b))
                        for (c in b)
                            m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                if (d = y.getElementById(c[2]),
                d && d.parentNode) {
                    if (d.id !== c[2])
                        return x.find(a);
                    this.length = 1,
                        this[0] = d
                }
                return this.context = y,
                    this.selector = a,
                    this
            }
            return a.nodeType ? (this.context = this[0] = a,
                this.length = 1,
                this) : m.isFunction(a) ? "undefined" != typeof x.ready ? x.ready(a) : a(m) : (void 0 !== a.selector && (this.selector = a.selector,
                this.context = a.context),
                m.makeArray(a, this))
        }
    ;
    A.prototype = m.fn,
        x = m(y);
    var B = /^(?:parents|prev(?:Until|All))/
        , C = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    m.extend({
        dir: function(a, b, c) {
            var d = []
                , e = a[b];
            while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c)))
                1 === e.nodeType && d.push(e),
                    e = e[b];
            return d
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling)
                1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    }),
        m.fn.extend({
            has: function(a) {
                var b, c = m(a, this), d = c.length;
                return this.filter(function() {
                    for (b = 0; d > b; b++)
                        if (m.contains(this, c[b]))
                            return !0
                })
            },
            closest: function(a, b) {
                for (var c, d = 0, e = this.length, f = [], g = t.test(a) || "string" != typeof a ? m(a, b || this.context) : 0; e > d; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))) {
                            f.push(c);
                            break
                        }
                return this.pushStack(f.length > 1 ? m.unique(f) : f)
            },
            index: function(a) {
                return a ? "string" == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(a, b) {
                return this.pushStack(m.unique(m.merge(this.get(), m(a, b))))
            },
            addBack: function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }
        });
    function D(a, b) {
        do
            a = a[b];
        while (a && 1 !== a.nodeType);
        return a
    }
    m.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return m.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return m.dir(a, "parentNode", c)
        },
        next: function(a) {
            return D(a, "nextSibling")
        },
        prev: function(a) {
            return D(a, "previousSibling")
        },
        nextAll: function(a) {
            return m.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return m.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return m.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return m.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return m.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return m.sibling(a.firstChild)
        },
        contents: function(a) {
            return m.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : m.merge([], a.childNodes)
        }
    }, function(a, b) {
        m.fn[a] = function(c, d) {
            var e = m.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c),
            d && "string" == typeof d && (e = m.filter(d, e)),
            this.length > 1 && (C[a] || (e = m.unique(e)),
            B.test(a) && (e = e.reverse())),
                this.pushStack(e)
        }
    });
    var E = /\S+/g
        , F = {};
    function G(a) {
        var b = F[a] = {};
        return m.each(a.match(E) || [], function(a, c) {
            b[c] = !0
        }),
            b
    }
    m.Callbacks = function(a) {
        a = "string" == typeof a ? F[a] || G(a) : m.extend({}, a);
        var b, c, d, e, f, g, h = [], i = !a.once && [], j = function(l) {
            for (c = a.memory && l,
                     d = !0,
                     f = g || 0,
                     g = 0,
                     e = h.length,
                     b = !0; h && e > f; f++)
                if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break
                }
            b = !1,
            h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
        }, k = {
            add: function() {
                if (h) {
                    var d = h.length;
                    !function f(b) {
                        m.each(b, function(b, c) {
                            var d = m.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                        })
                    }(arguments),
                        b ? e = h.length : c && (g = d,
                            j(c))
                }
                return this
            },
            remove: function() {
                return h && m.each(arguments, function(a, c) {
                    var d;
                    while ((d = m.inArray(c, h, d)) > -1)
                        h.splice(d, 1),
                        b && (e >= d && e--,
                        f >= d && f--)
                }),
                    this
            },
            has: function(a) {
                return a ? m.inArray(a, h) > -1 : !(!h || !h.length)
            },
            empty: function() {
                return h = [],
                    e = 0,
                    this
            },
            disable: function() {
                return h = i = c = void 0,
                    this
            },
            disabled: function() {
                return !h
            },
            lock: function() {
                return i = void 0,
                c || k.disable(),
                    this
            },
            locked: function() {
                return !i
            },
            fireWith: function(a, c) {
                return !h || d && !i || (c = c || [],
                    c = [a, c.slice ? c.slice() : c],
                    b ? i.push(c) : j(c)),
                    this
            },
            fire: function() {
                return k.fireWith(this, arguments),
                    this
            },
            fired: function() {
                return !!d
            }
        };
        return k
    }
        ,
        m.extend({
            Deferred: function(a) {
                var b = [["resolve", "done", m.Callbacks("once memory"), "resolved"], ["reject", "fail", m.Callbacks("once memory"), "rejected"], ["notify", "progress", m.Callbacks("memory")]]
                    , c = "pending"
                    , d = {
                    state: function() {
                        return c
                    },
                    always: function() {
                        return e.done(arguments).fail(arguments),
                            this
                    },
                    then: function() {
                        var a = arguments;
                        return m.Deferred(function(c) {
                            m.each(b, function(b, f) {
                                var g = m.isFunction(a[b]) && a[b];
                                e[f[1]](function() {
                                    var a = g && g.apply(this, arguments);
                                    a && m.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                })
                            }),
                                a = null
                        }).promise()
                    },
                    promise: function(a) {
                        return null != a ? m.extend(a, d) : d
                    }
                }
                    , e = {};
                return d.pipe = d.then,
                    m.each(b, function(a, f) {
                        var g = f[2]
                            , h = f[3];
                        d[f[1]] = g.add,
                        h && g.add(function() {
                            c = h
                        }, b[1 ^ a][2].disable, b[2][2].lock),
                            e[f[0]] = function() {
                                return e[f[0] + "With"](this === e ? d : this, arguments),
                                    this
                            }
                            ,
                            e[f[0] + "With"] = g.fireWith
                    }),
                    d.promise(e),
                a && a.call(e, e),
                    e
            },
            when: function(a) {
                var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && m.isFunction(a.promise) ? e : 0, g = 1 === f ? a : m.Deferred(), h = function(a, b, c) {
                    return function(e) {
                        b[a] = this,
                            c[a] = arguments.length > 1 ? d.call(arguments) : e,
                            c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                    }
                }, i, j, k;
                if (e > 1)
                    for (i = new Array(e),
                             j = new Array(e),
                             k = new Array(e); e > b; b++)
                        c[b] && m.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
                return f || g.resolveWith(k, c),
                    g.promise()
            }
        });
    var H;
    m.fn.ready = function(a) {
        return m.ready.promise().done(a),
            this
    }
        ,
        m.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? m.readyWait++ : m.ready(!0)
            },
            ready: function(a) {
                if (a === !0 ? !--m.readyWait : !m.isReady) {
                    if (!y.body)
                        return setTimeout(m.ready);
                    m.isReady = !0,
                    a !== !0 && --m.readyWait > 0 || (H.resolveWith(y, [m]),
                    m.fn.triggerHandler && (m(y).triggerHandler("ready"),
                        m(y).off("ready")))
                }
            }
        });
    function I() {
        y.addEventListener ? (y.removeEventListener("DOMContentLoaded", J, !1),
            a.removeEventListener("load", J, !1)) : (y.detachEvent("onreadystatechange", J),
            a.detachEvent("onload", J))
    }
    function J() {
        (y.addEventListener || "load" === event.type || "complete" === y.readyState) && (I(),
            m.ready())
    }
    m.ready.promise = function(b) {
        if (!H)
            if (H = m.Deferred(),
            "complete" === y.readyState)
                setTimeout(m.ready);
            else if (y.addEventListener)
                y.addEventListener("DOMContentLoaded", J, !1),
                    a.addEventListener("load", J, !1);
            else {
                y.attachEvent("onreadystatechange", J),
                    a.attachEvent("onload", J);
                var c = !1;
                try {
                    c = null == a.frameElement && y.documentElement
                } catch (d) {}
                c && c.doScroll && !function e() {
                    if (!m.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (a) {
                            return setTimeout(e, 50)
                        }
                        I(),
                            m.ready()
                    }
                }()
            }
        return H.promise(b)
    }
    ;
    var K = "undefined", L;
    for (L in m(k))
        break;
    k.ownLast = "0" !== L,
        k.inlineBlockNeedsLayout = !1,
        m(function() {
            var a, b, c, d;
            c = y.getElementsByTagName("body")[0],
            c && c.style && (b = y.createElement("div"),
                d = y.createElement("div"),
                d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                c.appendChild(d).appendChild(b),
            typeof b.style.zoom !== K && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
                k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth,
            a && (c.style.zoom = 1)),
                c.removeChild(d))
        }),
        function() {
            var a = y.createElement("div");
            if (null == k.deleteExpando) {
                k.deleteExpando = !0;
                try {
                    delete a.test
                } catch (b) {
                    k.deleteExpando = !1
                }
            }
            a = null
        }(),
        m.acceptData = function(a) {
            var b = m.noData[(a.nodeName + " ").toLowerCase()]
                , c = +a.nodeType || 1;
            return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
        }
    ;
    var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
        , N = /([A-Z])/g;
    function O(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(N, "-$1").toLowerCase();
            if (c = a.getAttribute(d),
            "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : M.test(c) ? m.parseJSON(c) : c
                } catch (e) {}
                m.data(a, b, c)
            } else
                c = void 0
        }
        return c
    }
    function P(a) {
        var b;
        for (b in a)
            if (("data" !== b || !m.isEmptyObject(a[b])) && "toJSON" !== b)
                return !1;
        return !0
    }
    function Q(a, b, d, e) {
        if (m.acceptData(a)) {
            var f, g, h = m.expando, i = a.nodeType, j = i ? m.cache : a, k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b)
                return k || (k = i ? a[h] = c.pop() || m.guid++ : h),
                j[k] || (j[k] = i ? {} : {
                    toJSON: m.noop
                }),
                ("object" == typeof b || "function" == typeof b) && (e ? j[k] = m.extend(j[k], b) : j[k].data = m.extend(j[k].data, b)),
                    g = j[k],
                e || (g.data || (g.data = {}),
                    g = g.data),
                void 0 !== d && (g[m.camelCase(b)] = d),
                    "string" == typeof b ? (f = g[b],
                    null == f && (f = g[m.camelCase(b)])) : f = g,
                    f
        }
    }
    function R(a, b, c) {
        if (m.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? m.cache : a, h = f ? a[m.expando] : m.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    m.isArray(b) ? b = b.concat(m.map(b, m.camelCase)) : b in d ? b = [b] : (b = m.camelCase(b),
                        b = b in d ? [b] : b.split(" ")),
                        e = b.length;
                    while (e--)
                        delete d[b[e]];
                    if (c ? !P(d) : !m.isEmptyObject(d))
                        return
                }
                (c || (delete g[h].data,
                    P(g[h]))) && (f ? m.cleanData([a], !0) : k.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }
    m.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando],
            !!a && !P(a)
        },
        data: function(a, b, c) {
            return Q(a, b, c)
        },
        removeData: function(a, b) {
            return R(a, b)
        },
        _data: function(a, b, c) {
            return Q(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return R(a, b, !0)
        }
    }),
        m.fn.extend({
            data: function(a, b) {
                var c, d, e, f = this[0], g = f && f.attributes;
                if (void 0 === a) {
                    if (this.length && (e = m.data(f),
                    1 === f.nodeType && !m._data(f, "parsedAttrs"))) {
                        c = g.length;
                        while (c--)
                            g[c] && (d = g[c].name,
                            0 === d.indexOf("data-") && (d = m.camelCase(d.slice(5)),
                                O(f, d, e[d])));
                        m._data(f, "parsedAttrs", !0)
                    }
                    return e
                }
                return "object" == typeof a ? this.each(function() {
                    m.data(this, a)
                }) : arguments.length > 1 ? this.each(function() {
                    m.data(this, a, b)
                }) : f ? O(f, a, m.data(f, a)) : void 0
            },
            removeData: function(a) {
                return this.each(function() {
                    m.removeData(this, a)
                })
            }
        }),
        m.extend({
            queue: function(a, b, c) {
                var d;
                return a ? (b = (b || "fx") + "queue",
                    d = m._data(a, b),
                c && (!d || m.isArray(c) ? d = m._data(a, b, m.makeArray(c)) : d.push(c)),
                d || []) : void 0
            },
            dequeue: function(a, b) {
                b = b || "fx";
                var c = m.queue(a, b)
                    , d = c.length
                    , e = c.shift()
                    , f = m._queueHooks(a, b)
                    , g = function() {
                    m.dequeue(a, b)
                };
                "inprogress" === e && (e = c.shift(),
                    d--),
                e && ("fx" === b && c.unshift("inprogress"),
                    delete f.stop,
                    e.call(a, g, f)),
                !d && f && f.empty.fire()
            },
            _queueHooks: function(a, b) {
                var c = b + "queueHooks";
                return m._data(a, c) || m._data(a, c, {
                    empty: m.Callbacks("once memory").add(function() {
                        m._removeData(a, b + "queue"),
                            m._removeData(a, c)
                    })
                })
            }
        }),
        m.fn.extend({
            queue: function(a, b) {
                var c = 2;
                return "string" != typeof a && (b = a,
                    a = "fx",
                    c--),
                    arguments.length < c ? m.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                        var c = m.queue(this, a, b);
                        m._queueHooks(this, a),
                        "fx" === a && "inprogress" !== c[0] && m.dequeue(this, a)
                    })
            },
            dequeue: function(a) {
                return this.each(function() {
                    m.dequeue(this, a)
                })
            },
            clearQueue: function(a) {
                return this.queue(a || "fx", [])
            },
            promise: function(a, b) {
                var c, d = 1, e = m.Deferred(), f = this, g = this.length, h = function() {
                    --d || e.resolveWith(f, [f])
                };
                "string" != typeof a && (b = a,
                    a = void 0),
                    a = a || "fx";
                while (g--)
                    c = m._data(f[g], a + "queueHooks"),
                    c && c.empty && (d++,
                        c.empty.add(h));
                return h(),
                    e.promise(b)
            }
        });
    var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
        , T = ["Top", "Right", "Bottom", "Left"]
        , U = function(a, b) {
        return a = b || a,
        "none" === m.css(a, "display") || !m.contains(a.ownerDocument, a)
    }
        , V = m.access = function(a, b, c, d, e, f, g) {
        var h = 0
            , i = a.length
            , j = null == c;
        if ("object" === m.type(c)) {
            e = !0;
            for (h in c)
                m.access(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0,
        m.isFunction(d) || (g = !0),
        j && (g ? (b.call(a, d),
            b = null) : (j = b,
                b = function(a, b, c) {
                    return j.call(m(a), c)
                }
        )),
            b))
            for (; i > h; h++)
                b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }
        , W = /^(?:checkbox|radio)$/i;
    !function() {
        var a = y.createElement("input")
            , b = y.createElement("div")
            , c = y.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
            k.leadingWhitespace = 3 === b.firstChild.nodeType,
            k.tbody = !b.getElementsByTagName("tbody").length,
            k.htmlSerialize = !!b.getElementsByTagName("link").length,
            k.html5Clone = "<:nav></:nav>" !== y.createElement("nav").cloneNode(!0).outerHTML,
            a.type = "checkbox",
            a.checked = !0,
            c.appendChild(a),
            k.appendChecked = a.checked,
            b.innerHTML = "<textarea>x</textarea>",
            k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue,
            c.appendChild(b),
            b.innerHTML = "<input type='radio' checked='checked' name='t'/>",
            k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked,
            k.noCloneEvent = !0,
        b.attachEvent && (b.attachEvent("onclick", function() {
            k.noCloneEvent = !1
        }),
            b.cloneNode(!0).click()),
        null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete b.test
            } catch (d) {
                k.deleteExpando = !1
            }
        }
    }(),
        function() {
            var b, c, d = y.createElement("div");
            for (b in {
                submit: !0,
                change: !0,
                focusin: !0
            })
                c = "on" + b,
                (k[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"),
                    k[b + "Bubbles"] = d.attributes[c].expando === !1);
            d = null
        }();
    var X = /^(?:input|select|textarea)$/i
        , Y = /^key/
        , Z = /^(?:mouse|pointer|contextmenu)|click/
        , $ = /^(?:focusinfocus|focusoutblur)$/
        , _ = /^([^.]*)(?:\.(.+)|)$/;
    function ab() {
        return !0
    }
    function bb() {
        return !1
    }
    function cb() {
        try {
            return y.activeElement
        } catch (a) {}
    }
    m.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m._data(a);
            if (r) {
                c.handler && (i = c,
                    c = i.handler,
                    e = i.selector),
                c.guid || (c.guid = m.guid++),
                (g = r.events) || (g = r.events = {}),
                (k = r.handle) || (k = r.handle = function(a) {
                    return typeof m === K || a && m.event.triggered === a.type ? void 0 : m.event.dispatch.apply(k.elem, arguments)
                }
                    ,
                    k.elem = a),
                    b = (b || "").match(E) || [""],
                    h = b.length;
                while (h--)
                    f = _.exec(b[h]) || [],
                        o = q = f[1],
                        p = (f[2] || "").split(".").sort(),
                    o && (j = m.event.special[o] || {},
                        o = (e ? j.delegateType : j.bindType) || o,
                        j = m.event.special[o] || {},
                        l = m.extend({
                            type: o,
                            origType: q,
                            data: d,
                            handler: c,
                            guid: c.guid,
                            selector: e,
                            needsContext: e && m.expr.match.needsContext.test(e),
                            namespace: p.join(".")
                        }, i),
                    (n = g[o]) || (n = g[o] = [],
                        n.delegateCount = 0,
                    j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))),
                    j.add && (j.add.call(a, l),
                    l.handler.guid || (l.handler.guid = c.guid)),
                        e ? n.splice(n.delegateCount++, 0, l) : n.push(l),
                        m.event.global[o] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m.hasData(a) && m._data(a);
            if (r && (k = r.events)) {
                b = (b || "").match(E) || [""],
                    j = b.length;
                while (j--)
                    if (h = _.exec(b[j]) || [],
                        o = q = h[1],
                        p = (h[2] || "").split(".").sort(),
                        o) {
                        l = m.event.special[o] || {},
                            o = (d ? l.delegateType : l.bindType) || o,
                            n = k[o] || [],
                            h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                            i = f = n.length;
                        while (f--)
                            g = n[f],
                            !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (n.splice(f, 1),
                            g.selector && n.delegateCount--,
                            l.remove && l.remove.call(a, g));
                        i && !n.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || m.removeEvent(a, o, r.handle),
                            delete k[o])
                    } else
                        for (o in k)
                            m.event.remove(a, o + b[j], c, d, !0);
                m.isEmptyObject(k) && (delete r.handle,
                    m._removeData(a, "events"))
            }
        },
        trigger: function(b, c, d, e) {
            var f, g, h, i, k, l, n, o = [d || y], p = j.call(b, "type") ? b.type : b, q = j.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = l = d = d || y,
            3 !== d.nodeType && 8 !== d.nodeType && !$.test(p + m.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."),
                p = q.shift(),
                q.sort()),
                g = p.indexOf(":") < 0 && "on" + p,
                b = b[m.expando] ? b : new m.Event(p,"object" == typeof b && b),
                b.isTrigger = e ? 2 : 3,
                b.namespace = q.join("."),
                b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                b.result = void 0,
            b.target || (b.target = d),
                c = null == c ? [b] : m.makeArray(c, [b]),
                k = m.event.special[p] || {},
            e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
                if (!e && !k.noBubble && !m.isWindow(d)) {
                    for (i = k.delegateType || p,
                         $.test(i + p) || (h = h.parentNode); h; h = h.parentNode)
                        o.push(h),
                            l = h;
                    l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a)
                }
                n = 0;
                while ((h = o[n++]) && !b.isPropagationStopped())
                    b.type = n > 1 ? i : k.bindType || p,
                        f = (m._data(h, "events") || {})[b.type] && m._data(h, "handle"),
                    f && f.apply(h, c),
                        f = g && h[g],
                    f && f.apply && m.acceptData(h) && (b.result = f.apply(h, c),
                    b.result === !1 && b.preventDefault());
                if (b.type = p,
                !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && m.acceptData(d) && g && d[p] && !m.isWindow(d)) {
                    l = d[g],
                    l && (d[g] = null),
                        m.event.triggered = p;
                    try {
                        d[p]()
                    } catch (r) {}
                    m.event.triggered = void 0,
                    l && (d[g] = l)
                }
                return b.result
            }
        },
        dispatch: function(a) {
            a = m.event.fix(a);
            var b, c, e, f, g, h = [], i = d.call(arguments), j = (m._data(this, "events") || {})[a.type] || [], k = m.event.special[a.type] || {};
            if (i[0] = a,
                a.delegateTarget = this,
            !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                h = m.event.handlers.call(this, a, j),
                    b = 0;
                while ((f = h[b++]) && !a.isPropagationStopped()) {
                    a.currentTarget = f.elem,
                        g = 0;
                    while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())
                        (!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e,
                            a.data = e.data,
                            c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i),
                        void 0 !== c && (a.result = c) === !1 && (a.preventDefault(),
                            a.stopPropagation()))
                }
                return k.postDispatch && k.postDispatch.call(this, a),
                    a.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [],
                                 f = 0; h > f; f++)
                            d = b[f],
                                c = d.selector + " ",
                            void 0 === e[c] && (e[c] = d.needsContext ? m(c, this).index(i) >= 0 : m.find(c, this, null, [i]).length),
                            e[c] && e.push(d);
                        e.length && g.push({
                            elem: i,
                            handlers: e
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }),
                g
        },
        fix: function(a) {
            if (a[m.expando])
                return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}),
                d = g.props ? this.props.concat(g.props) : this.props,
                a = new m.Event(f),
                b = d.length;
            while (b--)
                c = d[b],
                    a[c] = f[c];
            return a.target || (a.target = f.srcElement || y),
            3 === a.target.nodeType && (a.target = a.target.parentNode),
                a.metaKey = !!a.metaKey,
                g.filter ? g.filter(a, f) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
                    a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button, g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || y,
                    e = d.documentElement,
                    c = d.body,
                    a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0),
                    a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)),
                !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
                a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
                    a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== cb() && this.focus)
                        try {
                            return this.focus(),
                                !1
                        } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === cb() && this.blur ? (this.blur(),
                        !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return m.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                        !1) : void 0
                },
                _default: function(a) {
                    return m.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = m.extend(new m.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e),
            e.isDefaultPrevented() && c.preventDefault()
        }
    },
        m.removeEvent = y.removeEventListener ? function(a, b, c) {
                a.removeEventListener && a.removeEventListener(b, c, !1)
            }
            : function(a, b, c) {
                var d = "on" + b;
                a.detachEvent && (typeof a[d] === K && (a[d] = null),
                    a.detachEvent(d, c))
            }
        ,
        m.Event = function(a, b) {
            return this instanceof m.Event ? (a && a.type ? (this.originalEvent = a,
                this.type = a.type,
                this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ab : bb) : this.type = a,
            b && m.extend(this, b),
                this.timeStamp = a && a.timeStamp || m.now(),
                void (this[m.expando] = !0)) : new m.Event(a,b)
        }
        ,
        m.Event.prototype = {
            isDefaultPrevented: bb,
            isPropagationStopped: bb,
            isImmediatePropagationStopped: bb,
            preventDefault: function() {
                var a = this.originalEvent;
                this.isDefaultPrevented = ab,
                a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                var a = this.originalEvent;
                this.isPropagationStopped = ab,
                a && (a.stopPropagation && a.stopPropagation(),
                    a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var a = this.originalEvent;
                this.isImmediatePropagationStopped = ab,
                a && a.stopImmediatePropagation && a.stopImmediatePropagation(),
                    this.stopPropagation()
            }
        },
        m.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(a, b) {
            m.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c, d = this, e = a.relatedTarget, f = a.handleObj;
                    return (!e || e !== d && !m.contains(d, e)) && (a.type = f.origType,
                        c = f.handler.apply(this, arguments),
                        a.type = b),
                        c
                }
            }
        }),
    k.submitBubbles || (m.event.special.submit = {
        setup: function() {
            return m.nodeName(this, "form") ? !1 : void m.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target
                    , c = m.nodeName(b, "input") || m.nodeName(b, "button") ? b.form : void 0;
                c && !m._data(c, "submitBubbles") && (m.event.add(c, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }),
                    m._data(c, "submitBubbles", !0))
            })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble,
            this.parentNode && !a.isTrigger && m.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            return m.nodeName(this, "form") ? !1 : void m.event.remove(this, "._submit")
        }
    }),
    k.changeBubbles || (m.event.special.change = {
        setup: function() {
            return X.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (m.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }),
                m.event.add(this, "click._change", function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1),
                        m.event.simulate("change", this, a, !0)
                })),
                !1) : void m.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                X.test(b.nodeName) && !m._data(b, "changeBubbles") && (m.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || m.event.simulate("change", this.parentNode, a, !0)
                }),
                    m._data(b, "changeBubbles", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return m.event.remove(this, "._change"),
                !X.test(this.nodeName)
        }
    }),
    k.focusinBubbles || m.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            m.event.simulate(b, a.target, m.event.fix(a), !0)
        };
        m.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this
                    , e = m._data(d, b);
                e || d.addEventListener(a, c, !0),
                    m._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this
                    , e = m._data(d, b) - 1;
                e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0),
                    m._removeData(d, b))
            }
        }
    }),
        m.fn.extend({
            on: function(a, b, c, d, e) {
                var f, g;
                if ("object" == typeof a) {
                    "string" != typeof b && (c = c || b,
                        b = void 0);
                    for (f in a)
                        this.on(f, b, c, a[f], e);
                    return this
                }
                if (null == c && null == d ? (d = b,
                    c = b = void 0) : null == d && ("string" == typeof b ? (d = c,
                    c = void 0) : (d = c,
                    c = b,
                    b = void 0)),
                d === !1)
                    d = bb;
                else if (!d)
                    return this;
                return 1 === e && (g = d,
                    d = function(a) {
                        return m().off(a),
                            g.apply(this, arguments)
                    }
                    ,
                    d.guid = g.guid || (g.guid = m.guid++)),
                    this.each(function() {
                        m.event.add(this, a, d, c, b)
                    })
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1)
            },
            off: function(a, b, c) {
                var d, e;
                if (a && a.preventDefault && a.handleObj)
                    return d = a.handleObj,
                        m(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                        this;
                if ("object" == typeof a) {
                    for (e in a)
                        this.off(e, b, a[e]);
                    return this
                }
                return (b === !1 || "function" == typeof b) && (c = b,
                    b = void 0),
                c === !1 && (c = bb),
                    this.each(function() {
                        m.event.remove(this, a, c, b)
                    })
            },
            trigger: function(a, b) {
                return this.each(function() {
                    m.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                var c = this[0];
                return c ? m.event.trigger(a, b, c, !0) : void 0
            }
        });
    function db(a) {
        var b = eb.split("|")
            , c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length)
                c.createElement(b.pop());
        return c
    }
    var eb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
        , fb = / jQuery\d+="(?:null|\d+)"/g
        , gb = new RegExp("<(?:" + eb + ")[\\s/>]","i")
        , hb = /^\s+/
        , ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
        , jb = /<([\w:]+)/
        , kb = /<tbody/i
        , lb = /<|&#?\w+;/
        , mb = /<(?:script|style|link)/i
        , nb = /checked\s*(?:[^=]|=\s*.checked.)/i
        , ob = /^$|\/(?:java|ecma)script/i
        , pb = /^true\/(.*)/
        , qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
        , rb = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: k.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }
        , sb = db(y)
        , tb = sb.appendChild(y.createElement("div"));
    rb.optgroup = rb.option,
        rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead,
        rb.th = rb.td;
    function ub(a, b) {
        var c, d, e = 0, f = typeof a.getElementsByTagName !== K ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [],
                     c = a.childNodes || a; null != (d = c[e]); e++)
                !b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b));
        return void 0 === b || b && m.nodeName(a, b) ? m.merge([a], f) : f
    }
    function vb(a) {
        W.test(a.type) && (a.defaultChecked = a.checked)
    }
    function wb(a, b) {
        return m.nodeName(a, "table") && m.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function xb(a) {
        return a.type = (null !== m.find.attr(a, "type")) + "/" + a.type,
            a
    }
    function yb(a) {
        var b = pb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"),
            a
    }
    function zb(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++)
            m._data(c, "globalEval", !b || m._data(b[d], "globalEval"))
    }
    function Ab(a, b) {
        if (1 === b.nodeType && m.hasData(a)) {
            var c, d, e, f = m._data(a), g = m._data(b, f), h = f.events;
            if (h) {
                delete g.handle,
                    g.events = {};
                for (c in h)
                    for (d = 0,
                             e = h[c].length; e > d; d++)
                        m.event.add(b, c, h[c][d])
            }
            g.data && (g.data = m.extend({}, g.data))
        }
    }
    function Bb(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(),
            !k.noCloneEvent && b[m.expando]) {
                e = m._data(b);
                for (d in e.events)
                    m.removeEvent(b, d, e.handle);
                b.removeAttribute(m.expando)
            }
            "script" === c && b.text !== a.text ? (xb(b).text = a.text,
                yb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML),
            k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && W.test(a.type) ? (b.defaultChecked = b.checked = a.checked,
            b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }
    }
    m.extend({
        clone: function(a, b, c) {
            var d, e, f, g, h, i = m.contains(a.ownerDocument, a);
            if (k.html5Clone || m.isXMLDoc(a) || !gb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (tb.innerHTML = a.outerHTML,
                tb.removeChild(f = tb.firstChild)),
                !(k.noCloneEvent && k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || m.isXMLDoc(a)))
                for (d = ub(f),
                         h = ub(a),
                         g = 0; null != (e = h[g]); ++g)
                    d[g] && Bb(e, d[g]);
            if (b)
                if (c)
                    for (h = h || ub(a),
                             d = d || ub(f),
                             g = 0; null != (e = h[g]); g++)
                        Ab(e, d[g]);
                else
                    Ab(a, f);
            return d = ub(f, "script"),
            d.length > 0 && zb(d, !i && ub(a, "script")),
                d = h = e = null,
                f
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++)
                if (f = a[q],
                f || 0 === f)
                    if ("object" === m.type(f))
                        m.merge(p, f.nodeType ? [f] : f);
                    else if (lb.test(f)) {
                        h = h || o.appendChild(b.createElement("div")),
                            i = (jb.exec(f) || ["", ""])[1].toLowerCase(),
                            l = rb[i] || rb._default,
                            h.innerHTML = l[1] + f.replace(ib, "<$1></$2>") + l[2],
                            e = l[0];
                        while (e--)
                            h = h.lastChild;
                        if (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])),
                            !k.tbody) {
                            f = "table" !== i || kb.test(f) ? "<table>" !== l[1] || kb.test(f) ? 0 : h : h.firstChild,
                                e = f && f.childNodes.length;
                            while (e--)
                                m.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
                        }
                        m.merge(p, h.childNodes),
                            h.textContent = "";
                        while (h.firstChild)
                            h.removeChild(h.firstChild);
                        h = o.lastChild
                    } else
                        p.push(b.createTextNode(f));
            h && o.removeChild(h),
            k.appendChecked || m.grep(ub(p, "input"), vb),
                q = 0;
            while (f = p[q++])
                if ((!d || -1 === m.inArray(f, d)) && (g = m.contains(f.ownerDocument, f),
                    h = ub(o.appendChild(f), "script"),
                g && zb(h),
                    c)) {
                    e = 0;
                    while (f = h[e++])
                        ob.test(f.type || "") && c.push(f)
                }
            return h = null,
                o
        },
        cleanData: function(a, b) {
            for (var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special; null != (d = a[h]); h++)
                if ((b || m.acceptData(d)) && (f = d[i],
                    g = f && j[f])) {
                    if (g.events)
                        for (e in g.events)
                            n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle);
                    j[f] && (delete j[f],
                        l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : d[i] = null,
                        c.push(f))
                }
        }
    }),
        m.fn.extend({
            text: function(a) {
                return V(this, function(a) {
                    return void 0 === a ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || y).createTextNode(a))
                }, null, a, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = wb(this, a);
                        b.appendChild(a)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = wb(this, a);
                        b.insertBefore(a, b.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                })
            },
            remove: function(a, b) {
                for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
                    b || 1 !== c.nodeType || m.cleanData(ub(c)),
                    c.parentNode && (b && m.contains(c.ownerDocument, c) && zb(ub(c, "script")),
                        c.parentNode.removeChild(c));
                return this
            },
            empty: function() {
                for (var a, b = 0; null != (a = this[b]); b++) {
                    1 === a.nodeType && m.cleanData(ub(a, !1));
                    while (a.firstChild)
                        a.removeChild(a.firstChild);
                    a.options && m.nodeName(a, "select") && (a.options.length = 0)
                }
                return this
            },
            clone: function(a, b) {
                return a = null == a ? !1 : a,
                    b = null == b ? a : b,
                    this.map(function() {
                        return m.clone(this, a, b)
                    })
            },
            html: function(a) {
                return V(this, function(a) {
                    var b = this[0] || {}
                        , c = 0
                        , d = this.length;
                    if (void 0 === a)
                        return 1 === b.nodeType ? b.innerHTML.replace(fb, "") : void 0;
                    if (!("string" != typeof a || mb.test(a) || !k.htmlSerialize && gb.test(a) || !k.leadingWhitespace && hb.test(a) || rb[(jb.exec(a) || ["", ""])[1].toLowerCase()])) {
                        a = a.replace(ib, "<$1></$2>");
                        try {
                            for (; d > c; c++)
                                b = this[c] || {},
                                1 === b.nodeType && (m.cleanData(ub(b, !1)),
                                    b.innerHTML = a);
                            b = 0
                        } catch (e) {}
                    }
                    b && this.empty().append(a)
                }, null, a, arguments.length)
            },
            replaceWith: function() {
                var a = arguments[0];
                return this.domManip(arguments, function(b) {
                    a = this.parentNode,
                        m.cleanData(ub(this)),
                    a && a.replaceChild(b, this)
                }),
                    a && (a.length || a.nodeType) ? this : this.remove()
            },
            detach: function(a) {
                return this.remove(a, !0)
            },
            domManip: function(a, b) {
                a = e.apply([], a);
                var c, d, f, g, h, i, j = 0, l = this.length, n = this, o = l - 1, p = a[0], q = m.isFunction(p);
                if (q || l > 1 && "string" == typeof p && !k.checkClone && nb.test(p))
                    return this.each(function(c) {
                        var d = n.eq(c);
                        q && (a[0] = p.call(this, c, d.html())),
                            d.domManip(a, b)
                    });
                if (l && (i = m.buildFragment(a, this[0].ownerDocument, !1, this),
                    c = i.firstChild,
                1 === i.childNodes.length && (i = c),
                    c)) {
                    for (g = m.map(ub(i, "script"), xb),
                             f = g.length; l > j; j++)
                        d = i,
                        j !== o && (d = m.clone(d, !0, !0),
                        f && m.merge(g, ub(d, "script"))),
                            b.call(this[j], d, j);
                    if (f)
                        for (h = g[g.length - 1].ownerDocument,
                                 m.map(g, yb),
                                 j = 0; f > j; j++)
                            d = g[j],
                            ob.test(d.type || "") && !m._data(d, "globalEval") && m.contains(h, d) && (d.src ? m._evalUrl && m._evalUrl(d.src) : m.globalEval((d.text || d.textContent || d.innerHTML || "").replace(qb, "")));
                    i = c = null
                }
                return this
            }
        }),
        m.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(a, b) {
            m.fn[a] = function(a) {
                for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++)
                    c = d === h ? this : this.clone(!0),
                        m(g[d])[b](c),
                        f.apply(e, c.get());
                return this.pushStack(e)
            }
        });
    var Cb, Db = {};
    function Eb(b, c) {
        var d, e = m(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : m.css(e[0], "display");
        return e.detach(),
            f
    }
    function Fb(a) {
        var b = y
            , c = Db[a];
        return c || (c = Eb(a, b),
        "none" !== c && c || (Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),
            b = (Cb[0].contentWindow || Cb[0].contentDocument).document,
            b.write(),
            b.close(),
            c = Eb(a, b),
            Cb.detach()),
            Db[a] = c),
            c
    }
    !function() {
        var a;
        k.shrinkWrapBlocks = function() {
            if (null != a)
                return a;
            a = !1;
            var b, c, d;
            return c = y.getElementsByTagName("body")[0],
                c && c.style ? (b = y.createElement("div"),
                    d = y.createElement("div"),
                    d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    c.appendChild(d).appendChild(b),
                typeof b.style.zoom !== K && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
                    b.appendChild(y.createElement("div")).style.width = "5px",
                    a = 3 !== b.offsetWidth),
                    c.removeChild(d),
                    a) : void 0
        }
    }();
    var Gb = /^margin/, Hb = new RegExp("^(" + S + ")(?!px)[a-z%]+$","i"), Ib, Jb, Kb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ib = function(b) {
            return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
        }
            ,
            Jb = function(a, b, c) {
                var d, e, f, g, h = a.style;
                return c = c || Ib(a),
                    g = c ? c.getPropertyValue(b) || c[b] : void 0,
                c && ("" !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)),
                Hb.test(g) && Gb.test(b) && (d = h.width,
                    e = h.minWidth,
                    f = h.maxWidth,
                    h.minWidth = h.maxWidth = h.width = g,
                    g = c.width,
                    h.width = d,
                    h.minWidth = e,
                    h.maxWidth = f)),
                    void 0 === g ? g : g + ""
            }
    ) : y.documentElement.currentStyle && (Ib = function(a) {
            return a.currentStyle
        }
            ,
            Jb = function(a, b, c) {
                var d, e, f, g, h = a.style;
                return c = c || Ib(a),
                    g = c ? c[b] : void 0,
                null == g && h && h[b] && (g = h[b]),
                Hb.test(g) && !Kb.test(b) && (d = h.left,
                    e = a.runtimeStyle,
                    f = e && e.left,
                f && (e.left = a.currentStyle.left),
                    h.left = "fontSize" === b ? "1em" : g,
                    g = h.pixelLeft + "px",
                    h.left = d,
                f && (e.left = f)),
                    void 0 === g ? g : g + "" || "auto"
            }
    );
    function Lb(a, b) {
        return {
            get: function() {
                var c = a();
                if (null != c)
                    return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    !function() {
        var b, c, d, e, f, g, h;
        if (b = y.createElement("div"),
            b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
            d = b.getElementsByTagName("a")[0],
            c = d && d.style) {
            c.cssText = "float:left;opacity:.5",
                k.opacity = "0.5" === c.opacity,
                k.cssFloat = !!c.cssFloat,
                b.style.backgroundClip = "content-box",
                b.cloneNode(!0).style.backgroundClip = "",
                k.clearCloneStyle = "content-box" === b.style.backgroundClip,
                k.boxSizing = "" === c.boxSizing || "" === c.MozBoxSizing || "" === c.WebkitBoxSizing,
                m.extend(k, {
                    reliableHiddenOffsets: function() {
                        return null == g && i(),
                            g
                    },
                    boxSizingReliable: function() {
                        return null == f && i(),
                            f
                    },
                    pixelPosition: function() {
                        return null == e && i(),
                            e
                    },
                    reliableMarginRight: function() {
                        return null == h && i(),
                            h
                    }
                });
            function i() {
                var b, c, d, i;
                c = y.getElementsByTagName("body")[0],
                c && c.style && (b = y.createElement("div"),
                    d = y.createElement("div"),
                    d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    c.appendChild(d).appendChild(b),
                    b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
                    e = f = !1,
                    h = !0,
                a.getComputedStyle && (e = "1%" !== (a.getComputedStyle(b, null) || {}).top,
                    f = "4px" === (a.getComputedStyle(b, null) || {
                        width: "4px"
                    }).width,
                    i = b.appendChild(y.createElement("div")),
                    i.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                    i.style.marginRight = i.style.width = "0",
                    b.style.width = "1px",
                    h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight),
                    b.removeChild(i)),
                    b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
                    i = b.getElementsByTagName("td"),
                    i[0].style.cssText = "margin:0;border:0;padding:0;display:none",
                    g = 0 === i[0].offsetHeight,
                g && (i[0].style.display = "",
                    i[1].style.display = "none",
                    g = 0 === i[0].offsetHeight),
                    c.removeChild(d))
            }
        }
    }(),
        m.swap = function(a, b, c, d) {
            var e, f, g = {};
            for (f in b)
                g[f] = a.style[f],
                    a.style[f] = b[f];
            e = c.apply(a, d || []);
            for (f in b)
                a.style[f] = g[f];
            return e
        }
    ;
    var Mb = /alpha\([^)]*\)/i
        , Nb = /opacity\s*=\s*([^)]*)/
        , Ob = /^(none|table(?!-c[ea]).+)/
        , Pb = new RegExp("^(" + S + ")(.*)$","i")
        , Qb = new RegExp("^([+-])=(" + S + ")","i")
        , Rb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
        , Sb = {
        letterSpacing: "0",
        fontWeight: "400"
    }
        , Tb = ["Webkit", "O", "Moz", "ms"];
    function Ub(a, b) {
        if (b in a)
            return b;
        var c = b.charAt(0).toUpperCase() + b.slice(1)
            , d = b
            , e = Tb.length;
        while (e--)
            if (b = Tb[e] + c,
            b in a)
                return b;
        return d
    }
    function Vb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
            d = a[g],
            d.style && (f[g] = m._data(d, "olddisplay"),
                c = d.style.display,
                b ? (f[g] || "none" !== c || (d.style.display = ""),
                "" === d.style.display && U(d) && (f[g] = m._data(d, "olddisplay", Fb(d.nodeName)))) : (e = U(d),
                (c && "none" !== c || !e) && m._data(d, "olddisplay", e ? c : m.css(d, "display"))));
        for (g = 0; h > g; g++)
            d = a[g],
            d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }
    function Wb(a, b, c) {
        var d = Pb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }
    function Xb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
            "margin" === c && (g += m.css(a, c + T[f], !0, e)),
                d ? ("content" === c && (g -= m.css(a, "padding" + T[f], !0, e)),
                "margin" !== c && (g -= m.css(a, "border" + T[f] + "Width", !0, e))) : (g += m.css(a, "padding" + T[f], !0, e),
                "padding" !== c && (g += m.css(a, "border" + T[f] + "Width", !0, e)));
        return g
    }
    function Yb(a, b, c) {
        var d = !0
            , e = "width" === b ? a.offsetWidth : a.offsetHeight
            , f = Ib(a)
            , g = k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Jb(a, b, f),
            (0 > e || null == e) && (e = a.style[b]),
                Hb.test(e))
                return e;
            d = g && (k.boxSizingReliable() || e === a.style[b]),
                e = parseFloat(e) || 0
        }
        return e + Xb(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    m.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Jb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": k.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = m.camelCase(b), i = a.style;
                if (b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h)),
                    g = m.cssHooks[b] || m.cssHooks[h],
                void 0 === c)
                    return g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c,
                "string" === f && (e = Qb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b)),
                    f = "number"),
                null != c && c === c && ("number" !== f || m.cssNumber[h] || (c += "px"),
                k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                    !(g && "set"in g && void 0 === (c = g.set(a, c, d)))))
                    try {
                        i[b] = c
                    } catch (j) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = m.camelCase(b);
            return b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h)),
                g = m.cssHooks[b] || m.cssHooks[h],
            g && "get"in g && (f = g.get(a, !0, c)),
            void 0 === f && (f = Jb(a, b, d)),
            "normal" === f && b in Sb && (f = Sb[b]),
                "" === c || c ? (e = parseFloat(f),
                    c === !0 || m.isNumeric(e) ? e || 0 : f) : f
        }
    }),
        m.each(["height", "width"], function(a, b) {
            m.cssHooks[b] = {
                get: function(a, c, d) {
                    return c ? Ob.test(m.css(a, "display")) && 0 === a.offsetWidth ? m.swap(a, Rb, function() {
                        return Yb(a, b, d)
                    }) : Yb(a, b, d) : void 0
                },
                set: function(a, c, d) {
                    var e = d && Ib(a);
                    return Wb(a, c, d ? Xb(a, b, d, k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, e), e) : 0)
                }
            }
        }),
    k.opacity || (m.cssHooks.opacity = {
        get: function(a, b) {
            return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style
                , d = a.currentStyle
                , e = m.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : ""
                , f = d && d.filter || c.filter || "";
            c.zoom = 1,
            (b >= 1 || "" === b) && "" === m.trim(f.replace(Mb, "")) && c.removeAttribute && (c.removeAttribute("filter"),
            "" === b || d && !d.filter) || (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + " " + e)
        }
    }),
        m.cssHooks.marginRight = Lb(k.reliableMarginRight, function(a, b) {
            return b ? m.swap(a, {
                display: "inline-block"
            }, Jb, [a, "marginRight"]) : void 0
        }),
        m.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(a, b) {
            m.cssHooks[a + b] = {
                expand: function(c) {
                    for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
                        e[a + T[d] + b] = f[d] || f[d - 2] || f[0];
                    return e
                }
            },
            Gb.test(a) || (m.cssHooks[a + b].set = Wb)
        }),
        m.fn.extend({
            css: function(a, b) {
                return V(this, function(a, b, c) {
                    var d, e, f = {}, g = 0;
                    if (m.isArray(b)) {
                        for (d = Ib(a),
                                 e = b.length; e > g; g++)
                            f[b[g]] = m.css(a, b[g], !1, d);
                        return f
                    }
                    return void 0 !== c ? m.style(a, b, c) : m.css(a, b)
                }, a, b, arguments.length > 1)
            },
            show: function() {
                return Vb(this, !0)
            },
            hide: function() {
                return Vb(this)
            },
            toggle: function(a) {
                return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                    U(this) ? m(this).show() : m(this).hide()
                })
            }
        });
    function Zb(a, b, c, d, e) {
        return new Zb.prototype.init(a,b,c,d,e)
    }
    m.Tween = Zb,
        Zb.prototype = {
            constructor: Zb,
            init: function(a, b, c, d, e, f) {
                this.elem = a,
                    this.prop = c,
                    this.easing = e || "swing",
                    this.options = b,
                    this.start = this.now = this.cur(),
                    this.end = d,
                    this.unit = f || (m.cssNumber[c] ? "" : "px")
            },
            cur: function() {
                var a = Zb.propHooks[this.prop];
                return a && a.get ? a.get(this) : Zb.propHooks._default.get(this)
            },
            run: function(a) {
                var b, c = Zb.propHooks[this.prop];
                return this.pos = b = this.options.duration ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a,
                    this.now = (this.end - this.start) * b + this.start,
                this.options.step && this.options.step.call(this.elem, this.now, this),
                    c && c.set ? c.set(this) : Zb.propHooks._default.set(this),
                    this
            }
        },
        Zb.prototype.init.prototype = Zb.prototype,
        Zb.propHooks = {
            _default: {
                get: function(a) {
                    var b;
                    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = m.css(a.elem, a.prop, ""),
                        b && "auto" !== b ? b : 0) : a.elem[a.prop]
                },
                set: function(a) {
                    m.fx.step[a.prop] ? m.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop]) ? m.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                }
            }
        },
        Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {
            set: function(a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
            }
        },
        m.easing = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2
            }
        },
        m.fx = Zb.prototype.init,
        m.fx.step = {};
    var $b, _b, ac = /^(?:toggle|show|hide)$/, bc = new RegExp("^(?:([+-])=|)(" + S + ")([a-z%]*)$","i"), cc = /queueHooks$/, dc = [ic], ec = {
        "*": [function(a, b) {
            var c = this.createTween(a, b)
                , d = c.cur()
                , e = bc.exec(b)
                , f = e && e[3] || (m.cssNumber[a] ? "" : "px")
                , g = (m.cssNumber[a] || "px" !== f && +d) && bc.exec(m.css(c.elem, a))
                , h = 1
                , i = 20;
            if (g && g[3] !== f) {
                f = f || g[3],
                    e = e || [],
                    g = +d || 1;
                do
                    h = h || ".5",
                        g /= h,
                        m.style(c.elem, a, g + f);
                while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0,
                c.unit = f,
                c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]),
                c
        }
        ]
    };
    function fc() {
        return setTimeout(function() {
            $b = void 0
        }),
            $b = m.now()
    }
    function gc(a, b) {
        var c, d = {
            height: a
        }, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b)
            c = T[e],
                d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a),
            d
    }
    function hc(a, b, c) {
        for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function ic(a, b, c) {
        var d, e, f, g, h, i, j, l, n = this, o = {}, p = a.style, q = a.nodeType && U(a), r = m._data(a, "fxshow");
        c.queue || (h = m._queueHooks(a, "fx"),
        null == h.unqueued && (h.unqueued = 0,
                i = h.empty.fire,
                h.empty.fire = function() {
                    h.unqueued || i()
                }
        ),
            h.unqueued++,
            n.always(function() {
                n.always(function() {
                    h.unqueued--,
                    m.queue(a, "fx").length || h.empty.fire()
                })
            })),
        1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY],
            j = m.css(a, "display"),
            l = "none" === j ? m._data(a, "olddisplay") || Fb(a.nodeName) : j,
        "inline" === l && "none" === m.css(a, "float") && (k.inlineBlockNeedsLayout && "inline" !== Fb(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")),
        c.overflow && (p.overflow = "hidden",
        k.shrinkWrapBlocks() || n.always(function() {
            p.overflow = c.overflow[0],
                p.overflowX = c.overflow[1],
                p.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d],
                ac.exec(e)) {
                if (delete b[d],
                    f = f || "toggle" === e,
                e === (q ? "hide" : "show")) {
                    if ("show" !== e || !r || void 0 === r[d])
                        continue;
                    q = !0
                }
                o[d] = r && r[d] || m.style(a, d)
            } else
                j = void 0;
        if (m.isEmptyObject(o))
            "inline" === ("none" === j ? Fb(a.nodeName) : j) && (p.display = j);
        else {
            r ? "hidden"in r && (q = r.hidden) : r = m._data(a, "fxshow", {}),
            f && (r.hidden = !q),
                q ? m(a).show() : n.done(function() {
                    m(a).hide()
                }),
                n.done(function() {
                    var b;
                    m._removeData(a, "fxshow");
                    for (b in o)
                        m.style(a, b, o[b])
                });
            for (d in o)
                g = hc(q ? r[d] : 0, d, n),
                d in r || (r[d] = g.start,
                q && (g.end = g.start,
                    g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }
    function jc(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = m.camelCase(c),
                e = b[d],
                f = a[c],
            m.isArray(f) && (e = f[1],
                f = a[c] = f[0]),
            c !== d && (a[d] = f,
                delete a[c]),
                g = m.cssHooks[d],
            g && "expand"in g) {
                f = g.expand(f),
                    delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c],
                        b[c] = e)
            } else
                b[d] = e
    }
    function kc(a, b, c) {
        var d, e, f = 0, g = dc.length, h = m.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            if (e)
                return !1;
            for (var b = $b || fc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
                j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]),
                1 > f && i ? c : (h.resolveWith(a, [j]),
                    !1)
        }, j = h.promise({
            elem: a,
            props: m.extend({}, b),
            opts: m.extend(!0, {
                specialEasing: {}
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: $b || fc(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d),
                    d
            },
            stop: function(b) {
                var c = 0
                    , d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; d > c; c++)
                    j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]),
                    this
            }
        }), k = j.props;
        for (jc(k, j.opts.specialEasing); g > f; f++)
            if (d = dc[f].call(j, a, k, j.opts))
                return d;
        return m.map(k, hc, j),
        m.isFunction(j.opts.start) && j.opts.start.call(a, j),
            m.fx.timer(m.extend(i, {
                elem: a,
                anim: j,
                queue: j.opts.queue
            })),
            j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    m.Animation = m.extend(kc, {
        tweener: function(a, b) {
            m.isFunction(a) ? (b = a,
                a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++)
                c = a[d],
                    ec[c] = ec[c] || [],
                    ec[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? dc.unshift(a) : dc.push(a)
        }
    }),
        m.speed = function(a, b, c) {
            var d = a && "object" == typeof a ? m.extend({}, a) : {
                complete: c || !c && b || m.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !m.isFunction(b) && b
            };
            return d.duration = m.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default,
            (null == d.queue || d.queue === !0) && (d.queue = "fx"),
                d.old = d.complete,
                d.complete = function() {
                    m.isFunction(d.old) && d.old.call(this),
                    d.queue && m.dequeue(this, d.queue)
                }
                ,
                d
        }
        ,
        m.fn.extend({
            fadeTo: function(a, b, c, d) {
                return this.filter(U).css("opacity", 0).show().end().animate({
                    opacity: b
                }, a, c, d)
            },
            animate: function(a, b, c, d) {
                var e = m.isEmptyObject(a)
                    , f = m.speed(b, c, d)
                    , g = function() {
                    var b = kc(this, m.extend({}, a), f);
                    (e || m._data(this, "finish")) && b.stop(!0)
                };
                return g.finish = g,
                    e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
            },
            stop: function(a, b, c) {
                var d = function(a) {
                    var b = a.stop;
                    delete a.stop,
                        b(c)
                };
                return "string" != typeof a && (c = b,
                    b = a,
                    a = void 0),
                b && a !== !1 && this.queue(a || "fx", []),
                    this.each(function() {
                        var b = !0
                            , e = null != a && a + "queueHooks"
                            , f = m.timers
                            , g = m._data(this);
                        if (e)
                            g[e] && g[e].stop && d(g[e]);
                        else
                            for (e in g)
                                g[e] && g[e].stop && cc.test(e) && d(g[e]);
                        for (e = f.length; e--; )
                            f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
                                b = !1,
                                f.splice(e, 1));
                        (b || !c) && m.dequeue(this, a)
                    })
            },
            finish: function(a) {
                return a !== !1 && (a = a || "fx"),
                    this.each(function() {
                        var b, c = m._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = m.timers, g = d ? d.length : 0;
                        for (c.finish = !0,
                                 m.queue(this, a, []),
                             e && e.stop && e.stop.call(this, !0),
                                 b = f.length; b--; )
                            f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
                                f.splice(b, 1));
                        for (b = 0; g > b; b++)
                            d[b] && d[b].finish && d[b].finish.call(this);
                        delete c.finish
                    })
            }
        }),
        m.each(["toggle", "show", "hide"], function(a, b) {
            var c = m.fn[b];
            m.fn[b] = function(a, d, e) {
                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gc(b, !0), a, d, e)
            }
        }),
        m.each({
            slideDown: gc("show"),
            slideUp: gc("hide"),
            slideToggle: gc("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(a, b) {
            m.fn[a] = function(a, c, d) {
                return this.animate(b, a, c, d)
            }
        }),
        m.timers = [],
        m.fx.tick = function() {
            var a, b = m.timers, c = 0;
            for ($b = m.now(); c < b.length; c++)
                a = b[c],
                a() || b[c] !== a || b.splice(c--, 1);
            b.length || m.fx.stop(),
                $b = void 0
        }
        ,
        m.fx.timer = function(a) {
            m.timers.push(a),
                a() ? m.fx.start() : m.timers.pop()
        }
        ,
        m.fx.interval = 13,
        m.fx.start = function() {
            _b || (_b = setInterval(m.fx.tick, m.fx.interval))
        }
        ,
        m.fx.stop = function() {
            clearInterval(_b),
                _b = null
        }
        ,
        m.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        m.fn.delay = function(a, b) {
            return a = m.fx ? m.fx.speeds[a] || a : a,
                b = b || "fx",
                this.queue(b, function(b, c) {
                    var d = setTimeout(b, a);
                    c.stop = function() {
                        clearTimeout(d)
                    }
                })
        }
        ,
        function() {
            var a, b, c, d, e;
            b = y.createElement("div"),
                b.setAttribute("className", "t"),
                b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
                d = b.getElementsByTagName("a")[0],
                c = y.createElement("select"),
                e = c.appendChild(y.createElement("option")),
                a = b.getElementsByTagName("input")[0],
                d.style.cssText = "top:1px",
                k.getSetAttribute = "t" !== b.className,
                k.style = /top/.test(d.getAttribute("style")),
                k.hrefNormalized = "/a" === d.getAttribute("href"),
                k.checkOn = !!a.value,
                k.optSelected = e.selected,
                k.enctype = !!y.createElement("form").enctype,
                c.disabled = !0,
                k.optDisabled = !e.disabled,
                a = y.createElement("input"),
                a.setAttribute("value", ""),
                k.input = "" === a.getAttribute("value"),
                a.value = "t",
                a.setAttribute("type", "radio"),
                k.radioValue = "t" === a.value
        }();
    var lc = /\r/g;
    m.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            {
                if (arguments.length)
                    return d = m.isFunction(a),
                        this.each(function(c) {
                            var e;
                            1 === this.nodeType && (e = d ? a.call(this, c, m(this).val()) : a,
                                null == e ? e = "" : "number" == typeof e ? e += "" : m.isArray(e) && (e = m.map(e, function(a) {
                                    return null == a ? "" : a + ""
                                })),
                                b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()],
                            b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                        });
                if (e)
                    return b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()],
                        b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
                            "string" == typeof c ? c.replace(lc, "") : null == c ? "" : c)
            }
        }
    }),
        m.extend({
            valHooks: {
                option: {
                    get: function(a) {
                        var b = m.find.attr(a, "value");
                        return null != b ? b : m.trim(m.text(a))
                    }
                },
                select: {
                    get: function(a) {
                        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                            if (c = d[i],
                                !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && m.nodeName(c.parentNode, "optgroup"))) {
                                if (b = m(c).val(),
                                    f)
                                    return b;
                                g.push(b)
                            }
                        return g
                    },
                    set: function(a, b) {
                        var c, d, e = a.options, f = m.makeArray(b), g = e.length;
                        while (g--)
                            if (d = e[g],
                            m.inArray(m.valHooks.option.get(d), f) >= 0)
                                try {
                                    d.selected = c = !0
                                } catch (h) {
                                    d.scrollHeight
                                }
                            else
                                d.selected = !1;
                        return c || (a.selectedIndex = -1),
                            e
                    }
                }
            }
        }),
        m.each(["radio", "checkbox"], function() {
            m.valHooks[this] = {
                set: function(a, b) {
                    return m.isArray(b) ? a.checked = m.inArray(m(a).val(), b) >= 0 : void 0
                }
            },
            k.checkOn || (m.valHooks[this].get = function(a) {
                    return null === a.getAttribute("value") ? "on" : a.value
                }
            )
        });
    var mc, nc, oc = m.expr.attrHandle, pc = /^(?:checked|selected)$/i, qc = k.getSetAttribute, rc = k.input;
    m.fn.extend({
        attr: function(a, b) {
            return V(this, m.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                m.removeAttr(this, a)
            })
        }
    }),
        m.extend({
            attr: function(a, b, c) {
                var d, e, f = a.nodeType;
                if (a && 3 !== f && 8 !== f && 2 !== f)
                    return typeof a.getAttribute === K ? m.prop(a, b, c) : (1 === f && m.isXMLDoc(a) || (b = b.toLowerCase(),
                        d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc)),
                        void 0 === c ? d && "get"in d && null !== (e = d.get(a, b)) ? e : (e = m.find.attr(a, b),
                            null == e ? void 0 : e) : null !== c ? d && "set"in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""),
                            c) : void m.removeAttr(a, b))
            },
            removeAttr: function(a, b) {
                var c, d, e = 0, f = b && b.match(E);
                if (f && 1 === a.nodeType)
                    while (c = f[e++])
                        d = m.propFix[c] || c,
                            m.expr.match.bool.test(c) ? rc && qc || !pc.test(c) ? a[d] = !1 : a[m.camelCase("default-" + c)] = a[d] = !1 : m.attr(a, c, ""),
                            a.removeAttribute(qc ? c : d)
            },
            attrHooks: {
                type: {
                    set: function(a, b) {
                        if (!k.radioValue && "radio" === b && m.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b),
                            c && (a.value = c),
                                b
                        }
                    }
                }
            }
        }),
        nc = {
            set: function(a, b, c) {
                return b === !1 ? m.removeAttr(a, c) : rc && qc || !pc.test(c) ? a.setAttribute(!qc && m.propFix[c] || c, c) : a[m.camelCase("default-" + c)] = a[c] = !0,
                    c
            }
        },
        m.each(m.expr.match.bool.source.match(/\w+/g), function(a, b) {
            var c = oc[b] || m.find.attr;
            oc[b] = rc && qc || !pc.test(b) ? function(a, b, d) {
                    var e, f;
                    return d || (f = oc[b],
                        oc[b] = e,
                        e = null != c(a, b, d) ? b.toLowerCase() : null,
                        oc[b] = f),
                        e
                }
                : function(a, b, c) {
                    return c ? void 0 : a[m.camelCase("default-" + b)] ? b.toLowerCase() : null
                }
        }),
    rc && qc || (m.attrHooks.value = {
        set: function(a, b, c) {
            return m.nodeName(a, "input") ? void (a.defaultValue = b) : mc && mc.set(a, b, c)
        }
    }),
    qc || (mc = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)),
                d.value = b += "",
                "value" === c || b === a.getAttribute(c) ? b : void 0
        }
    },
        oc.id = oc.name = oc.coords = function(a, b, c) {
            var d;
            return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
        }
        ,
        m.valHooks.button = {
            get: function(a, b) {
                var c = a.getAttributeNode(b);
                return c && c.specified ? c.value : void 0
            },
            set: mc.set
        },
        m.attrHooks.contenteditable = {
            set: function(a, b, c) {
                mc.set(a, "" === b ? !1 : b, c)
            }
        },
        m.each(["width", "height"], function(a, b) {
            m.attrHooks[b] = {
                set: function(a, c) {
                    return "" === c ? (a.setAttribute(b, "auto"),
                        c) : void 0
                }
            }
        })),
    k.style || (m.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a, b) {
            return a.style.cssText = b + ""
        }
    });
    var sc = /^(?:input|select|textarea|button|object)$/i
        , tc = /^(?:a|area)$/i;
    m.fn.extend({
        prop: function(a, b) {
            return V(this, m.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = m.propFix[a] || a,
                this.each(function() {
                    try {
                        this[a] = void 0,
                            delete this[a]
                    } catch (b) {}
                })
        }
    }),
        m.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(a, b, c) {
                var d, e, f, g = a.nodeType;
                if (a && 3 !== g && 8 !== g && 2 !== g)
                    return f = 1 !== g || !m.isXMLDoc(a),
                    f && (b = m.propFix[b] || b,
                        e = m.propHooks[b]),
                        void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
            },
            propHooks: {
                tabIndex: {
                    get: function(a) {
                        var b = m.find.attr(a, "tabindex");
                        return b ? parseInt(b, 10) : sc.test(a.nodeName) || tc.test(a.nodeName) && a.href ? 0 : -1
                    }
                }
            }
        }),
    k.hrefNormalized || m.each(["href", "src"], function(a, b) {
        m.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    }),
    k.optSelected || (m.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex),
                null
        }
    }),
        m.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            m.propFix[this.toLowerCase()] = this
        }),
    k.enctype || (m.propFix.enctype = "encoding");
    var uc = /[\t\r\n\f]/g;
    m.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
            if (m.isFunction(a))
                return this.each(function(b) {
                    m(this).addClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(E) || []; i > h; h++)
                    if (c = this[h],
                        d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : " ")) {
                        f = 0;
                        while (e = b[f++])
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = m.trim(d),
                        c.className !== g && (c.className = g)
                    }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
            if (m.isFunction(a))
                return this.each(function(b) {
                    m(this).removeClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(E) || []; i > h; h++)
                    if (c = this[h],
                        d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : "")) {
                        f = 0;
                        while (e = b[f++])
                            while (d.indexOf(" " + e + " ") >= 0)
                                d = d.replace(" " + e + " ", " ");
                        g = a ? m.trim(d) : "",
                        c.className !== g && (c.className = g)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(m.isFunction(a) ? function(c) {
                    m(this).toggleClass(a.call(this, c, this.className, b), b)
                }
                : function() {
                    if ("string" === c) {
                        var b, d = 0, e = m(this), f = a.match(E) || [];
                        while (b = f[d++])
                            e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                    } else
                        (c === K || "boolean" === c) && (this.className && m._data(this, "__className__", this.className),
                            this.className = this.className || a === !1 ? "" : m._data(this, "__className__") || "")
                }
            )
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(uc, " ").indexOf(b) >= 0)
                    return !0;
            return !1
        }
    }),
        m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            m.fn[b] = function(a, c) {
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }
        }),
        m.fn.extend({
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
            }
        });
    var vc = m.now()
        , wc = /\?/
        , xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    m.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse)
            return a.JSON.parse(b + "");
        var c, d = null, e = m.trim(b + "");
        return e && !m.trim(e.replace(xc, function(a, b, e, f) {
            return c && b && (d = 0),
                0 === d ? a : (c = e || b,
                    d += !f - !e,
                    "")
        })) ? Function("return " + e)() : m.error("Invalid JSON: " + b)
    }
        ,
        m.parseXML = function(b) {
            var c, d;
            if (!b || "string" != typeof b)
                return null;
            try {
                a.DOMParser ? (d = new DOMParser,
                    c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"),
                    c.async = "false",
                    c.loadXML(b))
            } catch (e) {
                c = void 0
            }
            return c && c.documentElement && !c.getElementsByTagName("parsererror").length || m.error("Invalid XML: " + b),
                c
        }
    ;
    var yc, zc, Ac = /#.*$/, Bc = /([?&])_=[^&]*/, Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ec = /^(?:GET|HEAD)$/, Fc = /^\/\//, Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Hc = {}, Ic = {}, Jc = "*/".concat("*");
    try {
        zc = location.href
    } catch (Kc) {
        zc = y.createElement("a"),
            zc.href = "",
            zc = zc.href
    }
    yc = Gc.exec(zc.toLowerCase()) || [];
    function Lc(a) {
        return function(b, c) {
            "string" != typeof b && (c = b,
                b = "*");
            var d, e = 0, f = b.toLowerCase().match(E) || [];
            if (m.isFunction(c))
                while (d = f[e++])
                    "+" === d.charAt(0) ? (d = d.slice(1) || "*",
                        (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function Mc(a, b, c, d) {
        var e = {}
            , f = a === Ic;
        function g(h) {
            var i;
            return e[h] = !0,
                m.each(a[h] || [], function(a, h) {
                    var j = h(b, c, d);
                    return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
                        g(j),
                        !1)
                }),
                i
        }
        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }
    function Nc(a, b) {
        var c, d, e = m.ajaxSettings.flatOptions || {};
        for (d in b)
            void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && m.extend(!0, a, c),
            a
    }
    function Oc(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0])
            i.shift(),
            void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0]in c)
            f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f),
            c[f]) : void 0
    }
    function Pc(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b),
            !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
                i = f,
                f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f],
                        !g)
                        for (e in j)
                            if (h = e.split(" "),
                            h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
                                    k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a["throws"])
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (l) {
                                return {
                                    state: "parsererror",
                                    error: g ? l : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    m.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: zc,
            type: "GET",
            isLocal: Dc.test(yc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Jc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": m.parseJSON,
                "text xml": m.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a)
        },
        ajaxPrefilter: Lc(Hc),
        ajaxTransport: Lc(Ic),
        ajax: function(a, b) {
            "object" == typeof a && (b = a,
                a = void 0),
                b = b || {};
            var c, d, e, f, g, h, i, j, k = m.ajaxSetup({}, b), l = k.context || k, n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event, o = m.Deferred(), p = m.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === t) {
                        if (!j) {
                            j = {};
                            while (b = Cc.exec(f))
                                j[b[1].toLowerCase()] = b[2]
                        }
                        b = j[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === t ? f : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a,
                        r[a] = b),
                        this
                },
                overrideMimeType: function(a) {
                    return t || (k.mimeType = a),
                        this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (2 > t)
                            for (b in a)
                                q[b] = [q[b], a[b]];
                        else
                            v.always(a[v.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || u;
                    return i && i.abort(b),
                        x(0, b),
                        this
                }
            };
            if (o.promise(v).complete = p.add,
                v.success = v.done,
                v.error = v.fail,
                k.url = ((a || k.url || zc) + "").replace(Ac, "").replace(Fc, yc[1] + "//"),
                k.type = b.method || b.type || k.method || k.type,
                k.dataTypes = m.trim(k.dataType || "*").toLowerCase().match(E) || [""],
            null == k.crossDomain && (c = Gc.exec(k.url.toLowerCase()),
                k.crossDomain = !(!c || c[1] === yc[1] && c[2] === yc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (yc[3] || ("http:" === yc[1] ? "80" : "443")))),
            k.data && k.processData && "string" != typeof k.data && (k.data = m.param(k.data, k.traditional)),
                Mc(Hc, k, b, v),
            2 === t)
                return v;
            h = m.event && k.global,
            h && 0 === m.active++ && m.event.trigger("ajaxStart"),
                k.type = k.type.toUpperCase(),
                k.hasContent = !Ec.test(k.type),
                e = k.url,
            k.hasContent || (k.data && (e = k.url += (wc.test(e) ? "&" : "?") + k.data,
                delete k.data),
            k.cache === !1 && (k.url = Bc.test(e) ? e.replace(Bc, "$1_=" + vc++) : e + (wc.test(e) ? "&" : "?") + "_=" + vc++)),
            k.ifModified && (m.lastModified[e] && v.setRequestHeader("If-Modified-Since", m.lastModified[e]),
            m.etag[e] && v.setRequestHeader("If-None-Match", m.etag[e])),
            (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType),
                v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Jc + "; q=0.01" : "") : k.accepts["*"]);
            for (d in k.headers)
                v.setRequestHeader(d, k.headers[d]);
            if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t))
                return v.abort();
            u = "abort";
            for (d in {
                success: 1,
                error: 1,
                complete: 1
            })
                v[d](k[d]);
            if (i = Mc(Ic, k, b, v)) {
                v.readyState = 1,
                h && n.trigger("ajaxSend", [v, k]),
                k.async && k.timeout > 0 && (g = setTimeout(function() {
                    v.abort("timeout")
                }, k.timeout));
                try {
                    t = 1,
                        i.send(r, x)
                } catch (w) {
                    if (!(2 > t))
                        throw w;
                    x(-1, w)
                }
            } else
                x(-1, "No Transport");
            function x(a, b, c, d) {
                var j, r, s, u, w, x = b;
                2 !== t && (t = 2,
                g && clearTimeout(g),
                    i = void 0,
                    f = d || "",
                    v.readyState = a > 0 ? 4 : 0,
                    j = a >= 200 && 300 > a || 304 === a,
                c && (u = Oc(k, v, c)),
                    u = Pc(k, u, v, j),
                    j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"),
                    w && (m.lastModified[e] = w),
                        w = v.getResponseHeader("etag"),
                    w && (m.etag[e] = w)),
                        204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state,
                            r = u.data,
                            s = u.error,
                            j = !s)) : (s = x,
                    (a || !x) && (x = "error",
                    0 > a && (a = 0))),
                    v.status = a,
                    v.statusText = (b || x) + "",
                    j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]),
                    v.statusCode(q),
                    q = void 0,
                h && n.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]),
                    p.fireWith(l, [v, x]),
                h && (n.trigger("ajaxComplete", [v, k]),
                --m.active || m.event.trigger("ajaxStop")))
            }
            return v
        },
        getJSON: function(a, b, c) {
            return m.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return m.get(a, void 0, b, "script")
        }
    }),
        m.each(["get", "post"], function(a, b) {
            m[b] = function(a, c, d, e) {
                return m.isFunction(c) && (e = e || d,
                    d = c,
                    c = void 0),
                    m.ajax({
                        url: a,
                        type: b,
                        dataType: e,
                        data: c,
                        success: d
                    })
            }
        }),
        m._evalUrl = function(a) {
            return m.ajax({
                url: a,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }
        ,
        m.fn.extend({
            wrapAll: function(a) {
                if (m.isFunction(a))
                    return this.each(function(b) {
                        m(this).wrapAll(a.call(this, b))
                    });
                if (this[0]) {
                    var b = m(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]),
                        b.map(function() {
                            var a = this;
                            while (a.firstChild && 1 === a.firstChild.nodeType)
                                a = a.firstChild;
                            return a
                        }).append(this)
                }
                return this
            },
            wrapInner: function(a) {
                return this.each(m.isFunction(a) ? function(b) {
                        m(this).wrapInner(a.call(this, b))
                    }
                    : function() {
                        var b = m(this)
                            , c = b.contents();
                        c.length ? c.wrapAll(a) : b.append(a)
                    }
                )
            },
            wrap: function(a) {
                var b = m.isFunction(a);
                return this.each(function(c) {
                    m(this).wrapAll(b ? a.call(this, c) : a)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
                }).end()
            }
        }),
        m.expr.filters.hidden = function(a) {
            return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !k.reliableHiddenOffsets() && "none" === (a.style && a.style.display || m.css(a, "display"))
        }
        ,
        m.expr.filters.visible = function(a) {
            return !m.expr.filters.hidden(a)
        }
    ;
    var Qc = /%20/g
        , Rc = /\[\]$/
        , Sc = /\r?\n/g
        , Tc = /^(?:submit|button|image|reset|file)$/i
        , Uc = /^(?:input|select|textarea|keygen)/i;
    function Vc(a, b, c, d) {
        var e;
        if (m.isArray(b))
            m.each(b, function(b, e) {
                c || Rc.test(a) ? d(a, e) : Vc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== m.type(b))
            d(a, b);
        else
            for (e in b)
                Vc(a + "[" + e + "]", b[e], c, d)
    }
    m.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = m.isFunction(b) ? b() : null == b ? "" : b,
                d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional),
        m.isArray(a) || a.jquery && !m.isPlainObject(a))
            m.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                Vc(c, a[c], b, e);
        return d.join("&").replace(Qc, "+")
    }
        ,
        m.fn.extend({
            serialize: function() {
                return m.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var a = m.prop(this, "elements");
                    return a ? m.makeArray(a) : this
                }).filter(function() {
                    var a = this.type;
                    return this.name && !m(this).is(":disabled") && Uc.test(this.nodeName) && !Tc.test(a) && (this.checked || !W.test(a))
                }).map(function(a, b) {
                    var c = m(this).val();
                    return null == c ? null : m.isArray(c) ? m.map(c, function(a) {
                        return {
                            name: b.name,
                            value: a.replace(Sc, "\r\n")
                        }
                    }) : {
                        name: b.name,
                        value: c.replace(Sc, "\r\n")
                    }
                }).get()
            }
        }),
        m.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
                return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc() || $c()
            }
            : Zc;
    var Wc = 0
        , Xc = {}
        , Yc = m.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var a in Xc)
            Xc[a](void 0, !0)
    }),
        k.cors = !!Yc && "withCredentials"in Yc,
        Yc = k.ajax = !!Yc,
    Yc && m.ajaxTransport(function(a) {
        if (!a.crossDomain || k.cors) {
            var b;
            return {
                send: function(c, d) {
                    var e, f = a.xhr(), g = ++Wc;
                    if (f.open(a.type, a.url, a.async, a.username, a.password),
                        a.xhrFields)
                        for (e in a.xhrFields)
                            f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
                    a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c)
                        void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null),
                        b = function(c, e) {
                            var h, i, j;
                            if (b && (e || 4 === f.readyState))
                                if (delete Xc[g],
                                    b = void 0,
                                    f.onreadystatechange = m.noop,
                                    e)
                                    4 !== f.readyState && f.abort();
                                else {
                                    j = {},
                                        h = f.status,
                                    "string" == typeof f.responseText && (j.text = f.responseText);
                                    try {
                                        i = f.statusText
                                    } catch (k) {
                                        i = ""
                                    }
                                    h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                                }
                            j && d(h, i, j, f.getAllResponseHeaders())
                        }
                        ,
                        a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Xc[g] = b : b()
                },
                abort: function() {
                    b && b(void 0, !0)
                }
            }
        }
    });
    function Zc() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }
    function $c() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }
    m.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return m.globalEval(a),
                    a
            }
        }
    }),
        m.ajaxPrefilter("script", function(a) {
            void 0 === a.cache && (a.cache = !1),
            a.crossDomain && (a.type = "GET",
                a.global = !1)
        }),
        m.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var b, c = y.head || m("head")[0] || y.documentElement;
                return {
                    send: function(d, e) {
                        b = y.createElement("script"),
                            b.async = !0,
                        a.scriptCharset && (b.charset = a.scriptCharset),
                            b.src = a.url,
                            b.onload = b.onreadystatechange = function(a, c) {
                                (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null,
                                b.parentNode && b.parentNode.removeChild(b),
                                    b = null,
                                c || e(200, "success"))
                            }
                            ,
                            c.insertBefore(b, c.firstChild)
                    },
                    abort: function() {
                        b && b.onload(void 0, !0)
                    }
                }
            }
        });
    var _c = []
        , ad = /(=)\?(?=&|$)|\?\?/;
    m.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = _c.pop() || m.expando + "_" + vc++;
            return this[a] = !0,
                a
        }
    }),
        m.ajaxPrefilter("json jsonp", function(b, c, d) {
            var e, f, g, h = b.jsonp !== !1 && (ad.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ad.test(b.data) && "data");
            return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = m.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                h ? b[h] = b[h].replace(ad, "$1" + e) : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
                b.converters["script json"] = function() {
                    return g || m.error(e + " was not called"),
                        g[0]
                }
                ,
                b.dataTypes[0] = "json",
                f = a[e],
                a[e] = function() {
                    g = arguments
                }
                ,
                d.always(function() {
                    a[e] = f,
                    b[e] && (b.jsonpCallback = c.jsonpCallback,
                        _c.push(e)),
                    g && m.isFunction(f) && f(g[0]),
                        g = f = void 0
                }),
                "script") : void 0
        }),
        m.parseHTML = function(a, b, c) {
            if (!a || "string" != typeof a)
                return null;
            "boolean" == typeof b && (c = b,
                b = !1),
                b = b || y;
            var d = u.exec(a)
                , e = !c && [];
            return d ? [b.createElement(d[1])] : (d = m.buildFragment([a], b, e),
            e && e.length && m(e).remove(),
                m.merge([], d.childNodes))
        }
    ;
    var bd = m.fn.load;
    m.fn.load = function(a, b, c) {
        if ("string" != typeof a && bd)
            return bd.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = m.trim(a.slice(h, a.length)),
            a = a.slice(0, h)),
            m.isFunction(b) ? (c = b,
                b = void 0) : b && "object" == typeof b && (f = "POST"),
        g.length > 0 && m.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments,
                g.html(d ? m("<div>").append(m.parseHTML(a)).find(d) : a)
        }).complete(c && function(a, b) {
            g.each(c, e || [a.responseText, b, a])
        }
        ),
            this
    }
        ,
        m.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
            m.fn[b] = function(a) {
                return this.on(b, a)
            }
        }),
        m.expr.filters.animated = function(a) {
            return m.grep(m.timers, function(b) {
                return a === b.elem
            }).length
        }
    ;
    var cd = a.document.documentElement;
    function dd(a) {
        return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    m.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = m.css(a, "position"), l = m(a), n = {};
            "static" === k && (a.style.position = "relative"),
                h = l.offset(),
                f = m.css(a, "top"),
                i = m.css(a, "left"),
                j = ("absolute" === k || "fixed" === k) && m.inArray("auto", [f, i]) > -1,
                j ? (d = l.position(),
                    g = d.top,
                    e = d.left) : (g = parseFloat(f) || 0,
                    e = parseFloat(i) || 0),
            m.isFunction(b) && (b = b.call(a, c, h)),
            null != b.top && (n.top = b.top - h.top + g),
            null != b.left && (n.left = b.left - h.left + e),
                "using"in b ? b.using.call(a, n) : l.css(n)
        }
    },
        m.fn.extend({
            offset: function(a) {
                if (arguments.length)
                    return void 0 === a ? this : this.each(function(b) {
                        m.offset.setOffset(this, a, b)
                    });
                var b, c, d = {
                    top: 0,
                    left: 0
                }, e = this[0], f = e && e.ownerDocument;
                if (f)
                    return b = f.documentElement,
                        m.contains(b, e) ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()),
                            c = dd(f),
                            {
                                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                            }) : d
            },
            position: function() {
                if (this[0]) {
                    var a, b, c = {
                        top: 0,
                        left: 0
                    }, d = this[0];
                    return "fixed" === m.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(),
                        b = this.offset(),
                    m.nodeName(a[0], "html") || (c = a.offset()),
                        c.top += m.css(a[0], "borderTopWidth", !0),
                        c.left += m.css(a[0], "borderLeftWidth", !0)),
                        {
                            top: b.top - c.top - m.css(d, "marginTop", !0),
                            left: b.left - c.left - m.css(d, "marginLeft", !0)
                        }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    var a = this.offsetParent || cd;
                    while (a && !m.nodeName(a, "html") && "static" === m.css(a, "position"))
                        a = a.offsetParent;
                    return a || cd
                })
            }
        }),
        m.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(a, b) {
            var c = /Y/.test(b);
            m.fn[a] = function(d) {
                return V(this, function(a, d, e) {
                    var f = dd(a);
                    return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop()) : a[d] = e)
                }, a, d, arguments.length, null)
            }
        }),
        m.each(["top", "left"], function(a, b) {
            m.cssHooks[b] = Lb(k.pixelPosition, function(a, c) {
                return c ? (c = Jb(a, b),
                    Hb.test(c) ? m(a).position()[b] + "px" : c) : void 0
            })
        }),
        m.each({
            Height: "height",
            Width: "width"
        }, function(a, b) {
            m.each({
                padding: "inner" + a,
                content: b,
                "": "outer" + a
            }, function(c, d) {
                m.fn[d] = function(d, e) {
                    var f = arguments.length && (c || "boolean" != typeof d)
                        , g = c || (d === !0 || e === !0 ? "margin" : "border");
                    return V(this, function(b, c, d) {
                        var e;
                        return m.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement,
                            Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g)
                    }, b, f ? d : void 0, f, null)
                }
            })
        }),
        m.fn.size = function() {
            return this.length
        }
        ,
        m.fn.andSelf = m.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return m
    });
    var ed = a.jQuery
        , fd = a.$;
    return m.noConflict = function(b) {
        return a.$ === m && (a.$ = fd),
        b && a.jQuery === m && (a.jQuery = ed),
            m
    }
        ,
    typeof b === K && (a.jQuery = a.$ = m),
        m
});
/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute === void 0 && (jQuery.migrateMute = !0),
    function(e, t, n) {
        function r(n) {
            var r = t.console;
            i[n] || (i[n] = !0,
                e.migrateWarnings.push(n),
            r && r.warn && !e.migrateMute && (r.warn("JQMIGRATE: " + n),
            e.migrateTrace && r.trace && r.trace()))
        }
        function a(t, a, i, o) {
            if (Object.defineProperty)
                try {
                    return Object.defineProperty(t, a, {
                        configurable: !0,
                        enumerable: !0,
                        get: function() {
                            return r(o),
                                i
                        },
                        set: function(e) {
                            r(o),
                                i = e
                        }
                    }),
                        n
                } catch (s) {}
            e._definePropertyBroken = !0,
                t[a] = i
        }
        var i = {};
        e.migrateWarnings = [],
        !e.migrateMute && t.console && t.console.log && t.console.log("JQMIGRATE: Logging is active"),
        e.migrateTrace === n && (e.migrateTrace = !0),
            e.migrateReset = function() {
                i = {},
                    e.migrateWarnings.length = 0
            }
            ,
        "BackCompat" === document.compatMode && r("jQuery is not compatible with Quirks Mode");
        var o = e("<input/>", {
            size: 1
        }).attr("size") && e.attrFn
            , s = e.attr
            , u = e.attrHooks.value && e.attrHooks.value.get || function() {
            return null
        }
            , c = e.attrHooks.value && e.attrHooks.value.set || function() {
            return n
        }
            , l = /^(?:input|button)$/i
            , d = /^[238]$/
            , p = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i
            , f = /^(?:checked|selected)$/i;
        a(e, "attrFn", o || {}, "jQuery.attrFn is deprecated"),
            e.attr = function(t, a, i, u) {
                var c = a.toLowerCase()
                    , g = t && t.nodeType;
                return u && (4 > s.length && r("jQuery.fn.attr( props, pass ) is deprecated"),
                t && !d.test(g) && (o ? a in o : e.isFunction(e.fn[a]))) ? e(t)[a](i) : ("type" === a && i !== n && l.test(t.nodeName) && t.parentNode && r("Can't change the 'type' of an input or button in IE 6/7/8"),
                !e.attrHooks[c] && p.test(c) && (e.attrHooks[c] = {
                    get: function(t, r) {
                        var a, i = e.prop(t, r);
                        return i === !0 || "boolean" != typeof i && (a = t.getAttributeNode(r)) && a.nodeValue !== !1 ? r.toLowerCase() : n
                    },
                    set: function(t, n, r) {
                        var a;
                        return n === !1 ? e.removeAttr(t, r) : (a = e.propFix[r] || r,
                        a in t && (t[a] = !0),
                            t.setAttribute(r, r.toLowerCase())),
                            r
                    }
                },
                f.test(c) && r("jQuery.fn.attr('" + c + "') may use property instead of attribute")),
                    s.call(e, t, a, i))
            }
            ,
            e.attrHooks.value = {
                get: function(e, t) {
                    var n = (e.nodeName || "").toLowerCase();
                    return "button" === n ? u.apply(this, arguments) : ("input" !== n && "option" !== n && r("jQuery.fn.attr('value') no longer gets properties"),
                        t in e ? e.value : null)
                },
                set: function(e, t) {
                    var a = (e.nodeName || "").toLowerCase();
                    return "button" === a ? c.apply(this, arguments) : ("input" !== a && "option" !== a && r("jQuery.fn.attr('value', val) no longer sets properties"),
                        e.value = t,
                        n)
                }
            };
        var g, h, v = e.fn.init, m = e.parseJSON, y = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
        e.fn.init = function(t, n, a) {
            var i;
            return t && "string" == typeof t && !e.isPlainObject(n) && (i = y.exec(e.trim(t))) && i[0] && ("<" !== t.charAt(0) && r("$(html) HTML strings must start with '<' character"),
            i[3] && r("$(html) HTML text after last tag is ignored"),
            "#" === i[0].charAt(0) && (r("HTML string cannot start with a '#' character"),
                e.error("JQMIGRATE: Invalid selector string (XSS)")),
            n && n.context && (n = n.context),
                e.parseHTML) ? v.call(this, e.parseHTML(i[2], n, !0), n, a) : v.apply(this, arguments)
        }
            ,
            e.fn.init.prototype = e.fn,
            e.parseJSON = function(e) {
                return e || null === e ? m.apply(this, arguments) : (r("jQuery.parseJSON requires a valid JSON string"),
                    null)
            }
            ,
            e.uaMatch = function(e) {
                e = e.toLowerCase();
                var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
                return {
                    browser: t[1] || "",
                    version: t[2] || "0"
                }
            }
            ,
        e.browser || (g = e.uaMatch(navigator.userAgent),
            h = {},
        g.browser && (h[g.browser] = !0,
            h.version = g.version),
            h.chrome ? h.webkit = !0 : h.webkit && (h.safari = !0),
            e.browser = h),
            a(e, "browser", e.browser, "jQuery.browser is deprecated"),
            e.sub = function() {
                function t(e, n) {
                    return new t.fn.init(e,n)
                }
                e.extend(!0, t, this),
                    t.superclass = this,
                    t.fn = t.prototype = this(),
                    t.fn.constructor = t,
                    t.sub = this.sub,
                    t.fn.init = function(r, a) {
                        return a && a instanceof e && !(a instanceof t) && (a = t(a)),
                            e.fn.init.call(this, r, a, n)
                    }
                    ,
                    t.fn.init.prototype = t.fn;
                var n = t(document);
                return r("jQuery.sub() is deprecated"),
                    t
            }
            ,
            e.ajaxSetup({
                converters: {
                    "text json": e.parseJSON
                }
            });
        var b = e.fn.data;
        e.fn.data = function(t) {
            var a, i, o = this[0];
            return !o || "events" !== t || 1 !== arguments.length || (a = e.data(o, t),
                i = e._data(o, t),
            a !== n && a !== i || i === n) ? b.apply(this, arguments) : (r("Use of jQuery.fn.data('events') is deprecated"),
                i)
        }
        ;
        var j = /\/(java|ecma)script/i
            , w = e.fn.andSelf || e.fn.addBack;
        e.fn.andSelf = function() {
            return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),
                w.apply(this, arguments)
        }
            ,
        e.clean || (e.clean = function(t, a, i, o) {
                a = a || document,
                    a = !a.nodeType && a[0] || a,
                    a = a.ownerDocument || a,
                    r("jQuery.clean() is deprecated");
                var s, u, c, l, d = [];
                if (e.merge(d, e.buildFragment(t, a).childNodes),
                    i)
                    for (c = function(e) {
                        return !e.type || j.test(e.type) ? o ? o.push(e.parentNode ? e.parentNode.removeChild(e) : e) : i.appendChild(e) : n
                    }
                             ,
                             s = 0; null != (u = d[s]); s++)
                        e.nodeName(u, "script") && c(u) || (i.appendChild(u),
                        u.getElementsByTagName !== n && (l = e.grep(e.merge([], u.getElementsByTagName("script")), c),
                            d.splice.apply(d, [s + 1, 0].concat(l)),
                            s += l.length));
                return d
            }
        );
        var Q = e.event.add
            , x = e.event.remove
            , k = e.event.trigger
            , N = e.fn.toggle
            , T = e.fn.live
            , M = e.fn.die
            , S = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess"
            , C = RegExp("\\b(?:" + S + ")\\b")
            , H = /(?:^|\s)hover(\.\S+|)\b/
            , A = function(t) {
            return "string" != typeof t || e.event.special.hover ? t : (H.test(t) && r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),
            t && t.replace(H, "mouseenter$1 mouseleave$1"))
        };
        e.event.props && "attrChange" !== e.event.props[0] && e.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"),
        e.event.dispatch && a(e.event, "handle", e.event.dispatch, "jQuery.event.handle is undocumented and deprecated"),
            e.event.add = function(e, t, n, a, i) {
                e !== document && C.test(t) && r("AJAX events should be attached to document: " + t),
                    Q.call(this, e, A(t || ""), n, a, i)
            }
            ,
            e.event.remove = function(e, t, n, r, a) {
                x.call(this, e, A(t) || "", n, r, a)
            }
            ,
            e.fn.error = function() {
                var e = Array.prototype.slice.call(arguments, 0);
                return r("jQuery.fn.error() is deprecated"),
                    e.splice(0, 0, "error"),
                    arguments.length ? this.bind.apply(this, e) : (this.triggerHandler.apply(this, e),
                        this)
            }
            ,
            e.fn.toggle = function(t, n) {
                if (!e.isFunction(t) || !e.isFunction(n))
                    return N.apply(this, arguments);
                r("jQuery.fn.toggle(handler, handler...) is deprecated");
                var a = arguments
                    , i = t.guid || e.guid++
                    , o = 0
                    , s = function(n) {
                    var r = (e._data(this, "lastToggle" + t.guid) || 0) % o;
                    return e._data(this, "lastToggle" + t.guid, r + 1),
                        n.preventDefault(),
                    a[r].apply(this, arguments) || !1
                };
                for (s.guid = i; a.length > o; )
                    a[o++].guid = i;
                return this.click(s)
            }
            ,
            e.fn.live = function(t, n, a) {
                return r("jQuery.fn.live() is deprecated"),
                    T ? T.apply(this, arguments) : (e(this.context).on(t, this.selector, n, a),
                        this)
            }
            ,
            e.fn.die = function(t, n) {
                return r("jQuery.fn.die() is deprecated"),
                    M ? M.apply(this, arguments) : (e(this.context).off(t, this.selector || "**", n),
                        this)
            }
            ,
            e.event.trigger = function(e, t, n, a) {
                return n || C.test(e) || r("Global events are undocumented and deprecated"),
                    k.call(this, e, t, n || document, a)
            }
            ,
            e.each(S.split("|"), function(t, n) {
                e.event.special[n] = {
                    setup: function() {
                        var t = this;
                        return t !== document && (e.event.add(document, n + "." + e.guid, function() {
                            e.event.trigger(n, null, t, !0)
                        }),
                            e._data(this, n, e.guid++)),
                            !1
                    },
                    teardown: function() {
                        return this !== document && e.event.remove(document, n + "." + e._data(this, n)),
                            !1
                    }
                }
            })
    }(jQuery, window);
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2009                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};
// Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
    // use regular expressions & String.replace callback function for better efficiency
    // than procedural approaches
    var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        });
    strUtf = strUtf.replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        });
    return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
    var strUni = strUtf.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
        function(c) {
            // (note parentheses for precence)
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
        });
    strUni = strUni.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
        function(c) {
            // (note parentheses for precence)
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
        });
    return strUni;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2009                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};
// Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */
Base64.encode = function(str, utf8encode) {
    // http://tools.ietf.org/html/rfc4648
    utf8encode = (typeof utf8encode == 'undefined') ? false : utf8encode;
    var o1, o2, o3, bits, h1, h2, h3, h4, e = [], pad = '', c, plain, coded;
    var b64 = Base64.code;

    plain = utf8encode ? Utf8.encode(str) : str;

    c = plain.length % 3;
    // pad string to length of multiple of 3
    if (c > 0) {
        while (c++ < 3) {
            pad += '=';
            plain += '\0';
        }
    }
    // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

    for (c = 0; c < plain.length; c += 3) {
        // pack three octets into four hexets
        o1 = plain.charCodeAt(c);
        o2 = plain.charCodeAt(c + 1);
        o3 = plain.charCodeAt(c + 2);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hextets to index into code string
        e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    }
    coded = e.join('');
    // join() is far faster than repeated string concatenation in IE

    // replace 'A's from padded nulls with '='s
    coded = coded.slice(0, coded.length - pad.length) + pad;

    return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */
Base64.decode = function(str, utf8decode) {
    utf8decode = (typeof utf8decode == 'undefined') ? false : utf8decode;
    var o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain, coded;
    var b64 = Base64.code;

    coded = utf8decode ? Utf8.decode(str) : str;

    for (var c = 0; c < coded.length; c += 4) {
        // unpack four hexets into three octets
        h1 = b64.indexOf(coded.charAt(c));
        h2 = b64.indexOf(coded.charAt(c + 1));
        h3 = b64.indexOf(coded.charAt(c + 2));
        h4 = b64.indexOf(coded.charAt(c + 3));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >>> 16 & 0xff;
        o2 = bits >>> 8 & 0xff;
        o3 = bits & 0xff;

        d[c / 4] = String.fromCharCode(o1, o2, o3);
        // check for padding
        if (h4 == 0x40)
            d[c / 4] = String.fromCharCode(o1, o2);
        if (h3 == 0x40)
            d[c / 4] = String.fromCharCode(o1);
    }
    plain = d.join('');
    // join() is far faster than repeated string concatenation in IE

    return utf8decode ? Utf8.decode(plain) : plain;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
            // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}
;
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2010                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Aes = {};
// Aes namespace

/**
 * AES Cipher function: encrypt 'input' state with Rijndael algorithm
 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
 *
 * @param {Number[]} input 16-byte (128-bit) input state array
 * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
 * @returns {Number[]}     Encrypted output state array
 */
Aes.Cipher = function(input, w) {
    // main Cipher function [§5.1]
    var Nb = 4;
    // block size (in words): no of columns in state (fixed at 4 for AES)
    var Nr = w.length / Nb - 1;
    // no of rounds: 10/12/14 for 128/192/256-bit keys

    var state = [[], [], [], []];
    // initialise 4xNb byte-array 'state' with input [§3.4]
    for (var i = 0; i < 4 * Nb; i++)
        state[i % 4][Math.floor(i / 4)] = input[i];

    state = Aes.AddRoundKey(state, w, 0, Nb);

    for (var round = 1; round < Nr; round++) {
        state = Aes.SubBytes(state, Nb);
        state = Aes.ShiftRows(state, Nb);
        state = Aes.MixColumns(state, Nb);
        state = Aes.AddRoundKey(state, w, round, Nb);
    }

    state = Aes.SubBytes(state, Nb);
    state = Aes.ShiftRows(state, Nb);
    state = Aes.AddRoundKey(state, w, Nr, Nb);

    var output = new Array(4 * Nb);
    // convert state to 1-d array before returning [§3.4]
    for (var i = 0; i < 4 * Nb; i++)
        output[i] = state[i % 4][Math.floor(i / 4)];
    return output;
}

/**
 * Perform Key Expansion to generate a Key Schedule
 *
 * @param {Number[]} key Key as 16/24/32-byte array
 * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
 */
Aes.KeyExpansion = function(key) {
    // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
    var Nb = 4;
    // block size (in words): no of columns in state (fixed at 4 for AES)
    var Nk = key.length / 4
    // key length (in words): 4/6/8 for 128/192/256-bit keys
    var Nr = Nk + 6;
    // no of rounds: 10/12/14 for 128/192/256-bit keys

    var w = new Array(Nb * (Nr + 1));
    var temp = new Array(4);

    for (var i = 0; i < Nk; i++) {
        var r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
        w[i] = r;
    }

    for (var i = Nk; i < (Nb * (Nr + 1)); i++) {
        w[i] = new Array(4);
        for (var t = 0; t < 4; t++)
            temp[t] = w[i - 1][t];
        if (i % Nk == 0) {
            temp = Aes.SubWord(Aes.RotWord(temp));
            for (var t = 0; t < 4; t++)
                temp[t] ^= Aes.Rcon[i / Nk][t];
        } else if (Nk > 6 && i % Nk == 4) {
            temp = Aes.SubWord(temp);
        }
        for (var t = 0; t < 4; t++)
            w[i][t] = w[i - Nk][t] ^ temp[t];
    }

    return w;
}

/*
 * ---- remaining routines are private, not called externally ----
 */

Aes.SubBytes = function(s, Nb) {
    // apply SBox to state S [§5.1.1]
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < Nb; c++)
            s[r][c] = Aes.Sbox[s[r][c]];
    }
    return s;
}

Aes.ShiftRows = function(s, Nb) {
    // shift row r of state S left by r bytes [§5.1.2]
    var t = new Array(4);
    for (var r = 1; r < 4; r++) {
        for (var c = 0; c < 4; c++)
            t[c] = s[r][(c + r) % Nb];
        // shift into temp copy
        for (var c = 0; c < 4; c++)
            s[r][c] = t[c];
        // and copy back
    }
    // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
    return s;
    // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}

Aes.MixColumns = function(s, Nb) {
    // combine bytes of each col of state S [§5.1.3]
    for (var c = 0; c < 4; c++) {
        var a = new Array(4);
        // 'a' is a copy of the current column from 's'
        var b = new Array(4);
        // 'b' is a•{02} in GF(2^8)
        for (var i = 0; i < 4; i++) {
            a[i] = s[i][c];
            b[i] = s[i][c] & 0x80 ? s[i][c] << 1 ^ 0x011b : s[i][c] << 1;
        }
        // a[n] ^ b[n] is a•{03} in GF(2^8)
        s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
        // 2*a0 + 3*a1 + a2 + a3
        s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
        // a0 * 2*a1 + 3*a2 + a3
        s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
        // a0 + a1 + 2*a2 + 3*a3
        s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
        // 3*a0 + a1 + a2 + 2*a3
    }
    return s;
}

Aes.AddRoundKey = function(state, w, rnd, Nb) {
    // xor Round Key into state S [§5.1.4]
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < Nb; c++)
            state[r][c] ^= w[rnd * 4 + c][r];
    }
    return state;
}

Aes.SubWord = function(w) {
    // apply SBox to 4-byte word w
    for (var i = 0; i < 4; i++)
        w[i] = Aes.Sbox[w[i]];
    return w;
}

Aes.RotWord = function(w) {
    // rotate 4-byte word w left by one byte
    var tmp = w[0];
    for (var i = 0; i < 3; i++)
        w[i] = w[i + 1];
    w[3] = tmp;
    return w;
}

// Sbox is pre-computed multiplicative inverse in GF(2^8) used in SubBytes and KeyExpansion [§5.1.1]
Aes.Sbox = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];

// Rcon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
Aes.Rcon = [[0x00, 0x00, 0x00, 0x00], [0x01, 0x00, 0x00, 0x00], [0x02, 0x00, 0x00, 0x00], [0x04, 0x00, 0x00, 0x00], [0x08, 0x00, 0x00, 0x00], [0x10, 0x00, 0x00, 0x00], [0x20, 0x00, 0x00, 0x00], [0x40, 0x00, 0x00, 0x00], [0x80, 0x00, 0x00, 0x00], [0x1b, 0x00, 0x00, 0x00], [0x36, 0x00, 0x00, 0x00]];

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2009                      */
/*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var AesCtr = {};
// AesCtr namespace

/**
 * Encrypt a text using AES encryption in Counter mode of operation
 *
 * Unicode multi-byte character safe
 *
 * @param {String} plaintext Source text to be encrypted
 * @param {String} password  The password to use to generate a key
 * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
 * @returns {string}         Encrypted text
 */
AesCtr.encrypt = function(plaintext, password, nBits) {
    var blockSize = 16;
    // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
    if (!(nBits == 128 || nBits == 192 || nBits == 256))
        return '';
    // standard allows 128/192/256 bit keys
    plaintext = Utf8.encode(plaintext);
    password = Utf8.encode(password);
    //var t = new Date();  // timer

    // use AES itself to encrypt password to get cipher key (using plain password as source for key
    // expansion) - gives us well encrypted key
    var nBytes = nBits / 8;
    // no bytes in key
    var pwBytes = new Array(nBytes);
    for (var i = 0; i < nBytes; i++) {
        pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
    }
    var key = Aes.Cipher(pwBytes, Aes.KeyExpansion(pwBytes));
    // gives us 16-byte key
    key = key.concat(key.slice(0, nBytes - 16));
    // expand key to 16/24/32 bytes long

    // initialise counter block (NIST SP800-38A §B.2): millisecond time-stamp for nonce in 1st 8 bytes,
    // block counter in 2nd 8 bytes
    var counterBlock = new Array(blockSize);
    var nonce = (new Date()).getTime();
    // timestamp: milliseconds since 1-Jan-1970
    var nonceSec = Math.floor(nonce / 1000);
    var nonceMs = nonce % 1000;
    // encode nonce with seconds in 1st 4 bytes, and (repeated) ms part filling 2nd 4 bytes
    for (var i = 0; i < 4; i++)
        counterBlock[i] = (nonceSec >>> i * 8) & 0xff;
    for (var i = 0; i < 4; i++)
        counterBlock[i + 4] = nonceMs & 0xff;
    // and convert it to a string to go on the front of the ciphertext
    var ctrTxt = '';
    for (var i = 0; i < 8; i++)
        ctrTxt += String.fromCharCode(counterBlock[i]);

    // generate key schedule - an expansion of the key into distinct Key Rounds for each round
    var keySchedule = Aes.KeyExpansion(key);

    var blockCount = Math.ceil(plaintext.length / blockSize);
    var ciphertxt = new Array(blockCount);
    // ciphertext as array of strings

    for (var b = 0; b < blockCount; b++) {
        // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
        // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
        for (var c = 0; c < 4; c++)
            counterBlock[15 - c] = (b >>> c * 8) & 0xff;
        for (var c = 0; c < 4; c++)
            counterBlock[15 - c - 4] = (b / 0x100000000 >>> c * 8)

        var cipherCntr = Aes.Cipher(counterBlock, keySchedule);
        // -- encrypt counter block --

        // block size is reduced on final block
        var blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
        var cipherChar = new Array(blockLength);

        for (var i = 0; i < blockLength; i++) {
            // -- xor plaintext with ciphered counter char-by-char --
            cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
            cipherChar[i] = String.fromCharCode(cipherChar[i]);
        }
        ciphertxt[b] = cipherChar.join('');
    }

    // Array.join is more efficient than repeated string concatenation in IE
    var ciphertext = ctrTxt + ciphertxt.join('');
    ciphertext = Base64.encode(ciphertext);
    // encode in base64

    //alert((new Date()) - t);
    return ciphertext;
}
;

/**
 * Decrypt a text encrypted by AES in counter mode of operation
 *
 * @param {String} ciphertext Source text to be encrypted
 * @param {String} password   The password to use to generate a key
 * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
 * @returns {String}          Decrypted text
 */
AesCtr.decrypt = function(ciphertext, password, nBits) {
    var blockSize = 16;
    // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
    if (!(nBits == 128 || nBits == 192 || nBits == 256))
        return '';
    // standard allows 128/192/256 bit keys
    ciphertext = Base64.decode(ciphertext);
    //  var ct = "ciphertext:";
    //  for(var i=0;i<ciphertext.length;i++)
    //  {
    //    ct+=ciphertext.charCodeAt(i)+",";
    //  }
    //  alert(ct);
    //  alert(ciphertext.length);
    password = Utf8.encode(password);
    //  var ct = "password:";
    //  for(var i=0;i<password.length;i++)
    //  {
    //    ct+=password.charCodeAt(i).toString(16)+",";
    //  }
    //  alert(ct);

    //var t = new Date();  // timer

    // use AES to encrypt password (mirroring encrypt routine)
    var nBytes = nBits / 8;
    // no bytes in key
    var pwBytes = new Array(nBytes);
    for (var i = 0; i < nBytes; i++) {
        pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
    }

    var key = Aes.Cipher(pwBytes, Aes.KeyExpansion(pwBytes));
    key = key.concat(key.slice(0, nBytes - 16));
    // expand key to 16/24/32 bytes long

    //alert("key:"+key);
    // recover nonce from 1st 8 bytes of ciphertext
    var counterBlock = new Array(8);
    ctrTxt = ciphertext.slice(0, 8);
    for (var i = 0; i < 8; i++)
        counterBlock[i] = ctrTxt.charCodeAt(i);

    // generate key schedule
    var keySchedule = Aes.KeyExpansion(key);

    // separate ciphertext into blocks (skipping past initial 8 bytes)
    var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
    var ct = new Array(nBlocks);
    for (var b = 0; b < nBlocks; b++)
        ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
    ciphertext = ct;
    // ciphertext is now array of block-length strings

    // plaintext will get generated block-by-block into array of block-length strings
    var plaintxt = new Array(ciphertext.length);

    for (var b = 0; b < nBlocks; b++) {
        // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
        for (var c = 0; c < 4; c++)
            counterBlock[15 - c] = ((b) >>> c * 8) & 0xff;
        for (var c = 0; c < 4; c++)
            counterBlock[15 - c - 4] = (((b + 1) / 0x100000000 - 1) >>> c * 8) & 0xff;

        //alert("counterBlock:"+counterBlock);
        var cipherCntr = Aes.Cipher(counterBlock, keySchedule);
        // encrypt counter block
        //alert("cipherCntr:"+cipherCntr);

        var plaintxtByte = new Array(ciphertext[b].length);
        for (var i = 0; i < ciphertext[b].length; i++) {
            // -- xor plaintxt with ciphered counter byte-by-byte --
            plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
            plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
        }
        plaintxt[b] = plaintxtByte.join('');
    }

    // join array of blocks into single plaintext string
    var plaintext = plaintxt.join('');
    plaintext = Utf8.decode(plaintext);
    // decode from UTF8 back to Unicode multi-byte chars

    //alert((new Date()) - t);
    return plaintext;
}
;

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*! jQuery JSON plugin 2.4.0 | code.google.com/p/jquery-json */
(function($) {
    'use strict';
    var escape = /["\\\x00-\x1f\x7f-\x9f]/g
        , meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }
        , hasOwn = Object.prototype.hasOwnProperty;
    $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function(o) {
        if (o === null) {
            return 'null';
        }
        var pairs, k, name, val, type = $.type(o);
        if (type === 'undefined') {
            return undefined;
        }
        if (type === 'number' || type === 'boolean') {
            return String(o);
        }
        if (type === 'string') {
            return $.quoteString(o);
        }
        if (typeof o.toJSON === 'function') {
            return $.toJSON(o.toJSON());
        }
        if (type === 'date') {
            var month = o.getUTCMonth() + 1
                , day = o.getUTCDate()
                , year = o.getUTCFullYear()
                , hours = o.getUTCHours()
                , minutes = o.getUTCMinutes()
                , seconds = o.getUTCSeconds()
                , milli = o.getUTCMilliseconds();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            if (milli < 100) {
                milli = '0' + milli;
            }
            if (milli < 10) {
                milli = '0' + milli;
            }
            return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
        }
        pairs = [];
        if ($.isArray(o)) {
            for (k = 0; k < o.length; k++) {
                pairs.push($.toJSON(o[k]) || 'null');
            }
            return '[' + pairs.join(',') + ']';
        }
        if (typeof o === 'object') {
            for (k in o) {
                if (hasOwn.call(o, k)) {
                    type = typeof k;
                    if (type === 'number') {
                        name = '"' + k + '"';
                    } else if (type === 'string') {
                        name = $.quoteString(k);
                    } else {
                        continue;
                    }
                    type = typeof o[k];
                    if (type !== 'function' && type !== 'undefined') {
                        val = $.toJSON(o[k]);
                        pairs.push(name + ':' + val);
                    }
                }
            }
            return '{' + pairs.join(',') + '}';
        }
    }
    ;
    $.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(str) {
        return eval('(' + str + ')');
    }
    ;
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(str) {
        var filtered = str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval('(' + str + ')');
        }
        throw new SyntaxError('Error parsing JSON, source is not valid.');
    }
    ;
    $.quoteString = function(str) {
        if (str.match(escape)) {
            return '"' + str.replace(escape, function(a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + str + '"';
    }
    ;
}(jQuery));

/*!
 * jQuery Form Plugin
 * version: 2.65 (09-MAR-2011)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

        /*
        Usage Note:
        -----------
        Do not use both ajaxSubmit and ajaxForm on the same form.  These
        functions are intended to be exclusive.  Use ajaxSubmit if you want
        to bind your own submit handler to the form.  For example,

        $(document).ready(function() {
            $('#myForm').bind('submit', function(e) {
                e.preventDefault(); // <-- important
                $(this).ajaxSubmit({
                    target: '#output'
                });
            });
        });

        Use ajaxForm when you want the plugin to manage all the event binding
        for you.  For example,

        $(document).ready(function() {
            $('#myForm').ajaxForm({
                target: '#output'
            });
        });

        When using ajaxForm, the ajaxSubmit function will be invoked for you
        at the appropriate time.
    */

        /**
         * ajaxSubmit() provides a mechanism for immediately submitting
         * an HTML form using AJAX.
         */
        $.fn.ajaxSubmit = function(options) {
            // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
            if (!this.length) {
                log('ajaxSubmit: skipping submit process - no element selected');
                return this;
            }

            if (typeof options == 'function') {
                options = {
                    success: options
                };
            }

            var action = this.attr('action');
            var url = (typeof action === 'string') ? $.trim(action) : '';
            if (url) {
                // clean url (don't include hash vaue)
                url = (url.match(/^([^#]+)/) || [])[1];
            }
            url = url || window.location.href || '';

            options = $.extend(true, {
                url: url,
                type: this[0].getAttribute('method') || 'GET',
                // IE7 massage (see issue 57)
                iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
            }, options);

            // hook for manipulating the form data before it is extracted;
            // convenient for use with rich editors like tinyMCE or FCKEditor
            var veto = {};
            this.trigger('form-pre-serialize', [this, options, veto]);
            if (veto.veto) {
                log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
                return this;
            }

            // provide opportunity to alter form data before it is serialized
            if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
                log('ajaxSubmit: submit aborted via beforeSerialize callback');
                return this;
            }

            var n, v, a = this.formToArray(options.semantic);
            if (options.data) {
                options.extraData = options.data;
                for (n in options.data) {
                    if (options.data[n]instanceof Array) {
                        for (var k in options.data[n]) {
                            a.push({
                                name: n,
                                value: options.data[n][k]
                            });
                        }
                    } else {
                        v = options.data[n];
                        v = $.isFunction(v) ? v() : v;
                        // if value is fn, invoke it
                        a.push({
                            name: n,
                            value: v
                        });
                    }
                }
            }

            // give pre-submit callback an opportunity to abort the submit
            if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
                log('ajaxSubmit: submit aborted via beforeSubmit callback');
                return this;
            }

            // fire vetoable 'validate' event
            this.trigger('form-submit-validate', [a, this, options, veto]);
            if (veto.veto) {
                log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
                return this;
            }

            var q = $.param(a);

            if (options.type.toUpperCase() == 'GET') {
                options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
                options.data = null;
                // data is null for 'get'
            } else {
                options.data = q;
                // data is the query string for 'post'
            }

            var $form = this
                , callbacks = [];
            if (options.resetForm) {
                callbacks.push(function() {
                    $form.resetForm();
                });
            }
            if (options.clearForm) {
                callbacks.push(function() {
                    $form.clearForm();
                });
            }

            // perform a load on the target only if dataType is not provided
            if (!options.dataType && options.target) {
                var oldSuccess = options.success || function() {}
                ;
                callbacks.push(function(data) {
                    var fn = options.replaceTarget ? 'replaceWith' : 'html';
                    $(options.target)[fn](data).each(oldSuccess, arguments);
                });
            } else if (options.success) {
                callbacks.push(options.success);
            }

            options.success = function(data, status, xhr) {
                // jQuery 1.4+ passes xhr as 3rd arg
                var context = options.context || options;
                // jQuery 1.4+ supports scope context
                for (var i = 0, max = callbacks.length; i < max; i++) {
                    callbacks[i].apply(context, [data, status, xhr || $form, $form]);
                }
            }
            ;

            // are there files to upload?
            var fileInputs = $('input:file', this).length > 0;
            var mp = 'multipart/form-data';
            var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

            // options.iframe allows user to force iframe mode
            // 06-NOV-09: now defaulting to iframe mode if file input is detected
            if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
                // hack to fix Safari hang (thanks to Tim Molendijk for this)
                // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
                if (options.closeKeepAlive) {
                    $.get(options.closeKeepAlive, fileUpload);
                } else {
                    fileUpload();
                }
            } else {
                $.ajax(options);
            }

            // fire 'notify' event
            this.trigger('form-submit-notify', [this, options]);
            return this;

            // private function for handling file uploads (hat tip to YAHOO!)
            function fileUpload() {
                var form = $form[0];

                if ($(':input[name=submit],:input[id=submit]', form).length) {
                    // if there is an input with a name or id of 'submit' then we won't be
                    // able to invoke the submit fn on the form (at least not x-browser)
                    alert('Error: Form elements must not have name or id of "submit".');
                    return;
                }

                var s = $.extend(true, {}, $.ajaxSettings, options);
                s.context = s.context || s;
                var id = 'jqFormIO' + (new Date().getTime())
                    , fn = '_' + id;
                var $io = $('<iframe id="' + id + '" name="' + id + '" src="' + s.iframeSrc + '" />');
                var io = $io[0];

                $io.css({
                    position: 'absolute',
                    top: '-1000px',
                    left: '-1000px'
                });

                var xhr = {
                    // mock object
                    aborted: 0,
                    responseText: null,
                    responseXML: null,
                    status: 0,
                    statusText: 'n/a',
                    getAllResponseHeaders: function() {},
                    getResponseHeader: function() {},
                    setRequestHeader: function() {},
                    abort: function() {
                        this.aborted = 1;
                        $io.attr('src', s.iframeSrc);
                        // abort op in progress
                    }
                };

                var g = s.global;
                // trigger ajax global events so that activity/block indicators work like normal
                if (g && !$.active++) {
                    $.event.trigger("ajaxStart");
                }
                if (g) {
                    $.event.trigger("ajaxSend", [xhr, s]);
                }

                if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
                    if (s.global) {
                        $.active--;
                    }
                    return;
                }
                if (xhr.aborted) {
                    return;
                }

                var timedOut = 0;

                // add submitting element to data if we know it
                var sub = form.clk;
                if (sub) {
                    var n = sub.name;
                    if (n && !sub.disabled) {
                        s.extraData = s.extraData || {};
                        s.extraData[n] = sub.value;
                        if (sub.type == "image") {
                            s.extraData[n + '.x'] = form.clk_x;
                            s.extraData[n + '.y'] = form.clk_y;
                        }
                    }
                }

                // take a breath so that pending repaints get some cpu time before the upload starts
                function doSubmit() {
                    // make sure form attrs are set
                    var t = $form.attr('target')
                        , a = $form.attr('action');

                    // update form attrs in IE friendly way
                    form.setAttribute('target', id);
                    if (form.getAttribute('method') != 'POST') {
                        form.setAttribute('method', 'POST');
                    }
                    if (form.getAttribute('action') != s.url) {
                        form.setAttribute('action', s.url);
                    }

                    // ie borks in some cases when setting encoding
                    if (!s.skipEncodingOverride) {
                        $form.attr({
                            encoding: 'multipart/form-data',
                            enctype: 'multipart/form-data'
                        });
                    }

                    // support timout
                    if (s.timeout) {
                        setTimeout(function() {
                            timedOut = true;
                            cb();
                        }, s.timeout);
                    }

                    // add "extra" data to form if provided in options
                    var extraInputs = [];
                    try {
                        if (s.extraData) {
                            for (var n in s.extraData) {
                                extraInputs.push($('<input type="hidden" name="' + n + '" value="' + s.extraData[n] + '" />').appendTo(form)[0]);
                            }
                        }

                        // add iframe to doc and submit the form
                        $io.appendTo('body');
                        io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
                        form.submit();
                    } finally {
                        // reset attrs and remove "extra" input elements
                        form.setAttribute('action', a);
                        if (t) {
                            form.setAttribute('target', t);
                        } else {
                            $form.removeAttr('target');
                        }
                        $(extraInputs).remove();
                    }
                }

                if (s.forceSync) {
                    doSubmit();
                } else {
                    setTimeout(doSubmit, 10);
                    // this lets dom updates render
                }

                var data, doc, domCheckCount = 50;

                function cb() {
                    doc = io.document ? io.document : io.contentWindow ? io.contentWindow.document : io.contentDocument;
                    if (!doc || doc.location.href == s.iframeSrc) {
                        // response not received yet
                        return;
                    }
                    io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

                    var ok = true;
                    try {
                        if (timedOut) {
                            throw 'timeout';
                        }

                        var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                        log('isXml=' + isXml);
                        if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
                            if (--domCheckCount) {
                                // in some browsers (Opera) the iframe DOM is not always traversable when
                                // the onload callback fires, so we loop a bit to accommodate
                                log('requeing onLoad callback, DOM not available');
                                setTimeout(cb, 250);
                                return;
                            }
                            // let this fall through because server response could be an empty document
                            //log('Could not access iframe DOM after mutiple tries.');
                            //throw 'DOMException: not available';
                        }

                        //log('response detected');
                        xhr.responseText = doc.body ? doc.body.innerHTML : doc.documentElement ? doc.documentElement.innerHTML : null;
                        xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                        xhr.getResponseHeader = function(header) {
                            var headers = {
                                'content-type': s.dataType
                            };
                            return headers[header];
                        }
                        ;

                        var scr = /(json|script)/.test(s.dataType);
                        if (scr || s.textarea) {
                            // see if user embedded response in textarea
                            var ta = doc.getElementsByTagName('textarea')[0];
                            if (ta) {
                                xhr.responseText = ta.value;
                            } else if (scr) {
                                // account for browsers injecting pre around json response
                                var pre = doc.getElementsByTagName('pre')[0];
                                var b = doc.getElementsByTagName('body')[0];
                                if (pre) {
                                    xhr.responseText = pre.textContent;
                                } else if (b) {
                                    xhr.responseText = b.innerHTML;
                                }
                            }
                        } else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                            xhr.responseXML = toXml(xhr.responseText);
                        }

                        data = httpData(xhr, s.dataType, s);
                    } catch (e) {
                        log('error caught:', e);
                        ok = false;
                        xhr.error = e;
                        s.error && s.error.call(s.context, xhr, 'error', e);
                        g && $.event.trigger("ajaxError", [xhr, s, e]);
                    }

                    if (xhr.aborted) {
                        log('upload aborted');
                        ok = false;
                    }

                    // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
                    if (ok) {
                        s.success && s.success.call(s.context, data, 'success', xhr);
                        g && $.event.trigger("ajaxSuccess", [xhr, s]);
                    }

                    g && $.event.trigger("ajaxComplete", [xhr, s]);

                    if (g && !--$.active) {
                        $.event.trigger("ajaxStop");
                    }

                    s.complete && s.complete.call(s.context, xhr, ok ? 'success' : 'error');

                    // clean up
                    setTimeout(function() {
                        $io.removeData('form-plugin-onload');
                        $io.remove();
                        xhr.responseXML = null;
                    }, 100);
                }

                var toXml = $.parseXML || function(s, doc) {
                        // use parseXML if available (jQuery 1.5+)
                        if (window.ActiveXObject) {
                            doc = new ActiveXObject('Microsoft.XMLDOM');
                            doc.async = 'false';
                            doc.loadXML(s);
                        } else {
                            doc = (new DOMParser()).parseFromString(s, 'text/xml');
                        }
                        return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
                    }
                ;
                var parseJSON = $.parseJSON || function(s) {
                        return window['eval']('(' + s + ')');
                    }
                ;

                var httpData = function(xhr, type, s) {
                    // mostly lifted from jq1.4.4
                    var ct = xhr.getResponseHeader('content-type') || ''
                        , xml = type === 'xml' || !type && ct.indexOf('xml') >= 0
                        , data = xml ? xhr.responseXML : xhr.responseText;

                    if (xml && data.documentElement.nodeName === 'parsererror') {
                        $.error && $.error('parsererror');
                    }
                    if (s && s.dataFilter) {
                        data = s.dataFilter(data, type);
                    }
                    if (typeof data === 'string') {
                        if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                            data = parseJSON(data);
                        } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                            $.globalEval(data);
                        }
                    }
                    return data;
                };
            }
        }
        ;

        /**
         * ajaxForm() provides a mechanism for fully automating form submission.
         *
         * The advantages of using this method instead of ajaxSubmit() are:
         *
         * 1: This method will include coordinates for <input type="image" /> elements (if the element
         *	is used to submit the form).
         * 2. This method will include the submit element's name/value data (for the element that was
         *	used to submit the form).
         * 3. This method binds the submit() method to the form for you.
         *
         * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
         * passes the options argument along after properly binding events for submit elements and
         * the form itself.
         */
        $.fn.ajaxForm = function(options) {
            // in jQuery 1.3+ we can fix mistakes with the ready state
            if (this.length === 0) {
                var o = {
                    s: this.selector,
                    c: this.context
                };
                if (!$.isReady && o.s) {
                    log('DOM not ready, queuing ajaxForm');
                    $(function() {
                        $(o.s, o.c).ajaxForm(options);
                    });
                    return this;
                }
                // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
                log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
                return this;
            }

            return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
                if (!e.isDefaultPrevented()) {
                    // if event has been canceled, don't proceed
                    e.preventDefault();
                    $(this).ajaxSubmit(options);
                }
            }).bind('click.form-plugin', function(e) {
                var target = e.target;
                var $el = $(target);
                if (!($el.is(":submit,input:image"))) {
                    // is this a child element of the submit el?  (ex: a span within a button)
                    var t = $el.closest(':submit');
                    if (t.length == 0) {
                        return;
                    }
                    target = t[0];
                }
                var form = this;
                form.clk = target;
                if (target.type == 'image') {
                    if (e.offsetX != undefined) {
                        form.clk_x = e.offsetX;
                        form.clk_y = e.offsetY;
                    } else if (typeof $.fn.offset == 'function') {
                        // try to use dimensions plugin
                        var offset = $el.offset();
                        form.clk_x = e.pageX - offset.left;
                        form.clk_y = e.pageY - offset.top;
                    } else {
                        form.clk_x = e.pageX - target.offsetLeft;
                        form.clk_y = e.pageY - target.offsetTop;
                    }
                }
                // clear form vars
                setTimeout(function() {
                    form.clk = form.clk_x = form.clk_y = null;
                }, 100);
            });
        }
        ;

        // ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
        $.fn.ajaxFormUnbind = function() {
            return this.unbind('submit.form-plugin click.form-plugin');
        }
        ;

        /**
         * formToArray() gathers form element data into an array of objects that can
         * be passed to any of the following ajax functions: $.get, $.post, or load.
         * Each object in the array has both a 'name' and 'value' property.  An example of
         * an array for a simple login form might be:
         *
         * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
         *
         * It is this array that is passed to pre-submit callback functions provided to the
         * ajaxSubmit() and ajaxForm() methods.
         */
        $.fn.formToArray = function(semantic) {
            var a = [];
            if (this.length === 0) {
                return a;
            }

            var form = this[0];
            var els = semantic ? form.getElementsByTagName('*') : form.elements;
            if (!els) {
                return a;
            }

            var i, j, n, v, el, max, jmax;
            for (i = 0,
                     max = els.length; i < max; i++) {
                el = els[i];
                n = el.name;
                if (!n) {
                    continue;
                }

                if (semantic && form.clk && el.type == "image") {
                    // handle image inputs on the fly when semantic == true
                    if (!el.disabled && form.clk == el) {
                        a.push({
                            name: n,
                            value: $(el).val()
                        });
                        a.push({
                            name: n + '.x',
                            value: form.clk_x
                        }, {
                            name: n + '.y',
                            value: form.clk_y
                        });
                    }
                    continue;
                }

                v = $.fieldValue(el, true);
                if (v && v.constructor == Array) {
                    for (j = 0,
                             jmax = v.length; j < jmax; j++) {
                        a.push({
                            name: n,
                            value: v[j]
                        });
                    }
                } else if (v !== null && typeof v != 'undefined') {
                    a.push({
                        name: n,
                        value: v
                    });
                }
            }

            if (!semantic && form.clk) {
                // input type=='image' are not found in elements array! handle it here
                var $input = $(form.clk)
                    , input = $input[0];
                n = input.name;
                if (n && !input.disabled && input.type == 'image') {
                    a.push({
                        name: n,
                        value: $input.val()
                    });
                    a.push({
                        name: n + '.x',
                        value: form.clk_x
                    }, {
                        name: n + '.y',
                        value: form.clk_y
                    });
                }
            }
            return a;
        }
        ;

        /**
         * Serializes form data into a 'submittable' string. This method will return a string
         * in the format: name1=value1&amp;name2=value2
         */
        $.fn.formSerialize = function(semantic) {
            //hand off to jQuery.param for proper encoding
            return $.param(this.formToArray(semantic));
        }
        ;

        /**
         * Serializes all field elements in the jQuery object into a query string.
         * This method will return a string in the format: name1=value1&amp;name2=value2
         */
        $.fn.fieldSerialize = function(successful) {
            var a = [];
            this.each(function() {
                var n = this.name;
                if (!n) {
                    return;
                }
                var v = $.fieldValue(this, successful);
                if (v && v.constructor == Array) {
                    for (var i = 0, max = v.length; i < max; i++) {
                        a.push({
                            name: n,
                            value: v[i]
                        });
                    }
                } else if (v !== null && typeof v != 'undefined') {
                    a.push({
                        name: this.name,
                        value: v
                    });
                }
            });
            //hand off to jQuery.param for proper encoding
            return $.param(a);
        }
        ;

        /**
         * Returns the value(s) of the element in the matched set.  For example, consider the following form:
         *
         *  <form><fieldset>
         *	  <input name="A" type="text" />
         *	  <input name="A" type="text" />
         *	  <input name="B" type="checkbox" value="B1" />
         *	  <input name="B" type="checkbox" value="B2"/>
         *	  <input name="C" type="radio" value="C1" />
         *	  <input name="C" type="radio" value="C2" />
         *  </fieldset></form>
         *
         *  var v = $(':text').fieldValue();
         *  // if no values are entered into the text inputs
         *  v == ['','']
         *  // if values entered into the text inputs are 'foo' and 'bar'
         *  v == ['foo','bar']
         *
         *  var v = $(':checkbox').fieldValue();
         *  // if neither checkbox is checked
         *  v === undefined
         *  // if both checkboxes are checked
         *  v == ['B1', 'B2']
         *
         *  var v = $(':radio').fieldValue();
         *  // if neither radio is checked
         *  v === undefined
         *  // if first radio is checked
         *  v == ['C1']
         *
         * The successful argument controls whether or not the field element must be 'successful'
         * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
         * The default value of the successful argument is true.  If this value is false the value(s)
         * for each element is returned.
         *
         * Note: This method *always* returns an array.  If no valid value can be determined the
         *	   array will be empty, otherwise it will contain one or more values.
         */
        $.fn.fieldValue = function(successful) {
            for (var val = [], i = 0, max = this.length; i < max; i++) {
                var el = this[i];
                var v = $.fieldValue(el, successful);
                if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
                    continue;
                }
                v.constructor == Array ? $.merge(val, v) : val.push(v);
            }
            return val;
        }
        ;

        /**
         * Returns the value of the field element.
         */
        $.fieldValue = function(el, successful) {
            var n = el.name
                , t = el.type
                , tag = el.tagName.toLowerCase();
            if (successful === undefined) {
                successful = true;
            }

            if (successful && (!n || el.disabled || t == 'reset' || t == 'button' || (t == 'checkbox' || t == 'radio') && !el.checked || (t == 'submit' || t == 'image') && el.form && el.form.clk != el || tag == 'select' && el.selectedIndex == -1)) {
                return null;
            }

            if (tag == 'select') {
                var index = el.selectedIndex;
                if (index < 0) {
                    return null;
                }
                var a = []
                    , ops = el.options;
                var one = (t == 'select-one');
                var max = (one ? index + 1 : ops.length);
                for (var i = (one ? index : 0); i < max; i++) {
                    var op = ops[i];
                    if (op.selected) {
                        var v = op.value;
                        if (!v) {
                            // extra pain for IE...
                            v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                        }
                        if (one) {
                            return v;
                        }
                        a.push(v);
                    }
                }
                return a;
            }
            return $(el).val();
        }
        ;

        /**
         * Clears the form data.  Takes the following actions on the form's input fields:
         *  - input text fields will have their 'value' property set to the empty string
         *  - select elements will have their 'selectedIndex' property set to -1
         *  - checkbox and radio inputs will have their 'checked' property set to false
         *  - inputs of type submit, button, reset, and hidden will *not* be effected
         *  - button elements will *not* be effected
         */
        $.fn.clearForm = function() {
            return this.each(function() {
                $('input,select,textarea', this).clearFields();
            });
        }
        ;

        /**
         * Clears the selected form elements.
         */
        $.fn.clearFields = $.fn.clearInputs = function() {
            return this.each(function() {
                var t = this.type
                    , tag = this.tagName.toLowerCase();
                if (t == 'text' || t == 'password' || tag == 'textarea') {
                    this.value = '';
                } else if (t == 'checkbox' || t == 'radio') {
                    this.checked = false;
                } else if (tag == 'select') {
                    this.selectedIndex = -1;
                }
            });
        }
        ;

        /**
         * Resets the form data.  Causes all form elements to be reset to their original value.
         */
        $.fn.resetForm = function() {
            return this.each(function() {
                // guard against an input with the name of 'reset'
                // note that IE reports the reset function as an 'object'
                if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
                    this.reset();
                }
            });
        }
        ;

        /**
         * Enables or disables any matching elements.
         */
        $.fn.enable = function(b) {
            if (b === undefined) {
                b = true;
            }
            return this.each(function() {
                this.disabled = !b;
            });
        }
        ;

        /**
         * Checks/unchecks any matching checkboxes or radio buttons and
         * selects/deselects and matching option elements.
         */
        $.fn.selected = function(select) {
            if (select === undefined) {
                select = true;
            }
            return this.each(function() {
                var t = this.type;
                if (t == 'checkbox' || t == 'radio') {
                    this.checked = select;
                } else if (this.tagName.toLowerCase() == 'option') {
                    var $sel = $(this).parent('select');
                    if (select && $sel[0] && $sel[0].type == 'select-one') {
                        // deselect all other options
                        $sel.find('option').selected(false);
                    }
                    this.selected = select;
                }
            });
        }
        ;

        // helper fn for console logging
        // set $.fn.ajaxSubmit.debug to true to enable debug logging
        function log() {
            if ($.fn.ajaxSubmit.debug) {
                var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
                if (window.console && window.console.log) {
                    window.console.log(msg);
                } else if (window.opera && window.opera.postError) {
                    window.opera.postError(msg);
                }
            }
        }
        ;

    }
)(jQuery);

/*
 * JQuery zTree core v3.5.19.3
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-12-04
 */
(function(q) {
        var H, I, J, K, L, M, u, r = {}, v = {}, w = {}, N = {
            treeId: "",
            treeObj: null,
            view: {
                addDiyDom: null,
                autoCancelSelected: !0,
                dblClickExpand: !0,
                expandSpeed: "fast",
                fontCss: {},
                nameIsHTML: !1,
                selectedMulti: !0,
                showIcon: !0,
                showLine: !0,
                showTitle: !0,
                txtSelectedEnable: !1
            },
            data: {
                key: {
                    children: "children",
                    name: "name",
                    title: "",
                    url: "url",
                    icon: "icon"
                },
                simpleData: {
                    enable: !1,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: null
                },
                keep: {
                    parent: !1,
                    leaf: !1
                }
            },
            async: {
                enable: !1,
                contentType: "application/x-www-form-urlencoded",
                type: "post",
                dataType: "text",
                url: "",
                autoParam: [],
                otherParam: [],
                dataFilter: null
            },
            callback: {
                beforeAsync: null,
                beforeClick: null,
                beforeDblClick: null,
                beforeRightClick: null,
                beforeMouseDown: null,
                beforeMouseUp: null,
                beforeExpand: null,
                beforeCollapse: null,
                beforeRemove: null,
                onAsyncError: null,
                onAsyncSuccess: null,
                onNodeCreated: null,
                onClick: null,
                onDblClick: null,
                onRightClick: null,
                onMouseDown: null,
                onMouseUp: null,
                onExpand: null,
                onCollapse: null,
                onRemove: null
            }
        }, x = [function(b) {
            var a = b.treeObj
                , c = f.event;
            a.bind(c.NODECREATED, function(a, c, g) {
                j.apply(b.callback.onNodeCreated, [a, c, g])
            });
            a.bind(c.CLICK, function(a, c, g, n, h) {
                j.apply(b.callback.onClick, [c, g, n, h])
            });
            a.bind(c.EXPAND, function(a, c, g) {
                j.apply(b.callback.onExpand, [a, c, g])
            });
            a.bind(c.COLLAPSE, function(a, c, g) {
                j.apply(b.callback.onCollapse, [a, c, g])
            });
            a.bind(c.ASYNC_SUCCESS, function(a, c, g, n) {
                j.apply(b.callback.onAsyncSuccess, [a, c, g, n])
            });
            a.bind(c.ASYNC_ERROR, function(a, c, g, n, h, f) {
                j.apply(b.callback.onAsyncError, [a, c, g, n, h, f])
            });
            a.bind(c.REMOVE, function(a, c, g) {
                j.apply(b.callback.onRemove, [a, c, g])
            });
            a.bind(c.SELECTED, function(a, c, g) {
                j.apply(b.callback.onSelected, [c, g])
            });
            a.bind(c.UNSELECTED, function(a, c, g) {
                j.apply(b.callback.onUnSelected, [c, g])
            })
        }
        ], y = [function(b) {
            var a = f.event;
            b.treeObj.unbind(a.NODECREATED).unbind(a.CLICK).unbind(a.EXPAND).unbind(a.COLLAPSE).unbind(a.ASYNC_SUCCESS).unbind(a.ASYNC_ERROR).unbind(a.REMOVE).unbind(a.SELECTED).unbind(a.UNSELECTED)
        }
        ], z = [function(b) {
            var a = h.getCache(b);
            a || (a = {},
                h.setCache(b, a));
            a.nodes = [];
            a.doms = []
        }
        ], A = [function(b, a, c, d, e, g) {
            if (c) {
                var n = h.getRoot(b)
                    , f = b.data.key.children;
                c.level = a;
                c.tId = b.treeId + "_" + ++n.zId;
                c.parentTId = d ? d.tId : null;
                c.open = typeof c.open == "string" ? j.eqs(c.open, "true") : !!c.open;
                c[f] && c[f].length > 0 ? (c.isParent = !0,
                    c.zAsync = !0) : (c.isParent = typeof c.isParent == "string" ? j.eqs(c.isParent, "true") : !!c.isParent,
                    c.open = c.isParent && !b.async.enable ? c.open : !1,
                    c.zAsync = !c.isParent);
                c.isFirstNode = e;
                c.isLastNode = g;
                c.getParentNode = function() {
                    return h.getNodeCache(b, c.parentTId)
                }
                ;
                c.getPreNode = function() {
                    return h.getPreNode(b, c)
                }
                ;
                c.getNextNode = function() {
                    return h.getNextNode(b, c)
                }
                ;
                c.getIndex = function() {
                    return h.getNodeIndex(b, c)
                }
                ;
                c.getPath = function() {
                    return h.getNodePath(b, c)
                }
                ;
                c.isAjaxing = !1;
                h.fixPIdKeyValue(b, c)
            }
        }
        ], t = [function(b) {
            var a = b.target
                , c = h.getSetting(b.data.treeId)
                , d = ""
                , e = null
                , g = ""
                , n = ""
                , i = null
                , m = null
                , k = null;
            if (j.eqs(b.type, "mousedown"))
                n = "mousedown";
            else if (j.eqs(b.type, "mouseup"))
                n = "mouseup";
            else if (j.eqs(b.type, "contextmenu"))
                n = "contextmenu";
            else if (j.eqs(b.type, "click"))
                if (j.eqs(a.tagName, "span") && a.getAttribute("treeNode" + f.id.SWITCH) !== null)
                    d = j.getNodeMainDom(a).id,
                        g = "switchNode";
                else {
                    if (k = j.getMDom(c, a, [{
                        tagName: "a",
                        attrName: "treeNode" + f.id.A
                    }]))
                        d = j.getNodeMainDom(k).id,
                            g = "clickNode"
                }
            else if (j.eqs(b.type, "dblclick") && (n = "dblclick",
                k = j.getMDom(c, a, [{
                    tagName: "a",
                    attrName: "treeNode" + f.id.A
                }])))
                d = j.getNodeMainDom(k).id,
                    g = "switchNode";
            if (n.length > 0 && d.length == 0 && (k = j.getMDom(c, a, [{
                tagName: "a",
                attrName: "treeNode" + f.id.A
            }])))
                d = j.getNodeMainDom(k).id;
            if (d.length > 0)
                switch (e = h.getNodeCache(c, d),
                    g) {
                    case "switchNode":
                        e.isParent ? j.eqs(b.type, "click") || j.eqs(b.type, "dblclick") && j.apply(c.view.dblClickExpand, [c.treeId, e], c.view.dblClickExpand) ? i = H : g = "" : g = "";
                        break;
                    case "clickNode":
                        i = I
                }
            switch (n) {
                case "mousedown":
                    m = J;
                    break;
                case "mouseup":
                    m = K;
                    break;
                case "dblclick":
                    m = L;
                    break;
                case "contextmenu":
                    m = M
            }
            return {
                stop: !1,
                node: e,
                nodeEventType: g,
                nodeEventCallback: i,
                treeEventType: n,
                treeEventCallback: m
            }
        }
        ], B = [function(b) {
            var a = h.getRoot(b);
            a || (a = {},
                h.setRoot(b, a));
            a[b.data.key.children] = [];
            a.expandTriggerFlag = !1;
            a.curSelectedList = [];
            a.noSelection = !0;
            a.createdNodes = [];
            a.zId = 0;
            a._ver = (new Date).getTime()
        }
        ], C = [], D = [], E = [], F = [], G = [], h = {
            addNodeCache: function(b, a) {
                h.getCache(b).nodes[h.getNodeCacheId(a.tId)] = a
            },
            getNodeCacheId: function(b) {
                return b.substring(b.lastIndexOf("_") + 1)
            },
            addAfterA: function(b) {
                D.push(b)
            },
            addBeforeA: function(b) {
                C.push(b)
            },
            addInnerAfterA: function(b) {
                F.push(b)
            },
            addInnerBeforeA: function(b) {
                E.push(b)
            },
            addInitBind: function(b) {
                x.push(b)
            },
            addInitUnBind: function(b) {
                y.push(b)
            },
            addInitCache: function(b) {
                z.push(b)
            },
            addInitNode: function(b) {
                A.push(b)
            },
            addInitProxy: function(b, a) {
                a ? t.splice(0, 0, b) : t.push(b)
            },
            addInitRoot: function(b) {
                B.push(b)
            },
            addNodesData: function(b, a, c, d) {
                var e = b.data.key.children;
                a[e] ? c >= a[e].length && (c = -1) : (a[e] = [],
                    c = -1);
                if (a[e].length > 0 && c === 0)
                    a[e][0].isFirstNode = !1,
                        i.setNodeLineIcos(b, a[e][0]);
                else if (a[e].length > 0 && c < 0)
                    a[e][a[e].length - 1].isLastNode = !1,
                        i.setNodeLineIcos(b, a[e][a[e].length - 1]);
                a.isParent = !0;
                c < 0 ? a[e] = a[e].concat(d) : (b = [c, 0].concat(d),
                    a[e].splice.apply(a[e], b))
            },
            addSelectedNode: function(b, a) {
                var c = h.getRoot(b);
                h.isSelectedNode(b, a) || c.curSelectedList.push(a)
            },
            addCreatedNode: function(b, a) {
                (b.callback.onNodeCreated || b.view.addDiyDom) && h.getRoot(b).createdNodes.push(a)
            },
            addZTreeTools: function(b) {
                G.push(b)
            },
            exSetting: function(b) {
                q.extend(!0, N, b)
            },
            fixPIdKeyValue: function(b, a) {
                b.data.simpleData.enable && (a[b.data.simpleData.pIdKey] = a.parentTId ? a.getParentNode()[b.data.simpleData.idKey] : b.data.simpleData.rootPId)
            },
            getAfterA: function(b, a, c) {
                for (var d = 0, e = D.length; d < e; d++)
                    D[d].apply(this, arguments)
            },
            getBeforeA: function(b, a, c) {
                for (var d = 0, e = C.length; d < e; d++)
                    C[d].apply(this, arguments)
            },
            getInnerAfterA: function(b, a, c) {
                for (var d = 0, e = F.length; d < e; d++)
                    F[d].apply(this, arguments)
            },
            getInnerBeforeA: function(b, a, c) {
                for (var d = 0, e = E.length; d < e; d++)
                    E[d].apply(this, arguments)
            },
            getCache: function(b) {
                return w[b.treeId]
            },
            getNodeIndex: function(b, a) {
                if (!a)
                    return null;
                for (var c = b.data.key.children, d = a.parentTId ? a.getParentNode() : h.getRoot(b), e = 0, g = d[c].length - 1; e <= g; e++)
                    if (d[c][e] === a)
                        return e;
                return -1
            },
            getNextNode: function(b, a) {
                if (!a)
                    return null;
                for (var c = b.data.key.children, d = a.parentTId ? a.getParentNode() : h.getRoot(b), e = 0, g = d[c].length - 1; e <= g; e++)
                    if (d[c][e] === a)
                        return e == g ? null : d[c][e + 1];
                return null
            },
            getNodeByParam: function(b, a, c, d) {
                if (!a || !c)
                    return null;
                for (var e = b.data.key.children, g = 0, n = a.length; g < n; g++) {
                    if (a[g][c] == d)
                        return a[g];
                    var f = h.getNodeByParam(b, a[g][e], c, d);
                    if (f)
                        return f
                }
                return null
            },
            getNodeCache: function(b, a) {
                if (!a)
                    return null;
                var c = w[b.treeId].nodes[h.getNodeCacheId(a)];
                return c ? c : null
            },
            getNodeName: function(b, a) {
                return "" + a[b.data.key.name]
            },
            getNodePath: function(b, a) {
                if (!a)
                    return null;
                var c;
                (c = a.parentTId ? a.getParentNode().getPath() : []) && c.push(a);
                return c
            },
            getNodeTitle: function(b, a) {
                return "" + a[b.data.key.title === "" ? b.data.key.name : b.data.key.title]
            },
            getNodes: function(b) {
                return h.getRoot(b)[b.data.key.children]
            },
            getNodesByParam: function(b, a, c, d) {
                if (!a || !c)
                    return [];
                for (var e = b.data.key.children, g = [], f = 0, i = a.length; f < i; f++)
                    a[f][c] == d && g.push(a[f]),
                        g = g.concat(h.getNodesByParam(b, a[f][e], c, d));
                return g
            },
            getNodesByParamFuzzy: function(b, a, c, d) {
                if (!a || !c)
                    return [];
                for (var e = b.data.key.children, g = [], d = d.toLowerCase(), f = 0, i = a.length; f < i; f++)
                    typeof a[f][c] == "string" && a[f][c].toLowerCase().indexOf(d) > -1 && g.push(a[f]),
                        g = g.concat(h.getNodesByParamFuzzy(b, a[f][e], c, d));
                return g
            },
            getNodesByFilter: function(b, a, c, d, e) {
                if (!a)
                    return d ? null : [];
                for (var g = b.data.key.children, f = d ? null : [], i = 0, m = a.length; i < m; i++) {
                    if (j.apply(c, [a[i], e], !1)) {
                        if (d)
                            return a[i];
                        f.push(a[i])
                    }
                    var k = h.getNodesByFilter(b, a[i][g], c, d, e);
                    if (d && k)
                        return k;
                    f = d ? k : f.concat(k)
                }
                return f
            },
            getPreNode: function(b, a) {
                if (!a)
                    return null;
                for (var c = b.data.key.children, d = a.parentTId ? a.getParentNode() : h.getRoot(b), e = 0, g = d[c].length; e < g; e++)
                    if (d[c][e] === a)
                        return e == 0 ? null : d[c][e - 1];
                return null
            },
            getRoot: function(b) {
                return b ? v[b.treeId] : null
            },
            getRoots: function() {
                return v
            },
            getSetting: function(b) {
                return r[b]
            },
            getSettings: function() {
                return r
            },
            getZTreeTools: function(b) {
                return (b = this.getRoot(this.getSetting(b))) ? b.treeTools : null
            },
            initCache: function(b) {
                for (var a = 0, c = z.length; a < c; a++)
                    z[a].apply(this, arguments)
            },
            initNode: function(b, a, c, d, e, g) {
                for (var f = 0, h = A.length; f < h; f++)
                    A[f].apply(this, arguments)
            },
            initRoot: function(b) {
                for (var a = 0, c = B.length; a < c; a++)
                    B[a].apply(this, arguments)
            },
            isSelectedNode: function(b, a) {
                for (var c = h.getRoot(b), d = 0, e = c.curSelectedList.length; d < e; d++)
                    if (a === c.curSelectedList[d])
                        return !0;
                return !1
            },
            removeNodeCache: function(b, a) {
                var c = b.data.key.children;
                if (a[c])
                    for (var d = 0, e = a[c].length; d < e; d++)
                        arguments.callee(b, a[c][d]);
                h.getCache(b).nodes[h.getNodeCacheId(a.tId)] = null
            },
            removeSelectedNode: function(b, a) {
                for (var c = h.getRoot(b), d = 0, e = c.curSelectedList.length; d < e; d++)
                    if (a === c.curSelectedList[d] || !h.getNodeCache(b, c.curSelectedList[d].tId))
                        c.curSelectedList.splice(d, 1),
                            b.treeObj.trigger(f.event.UNSELECTED, [b.treeId, a]),
                            d--,
                            e--
            },
            setCache: function(b, a) {
                w[b.treeId] = a
            },
            setRoot: function(b, a) {
                v[b.treeId] = a
            },
            setZTreeTools: function(b, a) {
                for (var c = 0, d = G.length; c < d; c++)
                    G[c].apply(this, arguments)
            },
            transformToArrayFormat: function(b, a) {
                if (!a)
                    return [];
                var c = b.data.key.children
                    , d = [];
                if (j.isArray(a))
                    for (var e = 0, g = a.length; e < g; e++)
                        d.push(a[e]),
                        a[e][c] && (d = d.concat(h.transformToArrayFormat(b, a[e][c])));
                else
                    d.push(a),
                    a[c] && (d = d.concat(h.transformToArrayFormat(b, a[c])));
                return d
            },
            transformTozTreeFormat: function(b, a) {
                var c, d, e = b.data.simpleData.idKey, g = b.data.simpleData.pIdKey, f = b.data.key.children;
                if (!e || e == "" || !a)
                    return [];
                if (j.isArray(a)) {
                    var h = []
                        , i = [];
                    for (c = 0,
                             d = a.length; c < d; c++)
                        i[a[c][e]] = a[c];
                    for (c = 0,
                             d = a.length; c < d; c++)
                        i[a[c][g]] && a[c][e] != a[c][g] ? (i[a[c][g]][f] || (i[a[c][g]][f] = []),
                            i[a[c][g]][f].push(a[c])) : h.push(a[c]);
                    return h
                } else
                    return [a]
            }
        }, l = {
            bindEvent: function(b) {
                for (var a = 0, c = x.length; a < c; a++)
                    x[a].apply(this, arguments)
            },
            unbindEvent: function(b) {
                for (var a = 0, c = y.length; a < c; a++)
                    y[a].apply(this, arguments)
            },
            bindTree: function(b) {
                var a = {
                    treeId: b.treeId
                }
                    , c = b.treeObj;
                b.view.txtSelectedEnable || c.bind("selectstart", u).css({
                    "-moz-user-select": "-moz-none"
                });
                c.bind("click", a, l.proxy);
                c.bind("dblclick", a, l.proxy);
                c.bind("mouseover", a, l.proxy);
                c.bind("mouseout", a, l.proxy);
                c.bind("mousedown", a, l.proxy);
                c.bind("mouseup", a, l.proxy);
                c.bind("contextmenu", a, l.proxy)
            },
            unbindTree: function(b) {
                b.treeObj.unbind("selectstart", u).unbind("click", l.proxy).unbind("dblclick", l.proxy).unbind("mouseover", l.proxy).unbind("mouseout", l.proxy).unbind("mousedown", l.proxy).unbind("mouseup", l.proxy).unbind("contextmenu", l.proxy)
            },
            doProxy: function(b) {
                for (var a = [], c = 0, d = t.length; c < d; c++) {
                    var e = t[c].apply(this, arguments);
                    a.push(e);
                    if (e.stop)
                        break
                }
                return a
            },
            proxy: function(b) {
                var a = h.getSetting(b.data.treeId);
                if (!j.uCanDo(a, b))
                    return !0;
                for (var a = l.doProxy(b), c = !0, d = 0, e = a.length; d < e; d++) {
                    var g = a[d];
                    g.nodeEventCallback && (c = g.nodeEventCallback.apply(g, [b, g.node]) && c);
                    g.treeEventCallback && (c = g.treeEventCallback.apply(g, [b, g.node]) && c)
                }
                return c
            }
        };
        H = function(b, a) {
            var c = h.getSetting(b.data.treeId);
            if (a.open) {
                if (j.apply(c.callback.beforeCollapse, [c.treeId, a], !0) == !1)
                    return !0
            } else if (j.apply(c.callback.beforeExpand, [c.treeId, a], !0) == !1)
                return !0;
            h.getRoot(c).expandTriggerFlag = !0;
            i.switchNode(c, a);
            return !0
        }
        ;
        I = function(b, a) {
            var c = h.getSetting(b.data.treeId)
                , d = c.view.autoCancelSelected && (b.ctrlKey || b.metaKey) && h.isSelectedNode(c, a) ? 0 : c.view.autoCancelSelected && (b.ctrlKey || b.metaKey) && c.view.selectedMulti ? 2 : 1;
            if (j.apply(c.callback.beforeClick, [c.treeId, a, d], !0) == !1)
                return !0;
            d === 0 ? i.cancelPreSelectedNode(c, a) : i.selectNode(c, a, d === 2);
            c.treeObj.trigger(f.event.CLICK, [b, c.treeId, a, d]);
            return !0
        }
        ;
        J = function(b, a) {
            var c = h.getSetting(b.data.treeId);
            j.apply(c.callback.beforeMouseDown, [c.treeId, a], !0) && j.apply(c.callback.onMouseDown, [b, c.treeId, a]);
            return !0
        }
        ;
        K = function(b, a) {
            var c = h.getSetting(b.data.treeId);
            j.apply(c.callback.beforeMouseUp, [c.treeId, a], !0) && j.apply(c.callback.onMouseUp, [b, c.treeId, a]);
            return !0
        }
        ;
        L = function(b, a) {
            var c = h.getSetting(b.data.treeId);
            j.apply(c.callback.beforeDblClick, [c.treeId, a], !0) && j.apply(c.callback.onDblClick, [b, c.treeId, a]);
            return !0
        }
        ;
        M = function(b, a) {
            var c = h.getSetting(b.data.treeId);
            j.apply(c.callback.beforeRightClick, [c.treeId, a], !0) && j.apply(c.callback.onRightClick, [b, c.treeId, a]);
            return typeof c.callback.onRightClick != "function"
        }
        ;
        u = function(b) {
            b = b.originalEvent.srcElement.nodeName.toLowerCase();
            return b === "input" || b === "textarea"
        }
        ;
        var j = {
            apply: function(b, a, c) {
                return typeof b == "function" ? b.apply(O, a ? a : []) : c
            },
            canAsync: function(b, a) {
                var c = b.data.key.children;
                return b.async.enable && a && a.isParent && !(a.zAsync || a[c] && a[c].length > 0)
            },
            clone: function(b) {
                if (b === null)
                    return null;
                var a = j.isArray(b) ? [] : {}, c;
                for (c in b)
                    a[c] = b[c]instanceof Date ? new Date(b[c].getTime()) : typeof b[c] === "object" ? arguments.callee(b[c]) : b[c];
                return a
            },
            eqs: function(b, a) {
                return b.toLowerCase() === a.toLowerCase()
            },
            isArray: function(b) {
                return Object.prototype.toString.apply(b) === "[object Array]"
            },
            $: function(b, a, c) {
                a && typeof a != "string" && (c = a,
                    a = "");
                return typeof b == "string" ? q(b, c ? c.treeObj.get(0).ownerDocument : null) : q("#" + b.tId + a, c ? c.treeObj : null)
            },
            getMDom: function(b, a, c) {
                if (!a)
                    return null;
                for (; a && a.id !== b.treeId; ) {
                    for (var d = 0, e = c.length; a.tagName && d < e; d++)
                        if (j.eqs(a.tagName, c[d].tagName) && a.getAttribute(c[d].attrName) !== null)
                            return a;
                    a = a.parentNode
                }
                return null
            },
            getNodeMainDom: function(b) {
                return q(b).parent("li").get(0) || q(b).parentsUntil("li").parent().get(0)
            },
            isChildOrSelf: function(b, a) {
                return q(b).closest("#" + a).length > 0
            },
            uCanDo: function() {
                return !0
            }
        }
            , i = {
            addNodes: function(b, a, c, d, e) {
                if (!b.data.keep.leaf || !a || a.isParent)
                    if (j.isArray(d) || (d = [d]),
                    b.data.simpleData.enable && (d = h.transformTozTreeFormat(b, d)),
                        a) {
                        var g = k(a, f.id.SWITCH, b)
                            , n = k(a, f.id.ICON, b)
                            , o = k(a, f.id.UL, b);
                        if (!a.open)
                            i.replaceSwitchClass(a, g, f.folder.CLOSE),
                                i.replaceIcoClass(a, n, f.folder.CLOSE),
                                a.open = !1,
                                o.css({
                                    display: "none"
                                });
                        h.addNodesData(b, a, c, d);
                        i.createNodes(b, a.level + 1, d, a, c);
                        e || i.expandCollapseParentNode(b, a, !0)
                    } else
                        h.addNodesData(b, h.getRoot(b), c, d),
                            i.createNodes(b, 0, d, null, c)
            },
            appendNodes: function(b, a, c, d, e, g, f) {
                if (!c)
                    return [];
                var j = [], m = b.data.key.children, k = (d ? d : h.getRoot(b))[m], l, Q;
                if (!k || e >= k.length)
                    e = -1;
                for (var s = 0, q = c.length; s < q; s++) {
                    var p = c[s];
                    g && (l = (e === 0 || k.length == c.length) && s == 0,
                        Q = e < 0 && s == c.length - 1,
                        h.initNode(b, a, p, d, l, Q, f),
                        h.addNodeCache(b, p));
                    l = [];
                    p[m] && p[m].length > 0 && (l = i.appendNodes(b, a + 1, p[m], p, -1, g, f && p.open));
                    f && (i.makeDOMNodeMainBefore(j, b, p),
                        i.makeDOMNodeLine(j, b, p),
                        h.getBeforeA(b, p, j),
                        i.makeDOMNodeNameBefore(j, b, p),
                        h.getInnerBeforeA(b, p, j),
                        i.makeDOMNodeIcon(j, b, p),
                        h.getInnerAfterA(b, p, j),
                        i.makeDOMNodeNameAfter(j, b, p),
                        h.getAfterA(b, p, j),
                    p.isParent && p.open && i.makeUlHtml(b, p, j, l.join("")),
                        i.makeDOMNodeMainAfter(j, b, p),
                        h.addCreatedNode(b, p))
                }
                return j
            },
            appendParentULDom: function(b, a) {
                var c = []
                    , d = k(a, b);
                !d.get(0) && a.parentTId && (i.appendParentULDom(b, a.getParentNode()),
                    d = k(a, b));
                var e = k(a, f.id.UL, b);
                e.get(0) && e.remove();
                e = i.appendNodes(b, a.level + 1, a[b.data.key.children], a, -1, !1, !0);
                i.makeUlHtml(b, a, c, e.join(""));
                d.append(c.join(""))
            },
            asyncNode: function(b, a, c, d) {
                var e, g;
                if (a && !a.isParent)
                    return j.apply(d),
                        !1;
                else if (a && a.isAjaxing)
                    return !1;
                else if (j.apply(b.callback.beforeAsync, [b.treeId, a], !0) == !1)
                    return j.apply(d),
                        !1;
                if (a)
                    a.isAjaxing = !0,
                        k(a, f.id.ICON, b).attr({
                            style: "",
                            "class": f.className.BUTTON + " " + f.className.ICO_LOADING
                        });
                var n = {};
                for (e = 0,
                         g = b.async.autoParam.length; a && e < g; e++) {
                    var o = b.async.autoParam[e].split("=")
                        , m = o;
                    o.length > 1 && (m = o[1],
                        o = o[0]);
                    n[m] = a[o]
                }
                if (j.isArray(b.async.otherParam))
                    for (e = 0,
                             g = b.async.otherParam.length; e < g; e += 2)
                        n[b.async.otherParam[e]] = b.async.otherParam[e + 1];
                else
                    for (var l in b.async.otherParam)
                        n[l] = b.async.otherParam[l];
                var P = h.getRoot(b)._ver;
                q.ajax({
                    contentType: b.async.contentType,
                    cache: !1,
                    type: b.async.type,
                    url: j.apply(b.async.url, [b.treeId, a], b.async.url),
                    data: n,
                    dataType: b.async.dataType,
                    success: function(e) {
                        if (P == h.getRoot(b)._ver) {
                            var g = [];
                            try {
                                g = !e || e.length == 0 ? [] : typeof e == "string" ? eval("(" + e + ")") : e
                            } catch (n) {
                                g = e
                            }
                            if (a)
                                a.isAjaxing = null,
                                    a.zAsync = !0;
                            i.setNodeLineIcos(b, a);
                            g && g !== "" ? (g = j.apply(b.async.dataFilter, [b.treeId, a, g], g),
                                i.addNodes(b, a, -1, g ? j.clone(g) : [], !!c)) : i.addNodes(b, a, -1, [], !!c);
                            b.treeObj.trigger(f.event.ASYNC_SUCCESS, [b.treeId, a, e]);
                            j.apply(d)
                        }
                    },
                    error: function(c, d, e) {
                        if (P == h.getRoot(b)._ver) {
                            if (a)
                                a.isAjaxing = null;
                            i.setNodeLineIcos(b, a);
                            b.treeObj.trigger(f.event.ASYNC_ERROR, [b.treeId, a, c, d, e])
                        }
                    }
                });
                return !0
            },
            cancelPreSelectedNode: function(b, a, c) {
                var d = h.getRoot(b).curSelectedList, e, g;
                for (e = d.length - 1; e >= 0; e--)
                    if (g = d[e],
                    a === g || !a && (!c || c !== g))
                        if (k(g, f.id.A, b).removeClass(f.node.CURSELECTED),
                            a) {
                            h.removeSelectedNode(b, a);
                            break
                        } else
                            d.splice(e, 1),
                                b.treeObj.trigger(f.event.UNSELECTED, [b.treeId, g])
            },
            createNodeCallback: function(b) {
                if (b.callback.onNodeCreated || b.view.addDiyDom)
                    for (var a = h.getRoot(b); a.createdNodes.length > 0; ) {
                        var c = a.createdNodes.shift();
                        j.apply(b.view.addDiyDom, [b.treeId, c]);
                        b.callback.onNodeCreated && b.treeObj.trigger(f.event.NODECREATED, [b.treeId, c])
                    }
            },
            createNodes: function(b, a, c, d, e) {
                if (c && c.length != 0) {
                    var g = h.getRoot(b)
                        , j = b.data.key.children
                        , j = !d || d.open || !!k(d[j][0], b).get(0);
                    g.createdNodes = [];
                    var a = i.appendNodes(b, a, c, d, e, !0, j), o, m;
                    d ? (d = k(d, f.id.UL, b),
                    d.get(0) && (o = d)) : o = b.treeObj;
                    o && (e >= 0 && (m = o.children()[e]),
                        e >= 0 && m ? q(m).before(a.join("")) : o.append(a.join("")));
                    i.createNodeCallback(b)
                }
            },
            destroy: function(b) {
                b && (h.initCache(b),
                    h.initRoot(b),
                    l.unbindTree(b),
                    l.unbindEvent(b),
                    b.treeObj.empty(),
                    delete r[b.treeId])
            },
            expandCollapseNode: function(b, a, c, d, e) {
                var g = h.getRoot(b)
                    , n = b.data.key.children;
                if (a) {
                    if (g.expandTriggerFlag) {
                        var o = e
                            , e = function() {
                            o && o();
                            a.open ? b.treeObj.trigger(f.event.EXPAND, [b.treeId, a]) : b.treeObj.trigger(f.event.COLLAPSE, [b.treeId, a])
                        };
                        g.expandTriggerFlag = !1
                    }
                    if (!a.open && a.isParent && (!k(a, f.id.UL, b).get(0) || a[n] && a[n].length > 0 && !k(a[n][0], b).get(0)))
                        i.appendParentULDom(b, a),
                            i.createNodeCallback(b);
                    if (a.open == c)
                        j.apply(e, []);
                    else {
                        var c = k(a, f.id.UL, b)
                            , g = k(a, f.id.SWITCH, b)
                            , m = k(a, f.id.ICON, b);
                        a.isParent ? (a.open = !a.open,
                        a.iconOpen && a.iconClose && m.attr("style", i.makeNodeIcoStyle(b, a)),
                            a.open ? (i.replaceSwitchClass(a, g, f.folder.OPEN),
                                i.replaceIcoClass(a, m, f.folder.OPEN),
                                d == !1 || b.view.expandSpeed == "" ? (c.show(),
                                    j.apply(e, [])) : a[n] && a[n].length > 0 ? c.slideDown(b.view.expandSpeed, e) : (c.show(),
                                    j.apply(e, []))) : (i.replaceSwitchClass(a, g, f.folder.CLOSE),
                                i.replaceIcoClass(a, m, f.folder.CLOSE),
                                d == !1 || b.view.expandSpeed == "" || !(a[n] && a[n].length > 0) ? (c.hide(),
                                    j.apply(e, [])) : c.slideUp(b.view.expandSpeed, e))) : j.apply(e, [])
                    }
                } else
                    j.apply(e, [])
            },
            expandCollapseParentNode: function(b, a, c, d, e) {
                a && (a.parentTId ? (i.expandCollapseNode(b, a, c, d),
                a.parentTId && i.expandCollapseParentNode(b, a.getParentNode(), c, d, e)) : i.expandCollapseNode(b, a, c, d, e))
            },
            expandCollapseSonNode: function(b, a, c, d, e) {
                var g = h.getRoot(b)
                    , f = b.data.key.children
                    , g = a ? a[f] : g[f]
                    , f = a ? !1 : d
                    , j = h.getRoot(b).expandTriggerFlag;
                h.getRoot(b).expandTriggerFlag = !1;
                if (g)
                    for (var k = 0, l = g.length; k < l; k++)
                        g[k] && i.expandCollapseSonNode(b, g[k], c, f);
                h.getRoot(b).expandTriggerFlag = j;
                i.expandCollapseNode(b, a, c, d, e)
            },
            isSelectedNode: function(b, a) {
                if (!a)
                    return !1;
                var c = h.getRoot(b).curSelectedList, d;
                for (d = c.length - 1; d >= 0; d--)
                    if (a === c[d])
                        return !0;
                return !1
            },
            makeDOMNodeIcon: function(b, a, c) {
                var d = h.getNodeName(a, c)
                    , d = a.view.nameIsHTML ? d : d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                b.push("<span id='", c.tId, f.id.ICON, "' title='' treeNode", f.id.ICON, " class='", i.makeNodeIcoClass(a, c), "' style='", i.makeNodeIcoStyle(a, c), "'></span><span id='", c.tId, f.id.SPAN, "' class='", f.className.NAME, "'>", d, "</span>")
            },
            makeDOMNodeLine: function(b, a, c) {
                b.push("<span id='", c.tId, f.id.SWITCH, "' title='' class='", i.makeNodeLineClass(a, c), "' treeNode", f.id.SWITCH, "></span>")
            },
            makeDOMNodeMainAfter: function(b) {
                b.push("</li>")
            },
            makeDOMNodeMainBefore: function(b, a, c) {
                b.push("<li id='", c.tId, "' class='", f.className.LEVEL, c.level, "' tabindex='0' hidefocus='true' treenode>")
            },
            makeDOMNodeNameAfter: function(b) {
                b.push("</a>")
            },
            makeDOMNodeNameBefore: function(b, a, c) {
                var d = h.getNodeTitle(a, c), e = i.makeNodeUrl(a, c), g = i.makeNodeFontCss(a, c), n = [], k;
                for (k in g)
                    n.push(k, ":", g[k], ";");
                b.push("<a id='", c.tId, f.id.A, "' class='", f.className.LEVEL, c.level, "' treeNode", f.id.A, ' onclick="', c.click || "", '" ', e != null && e.length > 0 ? "href='" + e + "'" : "", " target='", i.makeNodeTarget(c), "' style='", n.join(""), "'");
                j.apply(a.view.showTitle, [a.treeId, c], a.view.showTitle) && d && b.push("title='", d.replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "'");
                b.push(">")
            },
            makeNodeFontCss: function(b, a) {
                var c = j.apply(b.view.fontCss, [b.treeId, a], b.view.fontCss);
                return c && typeof c != "function" ? c : {}
            },
            makeNodeIcoClass: function(b, a) {
                var c = ["ico"];
                a.isAjaxing || (c[0] = (a.iconSkin ? a.iconSkin + "_" : "") + c[0],
                    a.isParent ? c.push(a.open ? f.folder.OPEN : f.folder.CLOSE) : c.push(f.folder.DOCU));
                return f.className.BUTTON + " " + c.join("_")
            },
            makeNodeIcoStyle: function(b, a) {
                var c = [];
                if (!a.isAjaxing) {
                    var d = a.isParent && a.iconOpen && a.iconClose ? a.open ? a.iconOpen : a.iconClose : a[b.data.key.icon];
                    d && c.push("background:url(", d, ") 0 0 no-repeat;");
                    (b.view.showIcon == !1 || !j.apply(b.view.showIcon, [b.treeId, a], !0)) && c.push("width:0px;height:0px;")
                }
                return c.join("")
            },
            makeNodeLineClass: function(b, a) {
                var c = [];
                b.view.showLine ? a.level == 0 && a.isFirstNode && a.isLastNode ? c.push(f.line.ROOT) : a.level == 0 && a.isFirstNode ? c.push(f.line.ROOTS) : a.isLastNode ? c.push(f.line.BOTTOM) : c.push(f.line.CENTER) : c.push(f.line.NOLINE);
                a.isParent ? c.push(a.open ? f.folder.OPEN : f.folder.CLOSE) : c.push(f.folder.DOCU);
                return i.makeNodeLineClassEx(a) + c.join("_")
            },
            makeNodeLineClassEx: function(b) {
                return f.className.BUTTON + " " + f.className.LEVEL + b.level + " " + f.className.SWITCH + " "
            },
            makeNodeTarget: function(b) {
                return b.target || "_blank"
            },
            makeNodeUrl: function(b, a) {
                var c = b.data.key.url;
                return a[c] ? a[c] : null
            },
            makeUlHtml: function(b, a, c, d) {
                c.push("<ul id='", a.tId, f.id.UL, "' class='", f.className.LEVEL, a.level, " ", i.makeUlLineClass(b, a), "' style='display:", a.open ? "block" : "none", "'>");
                c.push(d);
                c.push("</ul>")
            },
            makeUlLineClass: function(b, a) {
                return b.view.showLine && !a.isLastNode ? f.line.LINE : ""
            },
            removeChildNodes: function(b, a) {
                if (a) {
                    var c = b.data.key.children
                        , d = a[c];
                    if (d) {
                        for (var e = 0, g = d.length; e < g; e++)
                            h.removeNodeCache(b, d[e]);
                        h.removeSelectedNode(b);
                        delete a[c];
                        b.data.keep.parent ? k(a, f.id.UL, b).empty() : (a.isParent = !1,
                            a.open = !1,
                            c = k(a, f.id.SWITCH, b),
                            d = k(a, f.id.ICON, b),
                            i.replaceSwitchClass(a, c, f.folder.DOCU),
                            i.replaceIcoClass(a, d, f.folder.DOCU),
                            k(a, f.id.UL, b).remove())
                    }
                }
            },
            setFirstNode: function(b, a) {
                var c = b.data.key.children;
                if (a[c].length > 0)
                    a[c][0].isFirstNode = !0
            },
            setLastNode: function(b, a) {
                var c = b.data.key.children
                    , d = a[c].length;
                if (d > 0)
                    a[c][d - 1].isLastNode = !0
            },
            removeNode: function(b, a) {
                var c = h.getRoot(b)
                    , d = b.data.key.children
                    , e = a.parentTId ? a.getParentNode() : c;
                a.isFirstNode = !1;
                a.isLastNode = !1;
                a.getPreNode = function() {
                    return null
                }
                ;
                a.getNextNode = function() {
                    return null
                }
                ;
                if (h.getNodeCache(b, a.tId)) {
                    k(a, b).remove();
                    h.removeNodeCache(b, a);
                    h.removeSelectedNode(b, a);
                    for (var g = 0, j = e[d].length; g < j; g++)
                        if (e[d][g].tId == a.tId) {
                            e[d].splice(g, 1);
                            break
                        }
                    i.setFirstNode(b, e);
                    i.setLastNode(b, e);
                    var o, g = e[d].length;
                    if (!b.data.keep.parent && g == 0)
                        e.isParent = !1,
                            e.open = !1,
                            g = k(e, f.id.UL, b),
                            j = k(e, f.id.SWITCH, b),
                            o = k(e, f.id.ICON, b),
                            i.replaceSwitchClass(e, j, f.folder.DOCU),
                            i.replaceIcoClass(e, o, f.folder.DOCU),
                            g.css("display", "none");
                    else if (b.view.showLine && g > 0) {
                        var m = e[d][g - 1]
                            , g = k(m, f.id.UL, b)
                            , j = k(m, f.id.SWITCH, b);
                        o = k(m, f.id.ICON, b);
                        e == c ? e[d].length == 1 ? i.replaceSwitchClass(m, j, f.line.ROOT) : (c = k(e[d][0], f.id.SWITCH, b),
                            i.replaceSwitchClass(e[d][0], c, f.line.ROOTS),
                            i.replaceSwitchClass(m, j, f.line.BOTTOM)) : i.replaceSwitchClass(m, j, f.line.BOTTOM);
                        g.removeClass(f.line.LINE)
                    }
                }
            },
            replaceIcoClass: function(b, a, c) {
                if (a && !b.isAjaxing && (b = a.attr("class"),
                b != void 0)) {
                    b = b.split("_");
                    switch (c) {
                        case f.folder.OPEN:
                        case f.folder.CLOSE:
                        case f.folder.DOCU:
                            b[b.length - 1] = c
                    }
                    a.attr("class", b.join("_"))
                }
            },
            replaceSwitchClass: function(b, a, c) {
                if (a) {
                    var d = a.attr("class");
                    if (d != void 0) {
                        d = d.split("_");
                        switch (c) {
                            case f.line.ROOT:
                            case f.line.ROOTS:
                            case f.line.CENTER:
                            case f.line.BOTTOM:
                            case f.line.NOLINE:
                                d[0] = i.makeNodeLineClassEx(b) + c;
                                break;
                            case f.folder.OPEN:
                            case f.folder.CLOSE:
                            case f.folder.DOCU:
                                d[1] = c
                        }
                        a.attr("class", d.join("_"));
                        c !== f.folder.DOCU ? a.removeAttr("disabled") : a.attr("disabled", "disabled")
                    }
                }
            },
            selectNode: function(b, a, c) {
                c || i.cancelPreSelectedNode(b, null, a);
                k(a, f.id.A, b).addClass(f.node.CURSELECTED);
                h.addSelectedNode(b, a);
                b.treeObj.trigger(f.event.SELECTED, [b.treeId, a])
            },
            setNodeFontCss: function(b, a) {
                var c = k(a, f.id.A, b)
                    , d = i.makeNodeFontCss(b, a);
                d && c.css(d)
            },
            setNodeLineIcos: function(b, a) {
                if (a) {
                    var c = k(a, f.id.SWITCH, b)
                        , d = k(a, f.id.UL, b)
                        , e = k(a, f.id.ICON, b)
                        , g = i.makeUlLineClass(b, a);
                    g.length == 0 ? d.removeClass(f.line.LINE) : d.addClass(g);
                    c.attr("class", i.makeNodeLineClass(b, a));
                    a.isParent ? c.removeAttr("disabled") : c.attr("disabled", "disabled");
                    e.removeAttr("style");
                    e.attr("style", i.makeNodeIcoStyle(b, a));
                    e.attr("class", i.makeNodeIcoClass(b, a))
                }
            },
            setNodeName: function(b, a) {
                var c = h.getNodeTitle(b, a)
                    , d = k(a, f.id.SPAN, b);
                d.empty();
                b.view.nameIsHTML ? d.html(h.getNodeName(b, a)) : d.text(h.getNodeName(b, a));
                j.apply(b.view.showTitle, [b.treeId, a], b.view.showTitle) && k(a, f.id.A, b).attr("title", !c ? "" : c)
            },
            setNodeTarget: function(b, a) {
                k(a, f.id.A, b).attr("target", i.makeNodeTarget(a))
            },
            setNodeUrl: function(b, a) {
                var c = k(a, f.id.A, b)
                    , d = i.makeNodeUrl(b, a);
                d == null || d.length == 0 ? c.removeAttr("href") : c.attr("href", d)
            },
            switchNode: function(b, a) {
                a.open || !j.canAsync(b, a) ? i.expandCollapseNode(b, a, !a.open) : b.async.enable ? i.asyncNode(b, a) || i.expandCollapseNode(b, a, !a.open) : a && i.expandCollapseNode(b, a, !a.open)
            }
        };
        q.fn.zTree = {
            consts: {
                className: {
                    BUTTON: "button",
                    LEVEL: "level",
                    ICO_LOADING: "ico_loading",
                    SWITCH: "switch",
                    NAME: "node_name"
                },
                event: {
                    NODECREATED: "ztree_nodeCreated",
                    CLICK: "ztree_click",
                    EXPAND: "ztree_expand",
                    COLLAPSE: "ztree_collapse",
                    ASYNC_SUCCESS: "ztree_async_success",
                    ASYNC_ERROR: "ztree_async_error",
                    REMOVE: "ztree_remove",
                    SELECTED: "ztree_selected",
                    UNSELECTED: "ztree_unselected"
                },
                id: {
                    A: "_a",
                    ICON: "_ico",
                    SPAN: "_span",
                    SWITCH: "_switch",
                    UL: "_ul"
                },
                line: {
                    ROOT: "root",
                    ROOTS: "roots",
                    CENTER: "center",
                    BOTTOM: "bottom",
                    NOLINE: "noline",
                    LINE: "line"
                },
                folder: {
                    OPEN: "open",
                    CLOSE: "close",
                    DOCU: "docu"
                },
                node: {
                    CURSELECTED: "curSelectedNode"
                }
            },
            _z: {
                tools: j,
                view: i,
                event: l,
                data: h
            },
            getZTreeObj: function(b) {
                return (b = h.getZTreeTools(b)) ? b : null
            },
            destroy: function(b) {
                if (b && b.length > 0)
                    i.destroy(h.getSetting(b));
                else
                    for (var a in r)
                        i.destroy(r[a])
            },
            init: function(b, a, c) {
                var d = j.clone(N);
                q.extend(!0, d, a);
                d.treeId = b.attr("id");
                d.treeObj = b;
                d.treeObj.empty();
                r[d.treeId] = d;
                if (typeof document.body.style.maxHeight === "undefined")
                    d.view.expandSpeed = "";
                h.initRoot(d);
                b = h.getRoot(d);
                a = d.data.key.children;
                c = c ? j.clone(j.isArray(c) ? c : [c]) : [];
                b[a] = d.data.simpleData.enable ? h.transformTozTreeFormat(d, c) : c;
                h.initCache(d);
                l.unbindTree(d);
                l.bindTree(d);
                l.unbindEvent(d);
                l.bindEvent(d);
                c = {
                    setting: d,
                    addNodes: function(a, b, c, f) {
                        function h() {
                            i.addNodes(d, a, b, l, f == !0)
                        }
                        a || (a = null);
                        if (a && !a.isParent && d.data.keep.leaf)
                            return null;
                        var k = parseInt(b, 10);
                        isNaN(k) ? (f = !!c,
                            c = b,
                            b = -1) : b = k;
                        if (!c)
                            return null;
                        var l = j.clone(j.isArray(c) ? c : [c]);
                        j.canAsync(d, a) ? i.asyncNode(d, a, f, h) : h();
                        return l
                    },
                    cancelSelectedNode: function(a) {
                        i.cancelPreSelectedNode(d, a)
                    },
                    destroy: function() {
                        i.destroy(d)
                    },
                    expandAll: function(a) {
                        a = !!a;
                        i.expandCollapseSonNode(d, null, a, !0);
                        return a
                    },
                    expandNode: function(a, b, c, f, m) {
                        function l() {
                            var b = k(a, d).get(0);
                            if (b && f !== !1)
                                if (b.scrollIntoView)
                                    b.scrollIntoView();
                                else
                                    try {
                                        b.focus().blur()
                                    } catch (c) {}
                        }
                        if (!a || !a.isParent)
                            return null;
                        b !== !0 && b !== !1 && (b = !a.open);
                        if ((m = !!m) && b && j.apply(d.callback.beforeExpand, [d.treeId, a], !0) == !1)
                            return null;
                        else if (m && !b && j.apply(d.callback.beforeCollapse, [d.treeId, a], !0) == !1)
                            return null;
                        b && a.parentTId && i.expandCollapseParentNode(d, a.getParentNode(), b, !1);
                        if (b === a.open && !c)
                            return null;
                        h.getRoot(d).expandTriggerFlag = m;
                        !j.canAsync(d, a) && c ? i.expandCollapseSonNode(d, a, b, !0, l) : (a.open = !b,
                            i.switchNode(this.setting, a),
                            l());
                        return b
                    },
                    getNodes: function() {
                        return h.getNodes(d)
                    },
                    getNodeByParam: function(a, b, c) {
                        return !a ? null : h.getNodeByParam(d, c ? c[d.data.key.children] : h.getNodes(d), a, b)
                    },
                    getNodeByTId: function(a) {
                        return h.getNodeCache(d, a)
                    },
                    getNodesByParam: function(a, b, c) {
                        return !a ? null : h.getNodesByParam(d, c ? c[d.data.key.children] : h.getNodes(d), a, b)
                    },
                    getNodesByParamFuzzy: function(a, b, c) {
                        return !a ? null : h.getNodesByParamFuzzy(d, c ? c[d.data.key.children] : h.getNodes(d), a, b)
                    },
                    getNodesByFilter: function(a, b, c, f) {
                        b = !!b;
                        return !a || typeof a != "function" ? b ? null : [] : h.getNodesByFilter(d, c ? c[d.data.key.children] : h.getNodes(d), a, b, f)
                    },
                    getNodeIndex: function(a) {
                        if (!a)
                            return null;
                        for (var b = d.data.key.children, c = a.parentTId ? a.getParentNode() : h.getRoot(d), f = 0, i = c[b].length; f < i; f++)
                            if (c[b][f] == a)
                                return f;
                        return -1
                    },
                    getSelectedNodes: function() {
                        for (var a = [], b = h.getRoot(d).curSelectedList, c = 0, f = b.length; c < f; c++)
                            a.push(b[c]);
                        return a
                    },
                    isSelectedNode: function(a) {
                        return h.isSelectedNode(d, a)
                    },
                    reAsyncChildNodes: function(a, b, c) {
                        if (this.setting.async.enable) {
                            var j = !a;
                            j && (a = h.getRoot(d));
                            if (b == "refresh") {
                                for (var b = this.setting.data.key.children, m = 0, l = a[b] ? a[b].length : 0; m < l; m++)
                                    h.removeNodeCache(d, a[b][m]);
                                h.removeSelectedNode(d);
                                a[b] = [];
                                j ? this.setting.treeObj.empty() : k(a, f.id.UL, d).empty()
                            }
                            i.asyncNode(this.setting, j ? null : a, !!c)
                        }
                    },
                    refresh: function() {
                        this.setting.treeObj.empty();
                        var a = h.getRoot(d)
                            , b = a[d.data.key.children];
                        h.initRoot(d);
                        a[d.data.key.children] = b;
                        h.initCache(d);
                        i.createNodes(d, 0, a[d.data.key.children], null, -1)
                    },
                    removeChildNodes: function(a) {
                        if (!a)
                            return null;
                        var b = a[d.data.key.children];
                        i.removeChildNodes(d, a);
                        return b ? b : null
                    },
                    removeNode: function(a, b) {
                        a && (b = !!b,
                        b && j.apply(d.callback.beforeRemove, [d.treeId, a], !0) == !1 || (i.removeNode(d, a),
                        b && this.setting.treeObj.trigger(f.event.REMOVE, [d.treeId, a])))
                    },
                    selectNode: function(a, b) {
                        function c() {
                            var b = k(a, d).get(0);
                            if (b)
                                if (b.scrollIntoView)
                                    b.scrollIntoView();
                                else
                                    try {
                                        b.focus().blur()
                                    } catch (f) {}
                        }
                        if (a && j.uCanDo(d)) {
                            b = d.view.selectedMulti && b;
                            if (a.parentTId)
                                i.expandCollapseParentNode(d, a.getParentNode(), !0, !1, c);
                            else
                                try {
                                    k(a, d).focus().blur()
                                } catch (f) {}
                            i.selectNode(d, a, b)
                        }
                    },
                    transformTozTreeNodes: function(a) {
                        return h.transformTozTreeFormat(d, a)
                    },
                    transformToArray: function(a) {
                        return h.transformToArrayFormat(d, a)
                    },
                    updateNode: function(a) {
                        a && k(a, d).get(0) && j.uCanDo(d) && (i.setNodeName(d, a),
                            i.setNodeTarget(d, a),
                            i.setNodeUrl(d, a),
                            i.setNodeLineIcos(d, a),
                            i.setNodeFontCss(d, a))
                    }
                };
                b.treeTools = c;
                h.setZTreeTools(d, c);
                b[a] && b[a].length > 0 ? i.createNodes(d, 0, b[a], null, -1) : d.async.enable && d.async.url && d.async.url !== "" && i.asyncNode(d);
                return c
            }
        };
        var O = q.fn.zTree
            , k = j.$
            , f = O.consts
    }
)(jQuery);
/*
 * JQuery zTree exedit v3.5.19.3
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-12-04
 */
(function(v) {
        var I = {
            event: {
                DRAG: "ztree_drag",
                DROP: "ztree_drop",
                RENAME: "ztree_rename",
                DRAGMOVE: "ztree_dragmove"
            },
            id: {
                EDIT: "_edit",
                INPUT: "_input",
                REMOVE: "_remove"
            },
            move: {
                TYPE_INNER: "inner",
                TYPE_PREV: "prev",
                TYPE_NEXT: "next"
            },
            node: {
                CURSELECTED_EDIT: "curSelectedNode_Edit",
                TMPTARGET_TREE: "tmpTargetzTree",
                TMPTARGET_NODE: "tmpTargetNode"
            }
        }
            , x = {
            onHoverOverNode: function(b, a) {
                var c = m.getSetting(b.data.treeId)
                    , d = m.getRoot(c);
                if (d.curHoverNode != a)
                    x.onHoverOutNode(b);
                d.curHoverNode = a;
                f.addHoverDom(c, a)
            },
            onHoverOutNode: function(b) {
                var b = m.getSetting(b.data.treeId)
                    , a = m.getRoot(b);
                if (a.curHoverNode && !m.isSelectedNode(b, a.curHoverNode))
                    f.removeTreeDom(b, a.curHoverNode),
                        a.curHoverNode = null
            },
            onMousedownNode: function(b, a) {
                function c(b) {
                    if (B.dragFlag == 0 && Math.abs(N - b.clientX) < e.edit.drag.minMoveSize && Math.abs(O - b.clientY) < e.edit.drag.minMoveSize)
                        return !0;
                    var a, c, n, k, i;
                    i = e.data.key.children;
                    M.css("cursor", "pointer");
                    if (B.dragFlag == 0) {
                        if (g.apply(e.callback.beforeDrag, [e.treeId, l], !0) == !1)
                            return r(b),
                                !0;
                        for (a = 0,
                                 c = l.length; a < c; a++) {
                            if (a == 0)
                                B.dragNodeShowBefore = [];
                            n = l[a];
                            n.isParent && n.open ? (f.expandCollapseNode(e, n, !n.open),
                                B.dragNodeShowBefore[n.tId] = !0) : B.dragNodeShowBefore[n.tId] = !1
                        }
                        B.dragFlag = 1;
                        t.showHoverDom = !1;
                        g.showIfameMask(e, !0);
                        n = !0;
                        k = -1;
                        if (l.length > 1) {
                            var j = l[0].parentTId ? l[0].getParentNode()[i] : m.getNodes(e);
                            i = [];
                            for (a = 0,
                                     c = j.length; a < c; a++)
                                if (B.dragNodeShowBefore[j[a].tId] !== void 0 && (n && k > -1 && k + 1 !== a && (n = !1),
                                    i.push(j[a]),
                                    k = a),
                                l.length === i.length) {
                                    l = i;
                                    break
                                }
                        }
                        n && (H = l[0].getPreNode(),
                            R = l[l.length - 1].getNextNode());
                        D = o("<ul class='zTreeDragUL'></ul>", e);
                        for (a = 0,
                                 c = l.length; a < c; a++)
                            n = l[a],
                                n.editNameFlag = !1,
                                f.selectNode(e, n, a > 0),
                                f.removeTreeDom(e, n),
                            a > e.edit.drag.maxShowNodeNum - 1 || (k = o("<li id='" + n.tId + "_tmp'></li>", e),
                                k.append(o(n, d.id.A, e).clone()),
                                k.css("padding", "0"),
                                k.children("#" + n.tId + d.id.A).removeClass(d.node.CURSELECTED),
                                D.append(k),
                            a == e.edit.drag.maxShowNodeNum - 1 && (k = o("<li id='" + n.tId + "_moretmp'><a>  ...  </a></li>", e),
                                D.append(k)));
                        D.attr("id", l[0].tId + d.id.UL + "_tmp");
                        D.addClass(e.treeObj.attr("class"));
                        D.appendTo(M);
                        A = o("<span class='tmpzTreeMove_arrow'></span>", e);
                        A.attr("id", "zTreeMove_arrow_tmp");
                        A.appendTo(M);
                        e.treeObj.trigger(d.event.DRAG, [b, e.treeId, l])
                    }
                    if (B.dragFlag == 1) {
                        s && A.attr("id") == b.target.id && u && b.clientX + F.scrollLeft() + 2 > v("#" + u + d.id.A, s).offset().left ? (n = v("#" + u + d.id.A, s),
                            b.target = n.length > 0 ? n.get(0) : b.target) : s && (s.removeClass(d.node.TMPTARGET_TREE),
                        u && v("#" + u + d.id.A, s).removeClass(d.node.TMPTARGET_NODE + "_" + d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE + "_" + I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE + "_" + I.move.TYPE_INNER));
                        u = s = null;
                        J = !1;
                        h = e;
                        n = m.getSettings();
                        for (var y in n)
                            if (n[y].treeId && n[y].edit.enable && n[y].treeId != e.treeId && (b.target.id == n[y].treeId || v(b.target).parents("#" + n[y].treeId).length > 0))
                                J = !0,
                                    h = n[y];
                        y = F.scrollTop();
                        k = F.scrollLeft();
                        i = h.treeObj.offset();
                        a = h.treeObj.get(0).scrollHeight;
                        n = h.treeObj.get(0).scrollWidth;
                        c = b.clientY + y - i.top;
                        var p = h.treeObj.height() + i.top - b.clientY - y
                            , q = b.clientX + k - i.left
                            , x = h.treeObj.width() + i.left - b.clientX - k;
                        i = c < e.edit.drag.borderMax && c > e.edit.drag.borderMin;
                        var j = p < e.edit.drag.borderMax && p > e.edit.drag.borderMin
                            , K = q < e.edit.drag.borderMax && q > e.edit.drag.borderMin
                            , G = x < e.edit.drag.borderMax && x > e.edit.drag.borderMin
                            , p = c > e.edit.drag.borderMin && p > e.edit.drag.borderMin && q > e.edit.drag.borderMin && x > e.edit.drag.borderMin
                            , q = i && h.treeObj.scrollTop() <= 0
                            , x = j && h.treeObj.scrollTop() + h.treeObj.height() + 10 >= a
                            , P = K && h.treeObj.scrollLeft() <= 0
                            , Q = G && h.treeObj.scrollLeft() + h.treeObj.width() + 10 >= n;
                        if (b.target && g.isChildOrSelf(b.target, h.treeId)) {
                            for (var E = b.target; E && E.tagName && !g.eqs(E.tagName, "li") && E.id != h.treeId; )
                                E = E.parentNode;
                            var S = !0;
                            for (a = 0,
                                     c = l.length; a < c; a++)
                                if (n = l[a],
                                E.id === n.tId) {
                                    S = !1;
                                    break
                                } else if (o(n, e).find("#" + E.id).length > 0) {
                                    S = !1;
                                    break
                                }
                            if (S && b.target && g.isChildOrSelf(b.target, E.id + d.id.A))
                                s = v(E),
                                    u = E.id
                        }
                        n = l[0];
                        if (p && g.isChildOrSelf(b.target, h.treeId)) {
                            if (!s && (b.target.id == h.treeId || q || x || P || Q) && (J || !J && n.parentTId))
                                s = h.treeObj;
                            i ? h.treeObj.scrollTop(h.treeObj.scrollTop() - 10) : j && h.treeObj.scrollTop(h.treeObj.scrollTop() + 10);
                            K ? h.treeObj.scrollLeft(h.treeObj.scrollLeft() - 10) : G && h.treeObj.scrollLeft(h.treeObj.scrollLeft() + 10);
                            s && s != h.treeObj && s.offset().left < h.treeObj.offset().left && h.treeObj.scrollLeft(h.treeObj.scrollLeft() + s.offset().left - h.treeObj.offset().left)
                        }
                        D.css({
                            top: b.clientY + y + 3 + "px",
                            left: b.clientX + k + 3 + "px"
                        });
                        i = a = 0;
                        if (s && s.attr("id") != h.treeId) {
                            var z = u == null ? null : m.getNodeCache(h, u);
                            c = (b.ctrlKey || b.metaKey) && e.edit.drag.isMove && e.edit.drag.isCopy || !e.edit.drag.isMove && e.edit.drag.isCopy;
                            a = !!(H && u === H.tId);
                            i = !!(R && u === R.tId);
                            k = n.parentTId && n.parentTId == u;
                            n = (c || !i) && g.apply(h.edit.drag.prev, [h.treeId, l, z], !!h.edit.drag.prev);
                            a = (c || !a) && g.apply(h.edit.drag.next, [h.treeId, l, z], !!h.edit.drag.next);
                            G = (c || !k) && !(h.data.keep.leaf && !z.isParent) && g.apply(h.edit.drag.inner, [h.treeId, l, z], !!h.edit.drag.inner);
                            if (!n && !a && !G) {
                                if (s = null,
                                    u = "",
                                    w = d.move.TYPE_INNER,
                                    A.css({
                                        display: "none"
                                    }),
                                    window.zTreeMoveTimer)
                                    clearTimeout(window.zTreeMoveTimer),
                                        window.zTreeMoveTargetNodeTId = null
                            } else {
                                c = v("#" + u + d.id.A, s);
                                i = z.isLastNode ? null : v("#" + z.getNextNode().tId + d.id.A, s.next());
                                j = c.offset().top;
                                k = c.offset().left;
                                K = n ? G ? 0.25 : a ? 0.5 : 1 : -1;
                                G = a ? G ? 0.75 : n ? 0.5 : 0 : -1;
                                y = (b.clientY + y - j) / c.height();
                                (K == 1 || y <= K && y >= -0.2) && n ? (a = 1 - A.width(),
                                    i = j - A.height() / 2,
                                    w = d.move.TYPE_PREV) : (G == 0 || y >= G && y <= 1.2) && a ? (a = 1 - A.width(),
                                    i = i == null || z.isParent && z.open ? j + c.height() - A.height() / 2 : i.offset().top - A.height() / 2,
                                    w = d.move.TYPE_NEXT) : (a = 5 - A.width(),
                                    i = j,
                                    w = d.move.TYPE_INNER);
                                A.css({
                                    display: "block",
                                    top: i + "px",
                                    left: k + a + "px"
                                });
                                c.addClass(d.node.TMPTARGET_NODE + "_" + w);
                                if (T != u || U != w)
                                    L = (new Date).getTime();
                                if (z && z.isParent && w == d.move.TYPE_INNER && (y = !0,
                                    window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== z.tId ? (clearTimeout(window.zTreeMoveTimer),
                                        window.zTreeMoveTargetNodeTId = null) : window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === z.tId && (y = !1),
                                    y))
                                    window.zTreeMoveTimer = setTimeout(function() {
                                        w == d.move.TYPE_INNER && z && z.isParent && !z.open && (new Date).getTime() - L > h.edit.drag.autoOpenTime && g.apply(h.callback.beforeDragOpen, [h.treeId, z], !0) && (f.switchNode(h, z),
                                        h.edit.drag.autoExpandTrigger && h.treeObj.trigger(d.event.EXPAND, [h.treeId, z]))
                                    }, h.edit.drag.autoOpenTime + 50),
                                        window.zTreeMoveTargetNodeTId = z.tId
                            }
                        } else if (w = d.move.TYPE_INNER,
                            s && g.apply(h.edit.drag.inner, [h.treeId, l, null], !!h.edit.drag.inner) ? s.addClass(d.node.TMPTARGET_TREE) : s = null,
                            A.css({
                                display: "none"
                            }),
                            window.zTreeMoveTimer)
                            clearTimeout(window.zTreeMoveTimer),
                                window.zTreeMoveTargetNodeTId = null;
                        T = u;
                        U = w;
                        e.treeObj.trigger(d.event.DRAGMOVE, [b, e.treeId, l])
                    }
                    return !1
                }
                function r(b) {
                    if (window.zTreeMoveTimer)
                        clearTimeout(window.zTreeMoveTimer),
                            window.zTreeMoveTargetNodeTId = null;
                    U = T = null;
                    F.unbind("mousemove", c);
                    F.unbind("mouseup", r);
                    F.unbind("selectstart", k);
                    M.css("cursor", "auto");
                    s && (s.removeClass(d.node.TMPTARGET_TREE),
                    u && v("#" + u + d.id.A, s).removeClass(d.node.TMPTARGET_NODE + "_" + d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE + "_" + I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE + "_" + I.move.TYPE_INNER));
                    g.showIfameMask(e, !1);
                    t.showHoverDom = !0;
                    if (B.dragFlag != 0) {
                        B.dragFlag = 0;
                        var a, i, j;
                        for (a = 0,
                                 i = l.length; a < i; a++)
                            j = l[a],
                            j.isParent && B.dragNodeShowBefore[j.tId] && !j.open && (f.expandCollapseNode(e, j, !j.open),
                                delete B.dragNodeShowBefore[j.tId]);
                        D && D.remove();
                        A && A.remove();
                        var p = (b.ctrlKey || b.metaKey) && e.edit.drag.isMove && e.edit.drag.isCopy || !e.edit.drag.isMove && e.edit.drag.isCopy;
                        !p && s && u && l[0].parentTId && u == l[0].parentTId && w == d.move.TYPE_INNER && (s = null);
                        if (s) {
                            var q = u == null ? null : m.getNodeCache(h, u);
                            if (g.apply(e.callback.beforeDrop, [h.treeId, l, q, w, p], !0) == !1)
                                f.selectNodes(x, l);
                            else {
                                var C = p ? g.clone(l) : l;
                                a = function() {
                                    if (J) {
                                        if (!p)
                                            for (var a = 0, c = l.length; a < c; a++)
                                                f.removeNode(e, l[a]);
                                        w == d.move.TYPE_INNER ? f.addNodes(h, q, -1, C) : f.addNodes(h, q.getParentNode(), w == d.move.TYPE_PREV ? q.getIndex() : q.getIndex() + 1, C)
                                    } else if (p && w == d.move.TYPE_INNER)
                                        f.addNodes(h, q, -1, C);
                                    else if (p)
                                        f.addNodes(h, q.getParentNode(), w == d.move.TYPE_PREV ? q.getIndex() : q.getIndex() + 1, C);
                                    else if (w != d.move.TYPE_NEXT)
                                        for (a = 0,
                                                 c = C.length; a < c; a++)
                                            f.moveNode(h, q, C[a], w, !1);
                                    else
                                        for (a = -1,
                                                 c = C.length - 1; a < c; c--)
                                            f.moveNode(h, q, C[c], w, !1);
                                    f.selectNodes(h, C);
                                    if (a = o(C[0], e).get(0))
                                        if (a.scrollIntoView)
                                            a.scrollIntoView();
                                        else
                                            try {
                                                a.focus().blur()
                                            } catch (r) {}
                                    e.treeObj.trigger(d.event.DROP, [b, h.treeId, C, q, w, p])
                                }
                                ;
                                w == d.move.TYPE_INNER && g.canAsync(h, q) ? f.asyncNode(h, q, !1, a) : a()
                            }
                        } else
                            f.selectNodes(x, l),
                                e.treeObj.trigger(d.event.DROP, [b, e.treeId, l, null, null, null])
                    }
                }
                function k() {
                    return !1
                }
                var i, j, e = m.getSetting(b.data.treeId), B = m.getRoot(e), t = m.getRoots();
                if (b.button == 2 || !e.edit.enable || !e.edit.drag.isCopy && !e.edit.drag.isMove)
                    return !0;
                var p = b.target
                    , q = m.getRoot(e).curSelectedList
                    , l = [];
                if (m.isSelectedNode(e, a))
                    for (i = 0,
                             j = q.length; i < j; i++) {
                        if (q[i].editNameFlag && g.eqs(p.tagName, "input") && p.getAttribute("treeNode" + d.id.INPUT) !== null)
                            return !0;
                        l.push(q[i]);
                        if (l[0].parentTId !== q[i].parentTId) {
                            l = [a];
                            break
                        }
                    }
                else
                    l = [a];
                f.editNodeBlur = !0;
                f.cancelCurEditNode(e);
                var F = v(e.treeObj.get(0).ownerDocument), M = v(e.treeObj.get(0).ownerDocument.body), D, A, s, J = !1, h = e, x = e, H, R, T = null, U = null, u = null, w = d.move.TYPE_INNER, N = b.clientX, O = b.clientY, L = (new Date).getTime();
                g.uCanDo(e) && F.bind("mousemove", c);
                F.bind("mouseup", r);
                F.bind("selectstart", k);
                b.preventDefault && b.preventDefault();
                return !0
            }
        };
        v.extend(!0, v.fn.zTree.consts, I);
        v.extend(!0, v.fn.zTree._z, {
            tools: {
                getAbs: function(b) {
                    b = b.getBoundingClientRect();
                    return [b.left + (document.body.scrollLeft + document.documentElement.scrollLeft), b.top + (document.body.scrollTop + document.documentElement.scrollTop)]
                },
                inputFocus: function(b) {
                    b.get(0) && (b.focus(),
                        g.setCursorPosition(b.get(0), b.val().length))
                },
                inputSelect: function(b) {
                    b.get(0) && (b.focus(),
                        b.select())
                },
                setCursorPosition: function(b, a) {
                    if (b.setSelectionRange)
                        b.focus(),
                            b.setSelectionRange(a, a);
                    else if (b.createTextRange) {
                        var c = b.createTextRange();
                        c.collapse(!0);
                        c.moveEnd("character", a);
                        c.moveStart("character", a);
                        c.select()
                    }
                },
                showIfameMask: function(b, a) {
                    for (var c = m.getRoot(b); c.dragMaskList.length > 0; )
                        c.dragMaskList[0].remove(),
                            c.dragMaskList.shift();
                    if (a)
                        for (var d = o("iframe", b), f = 0, i = d.length; f < i; f++) {
                            var j = d.get(f)
                                , e = g.getAbs(j)
                                , j = o("<div id='zTreeMask_" + f + "' class='zTreeMask' style='top:" + e[1] + "px; left:" + e[0] + "px; width:" + j.offsetWidth + "px; height:" + j.offsetHeight + "px;'></div>", b);
                            j.appendTo(o("body", b));
                            c.dragMaskList.push(j)
                        }
                }
            },
            view: {
                addEditBtn: function(b, a) {
                    if (!(a.editNameFlag || o(a, d.id.EDIT, b).length > 0) && g.apply(b.edit.showRenameBtn, [b.treeId, a], b.edit.showRenameBtn)) {
                        var c = o(a, d.id.A, b)
                            , r = "<span class='" + d.className.BUTTON + " edit' id='" + a.tId + d.id.EDIT + "' title='" + g.apply(b.edit.renameTitle, [b.treeId, a], b.edit.renameTitle) + "' treeNode" + d.id.EDIT + " style='display:none;'></span>";
                        c.append(r);
                        o(a, d.id.EDIT, b).bind("click", function() {
                            if (!g.uCanDo(b) || g.apply(b.callback.beforeEditName, [b.treeId, a], !0) == !1)
                                return !1;
                            f.editNode(b, a);
                            return !1
                        }).show()
                    }
                },
                addRemoveBtn: function(b, a) {
                    if (!(a.editNameFlag || o(a, d.id.REMOVE, b).length > 0) && g.apply(b.edit.showRemoveBtn, [b.treeId, a], b.edit.showRemoveBtn)) {
                        var c = o(a, d.id.A, b)
                            , r = "<span class='" + d.className.BUTTON + " remove' id='" + a.tId + d.id.REMOVE + "' title='" + g.apply(b.edit.removeTitle, [b.treeId, a], b.edit.removeTitle) + "' treeNode" + d.id.REMOVE + " style='display:none;'></span>";
                        c.append(r);
                        o(a, d.id.REMOVE, b).bind("click", function() {
                            if (!g.uCanDo(b) || g.apply(b.callback.beforeRemove, [b.treeId, a], !0) == !1)
                                return !1;
                            f.removeNode(b, a);
                            b.treeObj.trigger(d.event.REMOVE, [b.treeId, a]);
                            return !1
                        }).bind("mousedown", function() {
                            return !0
                        }).show()
                    }
                },
                addHoverDom: function(b, a) {
                    if (m.getRoots().showHoverDom)
                        a.isHover = !0,
                        b.edit.enable && (f.addEditBtn(b, a),
                            f.addRemoveBtn(b, a)),
                            g.apply(b.view.addHoverDom, [b.treeId, a])
                },
                cancelCurEditNode: function(b, a, c) {
                    var r = m.getRoot(b)
                        , k = b.data.key.name
                        , i = r.curEditNode;
                    if (i) {
                        var j = r.curEditInput
                            , a = a ? a : c ? i[k] : j.val();
                        if (g.apply(b.callback.beforeRename, [b.treeId, i, a, c], !0) === !1)
                            return !1;
                        i[k] = a;
                        o(i, d.id.A, b).removeClass(d.node.CURSELECTED_EDIT);
                        j.unbind();
                        f.setNodeName(b, i);
                        i.editNameFlag = !1;
                        r.curEditNode = null;
                        r.curEditInput = null;
                        f.selectNode(b, i, !1);
                        b.treeObj.trigger(d.event.RENAME, [b.treeId, i, c])
                    }
                    return r.noSelection = !0
                },
                editNode: function(b, a) {
                    var c = m.getRoot(b);
                    f.editNodeBlur = !1;
                    if (m.isSelectedNode(b, a) && c.curEditNode == a && a.editNameFlag)
                        setTimeout(function() {
                            g.inputFocus(c.curEditInput)
                        }, 0);
                    else {
                        var r = b.data.key.name;
                        a.editNameFlag = !0;
                        f.removeTreeDom(b, a);
                        f.cancelCurEditNode(b);
                        f.selectNode(b, a, !1);
                        o(a, d.id.SPAN, b).html("<input type=text class='rename' id='" + a.tId + d.id.INPUT + "' treeNode" + d.id.INPUT + " >");
                        var k = o(a, d.id.INPUT, b);
                        k.attr("value", a[r]);
                        b.edit.editNameSelectAll ? g.inputSelect(k) : g.inputFocus(k);
                        k.bind("blur", function() {
                            f.editNodeBlur || f.cancelCurEditNode(b)
                        }).bind("keydown", function(a) {
                            a.keyCode == "13" ? (f.editNodeBlur = !0,
                                f.cancelCurEditNode(b)) : a.keyCode == "27" && f.cancelCurEditNode(b, null, !0)
                        }).bind("click", function() {
                            return !1
                        }).bind("dblclick", function() {
                            return !1
                        });
                        o(a, d.id.A, b).addClass(d.node.CURSELECTED_EDIT);
                        c.curEditInput = k;
                        c.noSelection = !1;
                        c.curEditNode = a
                    }
                },
                moveNode: function(b, a, c, r, k, i) {
                    var j = m.getRoot(b)
                        , e = b.data.key.children;
                    if (a != c && (!b.data.keep.leaf || !a || a.isParent || r != d.move.TYPE_INNER)) {
                        var g = c.parentTId ? c.getParentNode() : j
                            , t = a === null || a == j;
                        t && a === null && (a = j);
                        if (t)
                            r = d.move.TYPE_INNER;
                        j = a.parentTId ? a.getParentNode() : j;
                        if (r != d.move.TYPE_PREV && r != d.move.TYPE_NEXT)
                            r = d.move.TYPE_INNER;
                        if (r == d.move.TYPE_INNER)
                            if (t)
                                c.parentTId = null;
                            else {
                                if (!a.isParent)
                                    a.isParent = !0,
                                        a.open = !!a.open,
                                        f.setNodeLineIcos(b, a);
                                c.parentTId = a.tId
                            }
                        var p;
                        t ? p = t = b.treeObj : (!i && r == d.move.TYPE_INNER ? f.expandCollapseNode(b, a, !0, !1) : i || f.expandCollapseNode(b, a.getParentNode(), !0, !1),
                            t = o(a, b),
                            p = o(a, d.id.UL, b),
                        t.get(0) && !p.get(0) && (p = [],
                            f.makeUlHtml(b, a, p, ""),
                            t.append(p.join(""))),
                            p = o(a, d.id.UL, b));
                        var q = o(c, b);
                        q.get(0) ? t.get(0) || q.remove() : q = f.appendNodes(b, c.level, [c], null, -1, !1, !0).join("");
                        p.get(0) && r == d.move.TYPE_INNER ? p.append(q) : t.get(0) && r == d.move.TYPE_PREV ? t.before(q) : t.get(0) && r == d.move.TYPE_NEXT && t.after(q);
                        var l = -1
                            , v = 0
                            , x = null
                            , t = null
                            , D = c.level;
                        if (c.isFirstNode) {
                            if (l = 0,
                            g[e].length > 1)
                                x = g[e][1],
                                    x.isFirstNode = !0
                        } else if (c.isLastNode)
                            l = g[e].length - 1,
                                x = g[e][l - 1],
                                x.isLastNode = !0;
                        else
                            for (p = 0,
                                     q = g[e].length; p < q; p++)
                                if (g[e][p].tId == c.tId) {
                                    l = p;
                                    break
                                }
                        l >= 0 && g[e].splice(l, 1);
                        if (r != d.move.TYPE_INNER)
                            for (p = 0,
                                     q = j[e].length; p < q; p++)
                                j[e][p].tId == a.tId && (v = p);
                        if (r == d.move.TYPE_INNER) {
                            a[e] || (a[e] = []);
                            if (a[e].length > 0)
                                t = a[e][a[e].length - 1],
                                    t.isLastNode = !1;
                            a[e].splice(a[e].length, 0, c);
                            c.isLastNode = !0;
                            c.isFirstNode = a[e].length == 1
                        } else
                            a.isFirstNode && r == d.move.TYPE_PREV ? (j[e].splice(v, 0, c),
                                t = a,
                                t.isFirstNode = !1,
                                c.parentTId = a.parentTId,
                                c.isFirstNode = !0,
                                c.isLastNode = !1) : a.isLastNode && r == d.move.TYPE_NEXT ? (j[e].splice(v + 1, 0, c),
                                t = a,
                                t.isLastNode = !1,
                                c.parentTId = a.parentTId,
                                c.isFirstNode = !1,
                                c.isLastNode = !0) : (r == d.move.TYPE_PREV ? j[e].splice(v, 0, c) : j[e].splice(v + 1, 0, c),
                                c.parentTId = a.parentTId,
                                c.isFirstNode = !1,
                                c.isLastNode = !1);
                        m.fixPIdKeyValue(b, c);
                        m.setSonNodeLevel(b, c.getParentNode(), c);
                        f.setNodeLineIcos(b, c);
                        f.repairNodeLevelClass(b, c, D);
                        !b.data.keep.parent && g[e].length < 1 ? (g.isParent = !1,
                            g.open = !1,
                            a = o(g, d.id.UL, b),
                            r = o(g, d.id.SWITCH, b),
                            e = o(g, d.id.ICON, b),
                            f.replaceSwitchClass(g, r, d.folder.DOCU),
                            f.replaceIcoClass(g, e, d.folder.DOCU),
                            a.css("display", "none")) : x && f.setNodeLineIcos(b, x);
                        t && f.setNodeLineIcos(b, t);
                        b.check && b.check.enable && f.repairChkClass && (f.repairChkClass(b, g),
                            f.repairParentChkClassWithSelf(b, g),
                        g != c.parent && f.repairParentChkClassWithSelf(b, c));
                        i || f.expandCollapseParentNode(b, c.getParentNode(), !0, k)
                    }
                },
                removeEditBtn: function(b, a) {
                    o(a, d.id.EDIT, b).unbind().remove()
                },
                removeRemoveBtn: function(b, a) {
                    o(a, d.id.REMOVE, b).unbind().remove()
                },
                removeTreeDom: function(b, a) {
                    a.isHover = !1;
                    f.removeEditBtn(b, a);
                    f.removeRemoveBtn(b, a);
                    g.apply(b.view.removeHoverDom, [b.treeId, a])
                },
                repairNodeLevelClass: function(b, a, c) {
                    if (c !== a.level) {
                        var f = o(a, b)
                            , g = o(a, d.id.A, b)
                            , b = o(a, d.id.UL, b)
                            , c = d.className.LEVEL + c
                            , a = d.className.LEVEL + a.level;
                        f.removeClass(c);
                        f.addClass(a);
                        g.removeClass(c);
                        g.addClass(a);
                        b.removeClass(c);
                        b.addClass(a)
                    }
                },
                selectNodes: function(b, a) {
                    for (var c = 0, d = a.length; c < d; c++)
                        f.selectNode(b, a[c], c > 0)
                }
            },
            event: {},
            data: {
                setSonNodeLevel: function(b, a, c) {
                    if (c) {
                        var d = b.data.key.children;
                        c.level = a ? a.level + 1 : 0;
                        if (c[d])
                            for (var a = 0, f = c[d].length; a < f; a++)
                                c[d][a] && m.setSonNodeLevel(b, c, c[d][a])
                    }
                }
            }
        });
        var H = v.fn.zTree
            , g = H._z.tools
            , d = H.consts
            , f = H._z.view
            , m = H._z.data
            , o = g.$;
        m.exSetting({
            edit: {
                enable: !1,
                editNameSelectAll: !1,
                showRemoveBtn: !0,
                showRenameBtn: !0,
                removeTitle: "删除",
                renameTitle: "编辑",
                drag: {
                    autoExpandTrigger: !1,
                    isCopy: !0,
                    isMove: !0,
                    prev: !0,
                    next: !0,
                    inner: !0,
                    minMoveSize: 5,
                    borderMax: 10,
                    borderMin: -5,
                    maxShowNodeNum: 5,
                    autoOpenTime: 500
                }
            },
            view: {
                addHoverDom: null,
                removeHoverDom: null
            },
            callback: {
                beforeDrag: null,
                beforeDragOpen: null,
                beforeDrop: null,
                beforeEditName: null,
                beforeRename: null,
                onDrag: null,
                onDragMove: null,
                onDrop: null,
                onRename: null
            }
        });
        m.addInitBind(function(b) {
            var a = b.treeObj
                , c = d.event;
            a.bind(c.RENAME, function(a, c, d, f) {
                g.apply(b.callback.onRename, [a, c, d, f])
            });
            a.bind(c.DRAG, function(a, c, d, f) {
                g.apply(b.callback.onDrag, [c, d, f])
            });
            a.bind(c.DRAGMOVE, function(a, c, d, f) {
                g.apply(b.callback.onDragMove, [c, d, f])
            });
            a.bind(c.DROP, function(a, c, d, f, e, m, o) {
                g.apply(b.callback.onDrop, [c, d, f, e, m, o])
            })
        });
        m.addInitUnBind(function(b) {
            var b = b.treeObj
                , a = d.event;
            b.unbind(a.RENAME);
            b.unbind(a.DRAG);
            b.unbind(a.DRAGMOVE);
            b.unbind(a.DROP)
        });
        m.addInitCache(function() {});
        m.addInitNode(function(b, a, c) {
            if (c)
                c.isHover = !1,
                    c.editNameFlag = !1
        });
        m.addInitProxy(function(b) {
            var a = b.target
                , c = m.getSetting(b.data.treeId)
                , f = b.relatedTarget
                , k = ""
                , i = null
                , j = ""
                , e = null
                , o = null;
            if (g.eqs(b.type, "mouseover")) {
                if (o = g.getMDom(c, a, [{
                    tagName: "a",
                    attrName: "treeNode" + d.id.A
                }]))
                    k = g.getNodeMainDom(o).id,
                        j = "hoverOverNode"
            } else if (g.eqs(b.type, "mouseout"))
                o = g.getMDom(c, f, [{
                    tagName: "a",
                    attrName: "treeNode" + d.id.A
                }]),
                o || (k = "remove",
                    j = "hoverOutNode");
            else if (g.eqs(b.type, "mousedown") && (o = g.getMDom(c, a, [{
                tagName: "a",
                attrName: "treeNode" + d.id.A
            }])))
                k = g.getNodeMainDom(o).id,
                    j = "mousedownNode";
            if (k.length > 0)
                switch (i = m.getNodeCache(c, k),
                    j) {
                    case "mousedownNode":
                        e = x.onMousedownNode;
                        break;
                    case "hoverOverNode":
                        e = x.onHoverOverNode;
                        break;
                    case "hoverOutNode":
                        e = x.onHoverOutNode
                }
            return {
                stop: !1,
                node: i,
                nodeEventType: j,
                nodeEventCallback: e,
                treeEventType: "",
                treeEventCallback: null
            }
        });
        m.addInitRoot(function(b) {
            var b = m.getRoot(b)
                , a = m.getRoots();
            b.curEditNode = null;
            b.curEditInput = null;
            b.curHoverNode = null;
            b.dragFlag = 0;
            b.dragNodeShowBefore = [];
            b.dragMaskList = [];
            a.showHoverDom = !0
        });
        m.addZTreeTools(function(b, a) {
            a.cancelEditName = function(a) {
                m.getRoot(this.setting).curEditNode && f.cancelCurEditNode(this.setting, a ? a : null, !0)
            }
            ;
            a.copyNode = function(a, b, k, i) {
                if (!b)
                    return null;
                if (a && !a.isParent && this.setting.data.keep.leaf && k === d.move.TYPE_INNER)
                    return null;
                var j = this
                    , e = g.clone(b);
                if (!a)
                    a = null,
                        k = d.move.TYPE_INNER;
                k == d.move.TYPE_INNER ? (b = function() {
                    f.addNodes(j.setting, a, -1, [e], i)
                }
                    ,
                    g.canAsync(this.setting, a) ? f.asyncNode(this.setting, a, i, b) : b()) : (f.addNodes(this.setting, a.parentNode, -1, [e], i),
                    f.moveNode(this.setting, a, e, k, !1, i));
                return e
            }
            ;
            a.editName = function(a) {
                a && a.tId && a === m.getNodeCache(this.setting, a.tId) && (a.parentTId && f.expandCollapseParentNode(this.setting, a.getParentNode(), !0),
                    f.editNode(this.setting, a))
            }
            ;
            a.moveNode = function(a, b, k, i) {
                function j() {
                    f.moveNode(e.setting, a, b, k, !1, i)
                }
                if (!b)
                    return b;
                if (a && !a.isParent && this.setting.data.keep.leaf && k === d.move.TYPE_INNER)
                    return null;
                else if (a && (b.parentTId == a.tId && k == d.move.TYPE_INNER || o(b, this.setting).find("#" + a.tId).length > 0))
                    return null;
                else
                    a || (a = null);
                var e = this;
                g.canAsync(this.setting, a) && k === d.move.TYPE_INNER ? f.asyncNode(this.setting, a, i, j) : j();
                return b
            }
            ;
            a.setEditable = function(a) {
                this.setting.edit.enable = a;
                return this.refresh()
            }
        });
        var N = f.cancelPreSelectedNode;
        f.cancelPreSelectedNode = function(b, a) {
            for (var c = m.getRoot(b).curSelectedList, d = 0, g = c.length; d < g; d++)
                if (!a || a === c[d])
                    if (f.removeTreeDom(b, c[d]),
                        a)
                        break;
            N && N.apply(f, arguments)
        }
        ;
        var O = f.createNodes;
        f.createNodes = function(b, a, c, d, g) {
            O && O.apply(f, arguments);
            c && f.repairParentChkClassWithSelf && f.repairParentChkClassWithSelf(b, d)
        }
        ;
        var V = f.makeNodeUrl;
        f.makeNodeUrl = function(b, a) {
            return b.edit.enable ? null : V.apply(f, arguments)
        }
        ;
        var L = f.removeNode;
        f.removeNode = function(b, a) {
            var c = m.getRoot(b);
            if (c.curEditNode === a)
                c.curEditNode = null;
            L && L.apply(f, arguments)
        }
        ;
        var P = f.selectNode;
        f.selectNode = function(b, a, c) {
            var d = m.getRoot(b);
            if (m.isSelectedNode(b, a) && d.curEditNode == a && a.editNameFlag)
                return !1;
            P && P.apply(f, arguments);
            f.addHoverDom(b, a);
            return !0
        }
        ;
        var Q = g.uCanDo;
        g.uCanDo = function(b, a) {
            var c = m.getRoot(b);
            if (a && (g.eqs(a.type, "mouseover") || g.eqs(a.type, "mouseout") || g.eqs(a.type, "mousedown") || g.eqs(a.type, "mouseup")))
                return !0;
            if (c.curEditNode)
                f.editNodeBlur = !1,
                    c.curEditInput.focus();
            return !c.curEditNode && (Q ? Q.apply(f, arguments) : !0)
        }
    }
)(jQuery);
!function(e) {
    e(["jquery"], function(e) {
        return function() {
            function t(e, t, n) {
                return f({
                    type: O.error,
                    iconClass: g().iconClasses.error,
                    message: e,
                    optionsOverride: n,
                    title: t
                })
            }
            function n(t, n) {
                return t || (t = g()),
                    v = e("#" + t.containerId),
                    v.length ? v : (n && (v = c(t)),
                        v)
            }
            function i(e, t, n) {
                return f({
                    type: O.info,
                    iconClass: g().iconClasses.info,
                    message: e,
                    optionsOverride: n,
                    title: t
                })
            }
            function o(e) {
                w = e
            }
            function s(e, t, n) {
                return f({
                    type: O.success,
                    iconClass: g().iconClasses.success,
                    message: e,
                    optionsOverride: n,
                    title: t
                })
            }
            function a(e, t, n) {
                return f({
                    type: O.warning,
                    iconClass: g().iconClasses.warning,
                    message: e,
                    optionsOverride: n,
                    title: t
                })
            }
            function r(e) {
                var t = g();
                v || n(t),
                l(e, t) || u(t)
            }
            function d(t) {
                var i = g();
                return v || n(i),
                    t && 0 === e(":focus", t).length ? void h(t) : void (v.children().length && v.remove())
            }
            function u(t) {
                for (var n = v.children(), i = n.length - 1; i >= 0; i--)
                    l(e(n[i]), t)
            }
            function l(t, n) {
                return t && 0 === e(":focus", t).length ? (t[n.hideMethod]({
                    duration: n.hideDuration,
                    easing: n.hideEasing,
                    complete: function() {
                        h(t)
                    }
                }),
                    !0) : !1
            }
            function c(t) {
                return v = e("<div/>").attr("id", t.containerId).addClass(t.positionClass).attr("aria-live", "polite").attr("role", "alert"),
                    v.appendTo(e(t.target)),
                    v
            }
            function p() {
                return {
                    tapToDismiss: !0,
                    toastClass: "toast",
                    containerId: "toast-container",
                    debug: !1,
                    showMethod: "fadeIn",
                    showDuration: 300,
                    showEasing: "swing",
                    onShown: void 0,
                    hideMethod: "fadeOut",
                    hideDuration: 1e3,
                    hideEasing: "swing",
                    onHidden: void 0,
                    extendedTimeOut: 1e3,
                    iconClasses: {
                        error: "toast-error",
                        info: "toast-info",
                        success: "toast-success",
                        warning: "toast-warning"
                    },
                    iconClass: "toast-info",
                    positionClass: "toast-top-right",
                    timeOut: 5e3,
                    titleClass: "toast-title",
                    messageClass: "toast-message",
                    target: "body",
                    closeHtml: '<button type="button">&times;</button>',
                    newestOnTop: !0,
                    preventDuplicates: !1,
                    progressBar: !1
                }
            }
            function m(e) {
                w && w(e)
            }
            function f(t) {
                function i(t) {
                    return !e(":focus", l).length || t ? (clearTimeout(O.intervalId),
                        l[r.hideMethod]({
                            duration: r.hideDuration,
                            easing: r.hideEasing,
                            complete: function() {
                                h(l),
                                r.onHidden && "hidden" !== b.state && r.onHidden(),
                                    b.state = "hidden",
                                    b.endTime = new Date,
                                    m(b)
                            }
                        })) : void 0
                }
                function o() {
                    (r.timeOut > 0 || r.extendedTimeOut > 0) && (u = setTimeout(i, r.extendedTimeOut),
                        O.maxHideTime = parseFloat(r.extendedTimeOut),
                        O.hideEta = (new Date).getTime() + O.maxHideTime)
                }
                function s() {
                    clearTimeout(u),
                        O.hideEta = 0,
                        l.stop(!0, !0)[r.showMethod]({
                            duration: r.showDuration,
                            easing: r.showEasing
                        })
                }
                function a() {
                    var e = (O.hideEta - (new Date).getTime()) / O.maxHideTime * 100;
                    f.width(e + "%")
                }
                var r = g()
                    , d = t.iconClass || r.iconClass;
                if ("undefined" != typeof t.optionsOverride && (r = e.extend(r, t.optionsOverride),
                    d = t.optionsOverride.iconClass || d),
                    r.preventDuplicates) {
                    if (t.message === C)
                        return;
                    C = t.message
                }
                T++,
                    v = n(r, !0);
                var u = null
                    , l = e("<div/>")
                    , c = e("<div/>")
                    , p = e("<div/>")
                    , f = e("<div/>")
                    , w = e(r.closeHtml)
                    , O = {
                    intervalId: null,
                    hideEta: null,
                    maxHideTime: null
                }
                    , b = {
                    toastId: T,
                    state: "visible",
                    startTime: new Date,
                    options: r,
                    map: t
                };
                return t.iconClass && l.addClass(r.toastClass).addClass(d),
                t.title && (c.append(t.title).addClass(r.titleClass),
                    l.append(c)),
                t.message && (p.append(t.message).addClass(r.messageClass),
                    l.append(p)),
                r.closeButton && (w.addClass("toast-close-button").attr("role", "button"),
                    l.prepend(w)),
                r.progressBar && (f.addClass("toast-progress"),
                    l.prepend(f)),
                    l.hide(),
                    r.newestOnTop ? v.prepend(l) : v.append(l),
                    l[r.showMethod]({
                        duration: r.showDuration,
                        easing: r.showEasing,
                        complete: r.onShown
                    }),
                r.timeOut > 0 && (u = setTimeout(i, r.timeOut),
                    O.maxHideTime = parseFloat(r.timeOut),
                    O.hideEta = (new Date).getTime() + O.maxHideTime,
                r.progressBar && (O.intervalId = setInterval(a, 10))),
                    l.hover(s, o),
                !r.onclick && r.tapToDismiss && l.click(i),
                r.closeButton && w && w.click(function(e) {
                    e.stopPropagation ? e.stopPropagation() : void 0 !== e.cancelBubble && e.cancelBubble !== !0 && (e.cancelBubble = !0),
                        i(!0)
                }),
                r.onclick && l.click(function() {
                    r.onclick(),
                        i()
                }),
                    m(b),
                r.debug && console && console.log(b),
                    l
            }
            function g() {
                return e.extend({}, p(), b.options)
            }
            function h(e) {
                v || (v = n()),
                e.is(":visible") || (e.remove(),
                    e = null,
                0 === v.children().length && (v.remove(),
                    C = void 0))
            }
            var v, w, C, T = 0, O = {
                error: "error",
                info: "info",
                success: "success",
                warning: "warning"
            }, b = {
                clear: r,
                remove: d,
                error: t,
                getContainer: n,
                info: i,
                options: {},
                subscribe: o,
                success: s,
                version: "2.1.0",
                warning: a
            };
            return b
        }()
    })
}("function" == typeof define && define.amd ? define : function(e, t) {
        "undefined" != typeof module && module.exports ? module.exports = t(require("jquery")) : window.toastr = t(window.jQuery)
    }
);
/*
 * JQuery zTree excheck v3.5.30
 * http://treejs.cn/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2017-11-11
 */
(function(m) {
        var p, q, r, o = {
            event: {
                CHECK: "ztree_check"
            },
            id: {
                CHECK: "_check"
            },
            checkbox: {
                STYLE: "checkbox",
                DEFAULT: "chk",
                DISABLED: "disable",
                FALSE: "false",
                TRUE: "true",
                FULL: "full",
                PART: "part",
                FOCUS: "focus"
            },
            radio: {
                STYLE: "radio",
                TYPE_ALL: "all",
                TYPE_LEVEL: "level"
            }
        }, v = {
            check: {
                enable: !1,
                autoCheckTrigger: !1,
                chkStyle: o.checkbox.STYLE,
                nocheckInherit: !1,
                chkDisabledInherit: !1,
                radioType: o.radio.TYPE_LEVEL,
                chkboxType: {
                    Y: "ps",
                    N: "ps"
                }
            },
            data: {
                key: {
                    checked: "checked"
                }
            },
            callback: {
                beforeCheck: null,
                onCheck: null
            }
        };
        p = function(c, a) {
            if (a.chkDisabled === !0)
                return !1;
            var b = g.getSetting(c.data.treeId)
                , d = b.data.key.checked;
            if (k.apply(b.callback.beforeCheck, [b.treeId, a], !0) == !1)
                return !0;
            a[d] = !a[d];
            e.checkNodeRelation(b, a);
            d = n(a, j.id.CHECK, b);
            e.setChkClass(b, d, a);
            e.repairParentChkClassWithSelf(b, a);
            b.treeObj.trigger(j.event.CHECK, [c, b.treeId, a]);
            return !0
        }
        ;
        q = function(c, a) {
            if (a.chkDisabled === !0)
                return !1;
            var b = g.getSetting(c.data.treeId)
                , d = n(a, j.id.CHECK, b);
            a.check_Focus = !0;
            e.setChkClass(b, d, a);
            return !0
        }
        ;
        r = function(c, a) {
            if (a.chkDisabled === !0)
                return !1;
            var b = g.getSetting(c.data.treeId)
                , d = n(a, j.id.CHECK, b);
            a.check_Focus = !1;
            e.setChkClass(b, d, a);
            return !0
        }
        ;
        m.extend(!0, m.fn.zTree.consts, o);
        m.extend(!0, m.fn.zTree._z, {
            tools: {},
            view: {
                checkNodeRelation: function(c, a) {
                    var b, d, h, i = c.data.key.children, l = c.data.key.checked;
                    b = j.radio;
                    if (c.check.chkStyle == b.STYLE) {
                        var f = g.getRadioCheckedList(c);
                        if (a[l])
                            if (c.check.radioType == b.TYPE_ALL) {
                                for (d = f.length - 1; d >= 0; d--)
                                    b = f[d],
                                    b[l] && b != a && (b[l] = !1,
                                        f.splice(d, 1),
                                        e.setChkClass(c, n(b, j.id.CHECK, c), b),
                                    b.parentTId != a.parentTId && e.repairParentChkClassWithSelf(c, b));
                                f.push(a)
                            } else {
                                f = a.parentTId ? a.getParentNode() : g.getRoot(c);
                                for (d = 0,
                                         h = f[i].length; d < h; d++)
                                    b = f[i][d],
                                    b[l] && b != a && (b[l] = !1,
                                        e.setChkClass(c, n(b, j.id.CHECK, c), b))
                            }
                        else if (c.check.radioType == b.TYPE_ALL)
                            for (d = 0,
                                     h = f.length; d < h; d++)
                                if (a == f[d]) {
                                    f.splice(d, 1);
                                    break
                                }
                    } else
                        a[l] && (!a[i] || a[i].length == 0 || c.check.chkboxType.Y.indexOf("s") > -1) && e.setSonNodeCheckBox(c, a, !0),
                        !a[l] && (!a[i] || a[i].length == 0 || c.check.chkboxType.N.indexOf("s") > -1) && e.setSonNodeCheckBox(c, a, !1),
                        a[l] && c.check.chkboxType.Y.indexOf("p") > -1 && e.setParentNodeCheckBox(c, a, !0),
                        !a[l] && c.check.chkboxType.N.indexOf("p") > -1 && e.setParentNodeCheckBox(c, a, !1)
                },
                makeChkClass: function(c, a) {
                    var b = c.data.key.checked
                        , d = j.checkbox
                        , h = j.radio
                        , i = ""
                        , i = a.chkDisabled === !0 ? d.DISABLED : a.halfCheck ? d.PART : c.check.chkStyle == h.STYLE ? a.check_Child_State < 1 ? d.FULL : d.PART : a[b] ? a.check_Child_State === 2 || a.check_Child_State === -1 ? d.FULL : d.PART : a.check_Child_State < 1 ? d.FULL : d.PART
                        , b = c.check.chkStyle + "_" + (a[b] ? d.TRUE : d.FALSE) + "_" + i
                        , b = a.check_Focus && a.chkDisabled !== !0 ? b + "_" + d.FOCUS : b;
                    return j.className.BUTTON + " " + d.DEFAULT + " " + b
                },
                repairAllChk: function(c, a) {
                    if (c.check.enable && c.check.chkStyle === j.checkbox.STYLE)
                        for (var b = c.data.key.checked, d = c.data.key.children, h = g.getRoot(c), i = 0, l = h[d].length; i < l; i++) {
                            var f = h[d][i];
                            f.nocheck !== !0 && f.chkDisabled !== !0 && (f[b] = a);
                            e.setSonNodeCheckBox(c, f, a)
                        }
                },
                repairChkClass: function(c, a) {
                    if (a && (g.makeChkFlag(c, a),
                    a.nocheck !== !0)) {
                        var b = n(a, j.id.CHECK, c);
                        e.setChkClass(c, b, a)
                    }
                },
                repairParentChkClass: function(c, a) {
                    if (a && a.parentTId) {
                        var b = a.getParentNode();
                        e.repairChkClass(c, b);
                        e.repairParentChkClass(c, b)
                    }
                },
                repairParentChkClassWithSelf: function(c, a) {
                    if (a) {
                        var b = c.data.key.children;
                        a[b] && a[b].length > 0 ? e.repairParentChkClass(c, a[b][0]) : e.repairParentChkClass(c, a)
                    }
                },
                repairSonChkDisabled: function(c, a, b, d) {
                    if (a) {
                        var h = c.data.key.children;
                        if (a.chkDisabled != b)
                            a.chkDisabled = b;
                        e.repairChkClass(c, a);
                        if (a[h] && d)
                            for (var i = 0, l = a[h].length; i < l; i++)
                                e.repairSonChkDisabled(c, a[h][i], b, d)
                    }
                },
                repairParentChkDisabled: function(c, a, b, d) {
                    if (a) {
                        if (a.chkDisabled != b && d)
                            a.chkDisabled = b;
                        e.repairChkClass(c, a);
                        e.repairParentChkDisabled(c, a.getParentNode(), b, d)
                    }
                },
                setChkClass: function(c, a, b) {
                    a && (b.nocheck === !0 ? a.hide() : a.show(),
                        a.attr("class", e.makeChkClass(c, b)))
                },
                setParentNodeCheckBox: function(c, a, b, d) {
                    var h = c.data.key.children
                        , i = c.data.key.checked
                        , l = n(a, j.id.CHECK, c);
                    d || (d = a);
                    g.makeChkFlag(c, a);
                    a.nocheck !== !0 && a.chkDisabled !== !0 && (a[i] = b,
                        e.setChkClass(c, l, a),
                    c.check.autoCheckTrigger && a != d && c.treeObj.trigger(j.event.CHECK, [null, c.treeId, a]));
                    if (a.parentTId) {
                        l = !0;
                        if (!b)
                            for (var h = a.getParentNode()[h], f = 0, k = h.length; f < k; f++)
                                if (h[f].nocheck !== !0 && h[f].chkDisabled !== !0 && h[f][i] || (h[f].nocheck === !0 || h[f].chkDisabled === !0) && h[f].check_Child_State > 0) {
                                    l = !1;
                                    break
                                }
                        l && e.setParentNodeCheckBox(c, a.getParentNode(), b, d)
                    }
                },
                setSonNodeCheckBox: function(c, a, b, d) {
                    if (a) {
                        var h = c.data.key.children
                            , i = c.data.key.checked
                            , l = n(a, j.id.CHECK, c);
                        d || (d = a);
                        var f = !1;
                        if (a[h])
                            for (var k = 0, m = a[h].length; k < m; k++) {
                                var o = a[h][k];
                                e.setSonNodeCheckBox(c, o, b, d);
                                o.chkDisabled === !0 && (f = !0)
                            }
                        if (a != g.getRoot(c) && a.chkDisabled !== !0) {
                            f && a.nocheck !== !0 && g.makeChkFlag(c, a);
                            if (a.nocheck !== !0 && a.chkDisabled !== !0) {
                                if (a[i] = b,
                                    !f)
                                    a.check_Child_State = a[h] && a[h].length > 0 ? b ? 2 : 0 : -1
                            } else
                                a.check_Child_State = -1;
                            e.setChkClass(c, l, a);
                            c.check.autoCheckTrigger && a != d && a.nocheck !== !0 && a.chkDisabled !== !0 && c.treeObj.trigger(j.event.CHECK, [null, c.treeId, a])
                        }
                    }
                }
            },
            event: {},
            data: {
                getRadioCheckedList: function(c) {
                    for (var a = g.getRoot(c).radioCheckedList, b = 0, d = a.length; b < d; b++)
                        g.getNodeCache(c, a[b].tId) || (a.splice(b, 1),
                            b--,
                            d--);
                    return a
                },
                getCheckStatus: function(c, a) {
                    if (!c.check.enable || a.nocheck || a.chkDisabled)
                        return null;
                    var b = c.data.key.checked;
                    return {
                        checked: a[b],
                        half: a.halfCheck ? a.halfCheck : c.check.chkStyle == j.radio.STYLE ? a.check_Child_State === 2 : a[b] ? a.check_Child_State > -1 && a.check_Child_State < 2 : a.check_Child_State > 0
                    }
                },
                getTreeCheckedNodes: function(c, a, b, d) {
                    if (!a)
                        return [];
                    for (var h = c.data.key.children, i = c.data.key.checked, e = b && c.check.chkStyle == j.radio.STYLE && c.check.radioType == j.radio.TYPE_ALL, d = !d ? [] : d, f = 0, k = a.length; f < k; f++) {
                        if (a[f].nocheck !== !0 && a[f].chkDisabled !== !0 && a[f][i] == b && (d.push(a[f]),
                            e))
                            break;
                        g.getTreeCheckedNodes(c, a[f][h], b, d);
                        if (e && d.length > 0)
                            break
                    }
                    return d
                },
                getTreeChangeCheckedNodes: function(c, a, b) {
                    if (!a)
                        return [];
                    for (var d = c.data.key.children, h = c.data.key.checked, b = !b ? [] : b, i = 0, e = a.length; i < e; i++)
                        a[i].nocheck !== !0 && a[i].chkDisabled !== !0 && a[i][h] != a[i].checkedOld && b.push(a[i]),
                            g.getTreeChangeCheckedNodes(c, a[i][d], b);
                    return b
                },
                makeChkFlag: function(c, a) {
                    if (a) {
                        var b = c.data.key.children
                            , d = c.data.key.checked
                            , h = -1;
                        if (a[b])
                            for (var i = 0, e = a[b].length; i < e; i++) {
                                var f = a[b][i]
                                    , g = -1;
                                if (c.check.chkStyle == j.radio.STYLE)
                                    if (g = f.nocheck === !0 || f.chkDisabled === !0 ? f.check_Child_State : f.halfCheck === !0 ? 2 : f[d] ? 2 : f.check_Child_State > 0 ? 2 : 0,
                                    g == 2) {
                                        h = 2;
                                        break
                                    } else
                                        g == 0 && (h = 0);
                                else if (c.check.chkStyle == j.checkbox.STYLE)
                                    if (g = f.nocheck === !0 || f.chkDisabled === !0 ? f.check_Child_State : f.halfCheck === !0 ? 1 : f[d] ? f.check_Child_State === -1 || f.check_Child_State === 2 ? 2 : 1 : f.check_Child_State > 0 ? 1 : 0,
                                    g === 1) {
                                        h = 1;
                                        break
                                    } else if (g === 2 && h > -1 && i > 0 && g !== h) {
                                        h = 1;
                                        break
                                    } else if (h === 2 && g > -1 && g < 2) {
                                        h = 1;
                                        break
                                    } else
                                        g > -1 && (h = g)
                            }
                        a.check_Child_State = h
                    }
                }
            }
        });
        var m = m.fn.zTree
            , k = m._z.tools
            , j = m.consts
            , e = m._z.view
            , g = m._z.data
            , n = k.$;
        g.exSetting(v);
        g.addInitBind(function(c) {
            c.treeObj.bind(j.event.CHECK, function(a, b, d, h) {
                a.srcEvent = b;
                k.apply(c.callback.onCheck, [a, d, h])
            })
        });
        g.addInitUnBind(function(c) {
            c.treeObj.unbind(j.event.CHECK)
        });
        g.addInitCache(function() {});
        g.addInitNode(function(c, a, b, d) {
            if (b) {
                a = c.data.key.checked;
                typeof b[a] == "string" && (b[a] = k.eqs(b[a], "true"));
                b[a] = !!b[a];
                b.checkedOld = b[a];
                if (typeof b.nocheck == "string")
                    b.nocheck = k.eqs(b.nocheck, "true");
                b.nocheck = !!b.nocheck || c.check.nocheckInherit && d && !!d.nocheck;
                if (typeof b.chkDisabled == "string")
                    b.chkDisabled = k.eqs(b.chkDisabled, "true");
                b.chkDisabled = !!b.chkDisabled || c.check.chkDisabledInherit && d && !!d.chkDisabled;
                if (typeof b.halfCheck == "string")
                    b.halfCheck = k.eqs(b.halfCheck, "true");
                b.halfCheck = !!b.halfCheck;
                b.check_Child_State = -1;
                b.check_Focus = !1;
                b.getCheckStatus = function() {
                    return g.getCheckStatus(c, b)
                }
                ;
                c.check.chkStyle == j.radio.STYLE && c.check.radioType == j.radio.TYPE_ALL && b[a] && g.getRoot(c).radioCheckedList.push(b)
            }
        });
        g.addInitProxy(function(c) {
            var a = c.target
                , b = g.getSetting(c.data.treeId)
                , d = ""
                , h = null
                , e = ""
                , l = null;
            if (k.eqs(c.type, "mouseover")) {
                if (b.check.enable && k.eqs(a.tagName, "span") && a.getAttribute("treeNode" + j.id.CHECK) !== null)
                    d = k.getNodeMainDom(a).id,
                        e = "mouseoverCheck"
            } else if (k.eqs(c.type, "mouseout")) {
                if (b.check.enable && k.eqs(a.tagName, "span") && a.getAttribute("treeNode" + j.id.CHECK) !== null)
                    d = k.getNodeMainDom(a).id,
                        e = "mouseoutCheck"
            } else if (k.eqs(c.type, "click") && b.check.enable && k.eqs(a.tagName, "span") && a.getAttribute("treeNode" + j.id.CHECK) !== null)
                d = k.getNodeMainDom(a).id,
                    e = "checkNode";
            if (d.length > 0)
                switch (h = g.getNodeCache(b, d),
                    e) {
                    case "checkNode":
                        l = p;
                        break;
                    case "mouseoverCheck":
                        l = q;
                        break;
                    case "mouseoutCheck":
                        l = r
                }
            return {
                stop: e === "checkNode",
                node: h,
                nodeEventType: e,
                nodeEventCallback: l,
                treeEventType: "",
                treeEventCallback: null
            }
        }, !0);
        g.addInitRoot(function(c) {
            g.getRoot(c).radioCheckedList = []
        });
        g.addBeforeA(function(c, a, b) {
            c.check.enable && (g.makeChkFlag(c, a),
                b.push("<span ID='", a.tId, j.id.CHECK, "' class='", e.makeChkClass(c, a), "' treeNode", j.id.CHECK, a.nocheck === !0 ? " style='display:none;'" : "", "></span>"))
        });
        g.addZTreeTools(function(c, a) {
            a.checkNode = function(a, b, c, g) {
                var f = this.setting.data.key.checked;
                if (a.chkDisabled !== !0 && (b !== !0 && b !== !1 && (b = !a[f]),
                    g = !!g,
                (a[f] !== b || c) && !(g && k.apply(this.setting.callback.beforeCheck, [this.setting.treeId, a], !0) == !1) && k.uCanDo(this.setting) && this.setting.check.enable && a.nocheck !== !0))
                    a[f] = b,
                        b = n(a, j.id.CHECK, this.setting),
                    (c || this.setting.check.chkStyle === j.radio.STYLE) && e.checkNodeRelation(this.setting, a),
                        e.setChkClass(this.setting, b, a),
                        e.repairParentChkClassWithSelf(this.setting, a),
                    g && this.setting.treeObj.trigger(j.event.CHECK, [null, this.setting.treeId, a])
            }
            ;
            a.checkAllNodes = function(a) {
                e.repairAllChk(this.setting, !!a)
            }
            ;
            a.getCheckedNodes = function(a) {
                var b = this.setting.data.key.children;
                return g.getTreeCheckedNodes(this.setting, g.getRoot(this.setting)[b], a !== !1)
            }
            ;
            a.getChangeCheckedNodes = function() {
                var a = this.setting.data.key.children;
                return g.getTreeChangeCheckedNodes(this.setting, g.getRoot(this.setting)[a])
            }
            ;
            a.setChkDisabled = function(a, b, c, g) {
                b = !!b;
                c = !!c;
                e.repairSonChkDisabled(this.setting, a, b, !!g);
                e.repairParentChkDisabled(this.setting, a.getParentNode(), b, c)
            }
            ;
            var b = a.updateNode;
            a.updateNode = function(c, g) {
                b && b.apply(a, arguments);
                if (c && this.setting.check.enable && n(c, this.setting).get(0) && k.uCanDo(this.setting)) {
                    var i = n(c, j.id.CHECK, this.setting);
                    (g == !0 || this.setting.check.chkStyle === j.radio.STYLE) && e.checkNodeRelation(this.setting, c);
                    e.setChkClass(this.setting, i, c);
                    e.repairParentChkClassWithSelf(this.setting, c)
                }
            }
        });
        var s = e.createNodes;
        e.createNodes = function(c, a, b, d, g) {
            s && s.apply(e, arguments);
            b && e.repairParentChkClassWithSelf(c, d)
        }
        ;
        var t = e.removeNode;
        e.removeNode = function(c, a) {
            var b = a.getParentNode();
            t && t.apply(e, arguments);
            a && b && (e.repairChkClass(c, b),
                e.repairParentChkClass(c, b))
        }
        ;
        var u = e.appendNodes;
        e.appendNodes = function(c, a, b, d, h, i, j) {
            var f = "";
            u && (f = u.apply(e, arguments));
            d && g.makeChkFlag(c, d);
            return f
        }
    }
)(jQuery);

//mcode
var QRCode;
!function() {
    function a(a) {
        this.mode = c.MODE_8BIT_BYTE,
            this.data = a,
            this.parsedData = [];
        for (var b = [], d = 0, e = this.data.length; e > d; d++) {
            var f = this.data.charCodeAt(d);
            f > 65536 ? (b[0] = 240 | (1835008 & f) >>> 18,
                b[1] = 128 | (258048 & f) >>> 12,
                b[2] = 128 | (4032 & f) >>> 6,
                b[3] = 128 | 63 & f) : f > 2048 ? (b[0] = 224 | (61440 & f) >>> 12,
                b[1] = 128 | (4032 & f) >>> 6,
                b[2] = 128 | 63 & f) : f > 128 ? (b[0] = 192 | (1984 & f) >>> 6,
                b[1] = 128 | 63 & f) : b[0] = f,
                this.parsedData = this.parsedData.concat(b)
        }
        this.parsedData.length != this.data.length && (this.parsedData.unshift(191),
            this.parsedData.unshift(187),
            this.parsedData.unshift(239))
    }
    function b(a, b) {
        this.typeNumber = a,
            this.errorCorrectLevel = b,
            this.modules = null,
            this.moduleCount = 0,
            this.dataCache = null,
            this.dataList = []
    }
    function i(a, b) {
        if (void 0 == a.length)
            throw new Error(a.length + "/" + b);
        for (var c = 0; c < a.length && 0 == a[c]; )
            c++;
        this.num = new Array(a.length - c + b);
        for (var d = 0; d < a.length - c; d++)
            this.num[d] = a[d + c]
    }
    function j(a, b) {
        this.totalCount = a,
            this.dataCount = b
    }
    function k() {
        this.buffer = [],
            this.length = 0
    }
    function m() {
        return "undefined" != typeof CanvasRenderingContext2D
    }
    function n() {
        var a = !1
            , b = navigator.userAgent;
        return /android/i.test(b) && (a = !0,
            aMat = b.toString().match(/android ([0-9]\.[0-9])/i),
        aMat && aMat[1] && (a = parseFloat(aMat[1]))),
            a
    }
    function r(a, b) {
        for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) {
            var h = 0;
            switch (b) {
                case d.L:
                    h = l[f][0];
                    break;
                case d.M:
                    h = l[f][1];
                    break;
                case d.Q:
                    h = l[f][2];
                    break;
                case d.H:
                    h = l[f][3]
            }
            if (h >= e)
                break;
            c++
        }
        if (c > l.length)
            throw new Error("Too long data");
        return c
    }
    function s(a) {
        var b = encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return b.length + (b.length != a ? 3 : 0)
    }
    a.prototype = {
        getLength: function() {
            return this.parsedData.length
        },
        write: function(a) {
            for (var b = 0, c = this.parsedData.length; c > b; b++)
                a.put(this.parsedData[b], 8)
        }
    },
        b.prototype = {
            addData: function(b) {
                var c = new a(b);
                this.dataList.push(c),
                    this.dataCache = null
            },
            isDark: function(a, b) {
                if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b)
                    throw new Error(a + "," + b);
                return this.modules[a][b]
            },
            getModuleCount: function() {
                return this.moduleCount
            },
            make: function() {
                this.makeImpl(!1, this.getBestMaskPattern())
            },
            makeImpl: function(a, c) {
                this.moduleCount = 4 * this.typeNumber + 17,
                    this.modules = new Array(this.moduleCount);
                for (var d = 0; d < this.moduleCount; d++) {
                    this.modules[d] = new Array(this.moduleCount);
                    for (var e = 0; e < this.moduleCount; e++)
                        this.modules[d][e] = null
                }
                this.setupPositionProbePattern(0, 0),
                    this.setupPositionProbePattern(this.moduleCount - 7, 0),
                    this.setupPositionProbePattern(0, this.moduleCount - 7),
                    this.setupPositionAdjustPattern(),
                    this.setupTimingPattern(),
                    this.setupTypeInfo(a, c),
                this.typeNumber >= 7 && this.setupTypeNumber(a),
                null == this.dataCache && (this.dataCache = b.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                    this.mapData(this.dataCache, c)
            },
            setupPositionProbePattern: function(a, b) {
                for (var c = -1; 7 >= c; c++)
                    if (!(-1 >= a + c || this.moduleCount <= a + c))
                        for (var d = -1; 7 >= d; d++)
                            -1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? !0 : !1)
            },
            getBestMaskPattern: function() {
                for (var a = 0, b = 0, c = 0; 8 > c; c++) {
                    this.makeImpl(!0, c);
                    var d = f.getLostPoint(this);
                    (0 == c || a > d) && (a = d,
                        b = c)
                }
                return b
            },
            createMovieClip: function(a, b, c) {
                var d = a.createEmptyMovieClip(b, c)
                    , e = 1;
                this.make();
                for (var f = 0; f < this.modules.length; f++)
                    for (var g = f * e, h = 0; h < this.modules[f].length; h++) {
                        var i = h * e
                            , j = this.modules[f][h];
                        j && (d.beginFill(0, 100),
                            d.moveTo(i, g),
                            d.lineTo(i + e, g),
                            d.lineTo(i + e, g + e),
                            d.lineTo(i, g + e),
                            d.endFill())
                    }
                return d
            },
            setupTimingPattern: function() {
                for (var a = 8; a < this.moduleCount - 8; a++)
                    null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
                for (var b = 8; b < this.moduleCount - 8; b++)
                    null == this.modules[6][b] && (this.modules[6][b] = 0 == b % 2)
            },
            setupPositionAdjustPattern: function() {
                for (var a = f.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)
                    for (var c = 0; c < a.length; c++) {
                        var d = a[b]
                            , e = a[c];
                        if (null == this.modules[d][e])
                            for (var g = -2; 2 >= g; g++)
                                for (var h = -2; 2 >= h; h++)
                                    this.modules[d + g][e + h] = -2 == g || 2 == g || -2 == h || 2 == h || 0 == g && 0 == h ? !0 : !1
                    }
            },
            setupTypeNumber: function(a) {
                for (var b = f.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
                    var d = !a && 1 == (1 & b >> c);
                    this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d
                }
                for (var c = 0; 18 > c; c++) {
                    var d = !a && 1 == (1 & b >> c);
                    this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d
                }
            },
            setupTypeInfo: function(a, b) {
                for (var c = this.errorCorrectLevel << 3 | b, d = f.getBCHTypeInfo(c), e = 0; 15 > e; e++) {
                    var g = !a && 1 == (1 & d >> e);
                    6 > e ? this.modules[e][8] = g : 8 > e ? this.modules[e + 1][8] = g : this.modules[this.moduleCount - 15 + e][8] = g
                }
                for (var e = 0; 15 > e; e++) {
                    var g = !a && 1 == (1 & d >> e);
                    8 > e ? this.modules[8][this.moduleCount - e - 1] = g : 9 > e ? this.modules[8][15 - e - 1 + 1] = g : this.modules[8][15 - e - 1] = g
                }
                this.modules[this.moduleCount - 8][8] = !a
            },
            mapData: function(a, b) {
                for (var c = -1, d = this.moduleCount - 1, e = 7, g = 0, h = this.moduleCount - 1; h > 0; h -= 2)
                    for (6 == h && h--; ; ) {
                        for (var i = 0; 2 > i; i++)
                            if (null == this.modules[d][h - i]) {
                                var j = !1;
                                g < a.length && (j = 1 == (1 & a[g] >>> e));
                                var k = f.getMask(b, d, h - i);
                                k && (j = !j),
                                    this.modules[d][h - i] = j,
                                    e--,
                                -1 == e && (g++,
                                    e = 7)
                            }
                        if (d += c,
                        0 > d || this.moduleCount <= d) {
                            d -= c,
                                c = -c;
                            break
                        }
                    }
            }
        },
        b.PAD0 = 236,
        b.PAD1 = 17,
        b.createData = function(a, c, d) {
            for (var e = j.getRSBlocks(a, c), g = new k, h = 0; h < d.length; h++) {
                var i = d[h];
                g.put(i.mode, 4),
                    g.put(i.getLength(), f.getLengthInBits(i.mode, a)),
                    i.write(g)
            }
            for (var l = 0, h = 0; h < e.length; h++)
                l += e[h].dataCount;
            if (g.getLengthInBits() > 8 * l)
                throw new Error("code length overflow. (" + g.getLengthInBits() + ">" + 8 * l + ")");
            for (g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4); 0 != g.getLengthInBits() % 8; )
                g.putBit(!1);
            for (; ; ) {
                if (g.getLengthInBits() >= 8 * l)
                    break;
                if (g.put(b.PAD0, 8),
                g.getLengthInBits() >= 8 * l)
                    break;
                g.put(b.PAD1, 8)
            }
            return b.createBytes(g, e)
        }
        ,
        b.createBytes = function(a, b) {
            for (var c = 0, d = 0, e = 0, g = new Array(b.length), h = new Array(b.length), j = 0; j < b.length; j++) {
                var k = b[j].dataCount
                    , l = b[j].totalCount - k;
                d = Math.max(d, k),
                    e = Math.max(e, l),
                    g[j] = new Array(k);
                for (var m = 0; m < g[j].length; m++)
                    g[j][m] = 255 & a.buffer[m + c];
                c += k;
                var n = f.getErrorCorrectPolynomial(l)
                    , o = new i(g[j],n.getLength() - 1)
                    , p = o.mod(n);
                h[j] = new Array(n.getLength() - 1);
                for (var m = 0; m < h[j].length; m++) {
                    var q = m + p.getLength() - h[j].length;
                    h[j][m] = q >= 0 ? p.get(q) : 0
                }
            }
            for (var r = 0, m = 0; m < b.length; m++)
                r += b[m].totalCount;
            for (var s = new Array(r), t = 0, m = 0; d > m; m++)
                for (var j = 0; j < b.length; j++)
                    m < g[j].length && (s[t++] = g[j][m]);
            for (var m = 0; e > m; m++)
                for (var j = 0; j < b.length; j++)
                    m < h[j].length && (s[t++] = h[j][m]);
            return s
        }
    ;
    for (var c = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
    }, d = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    }, e = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    }, f = {
        PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function(a) {
            for (var b = a << 10; f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0; )
                b ^= f.G15 << f.getBCHDigit(b) - f.getBCHDigit(f.G15);
            return (a << 10 | b) ^ f.G15_MASK
        },
        getBCHTypeNumber: function(a) {
            for (var b = a << 12; f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0; )
                b ^= f.G18 << f.getBCHDigit(b) - f.getBCHDigit(f.G18);
            return a << 12 | b
        },
        getBCHDigit: function(a) {
            for (var b = 0; 0 != a; )
                b++,
                    a >>>= 1;
            return b
        },
        getPatternPosition: function(a) {
            return f.PATTERN_POSITION_TABLE[a - 1]
        },
        getMask: function(a, b, c) {
            switch (a) {
                case e.PATTERN000:
                    return 0 == (b + c) % 2;
                case e.PATTERN001:
                    return 0 == b % 2;
                case e.PATTERN010:
                    return 0 == c % 3;
                case e.PATTERN011:
                    return 0 == (b + c) % 3;
                case e.PATTERN100:
                    return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;
                case e.PATTERN101:
                    return 0 == b * c % 2 + b * c % 3;
                case e.PATTERN110:
                    return 0 == (b * c % 2 + b * c % 3) % 2;
                case e.PATTERN111:
                    return 0 == (b * c % 3 + (b + c) % 2) % 2;
                default:
                    throw new Error("bad maskPattern:" + a)
            }
        },
        getErrorCorrectPolynomial: function(a) {
            for (var b = new i([1],0), c = 0; a > c; c++)
                b = b.multiply(new i([1, g.gexp(c)],0));
            return b
        },
        getLengthInBits: function(a, b) {
            if (b >= 1 && 10 > b)
                switch (a) {
                    case c.MODE_NUMBER:
                        return 10;
                    case c.MODE_ALPHA_NUM:
                        return 9;
                    case c.MODE_8BIT_BYTE:
                        return 8;
                    case c.MODE_KANJI:
                        return 8;
                    default:
                        throw new Error("mode:" + a)
                }
            else if (27 > b)
                switch (a) {
                    case c.MODE_NUMBER:
                        return 12;
                    case c.MODE_ALPHA_NUM:
                        return 11;
                    case c.MODE_8BIT_BYTE:
                        return 16;
                    case c.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + a)
                }
            else {
                if (!(41 > b))
                    throw new Error("type:" + b);
                switch (a) {
                    case c.MODE_NUMBER:
                        return 14;
                    case c.MODE_ALPHA_NUM:
                        return 13;
                    case c.MODE_8BIT_BYTE:
                        return 16;
                    case c.MODE_KANJI:
                        return 12;
                    default:
                        throw new Error("mode:" + a)
                }
            }
        },
        getLostPoint: function(a) {
            for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)
                for (var e = 0; b > e; e++) {
                    for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)
                        if (!(0 > d + h || d + h >= b))
                            for (var i = -1; 1 >= i; i++)
                                0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && f++;
                    f > 5 && (c += 3 + f - 5)
                }
            for (var d = 0; b - 1 > d; d++)
                for (var e = 0; b - 1 > e; e++) {
                    var j = 0;
                    a.isDark(d, e) && j++,
                    a.isDark(d + 1, e) && j++,
                    a.isDark(d, e + 1) && j++,
                    a.isDark(d + 1, e + 1) && j++,
                    (0 == j || 4 == j) && (c += 3)
                }
            for (var d = 0; b > d; d++)
                for (var e = 0; b - 6 > e; e++)
                    a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
            for (var e = 0; b > e; e++)
                for (var d = 0; b - 6 > d; d++)
                    a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
            for (var k = 0, e = 0; b > e; e++)
                for (var d = 0; b > d; d++)
                    a.isDark(d, e) && k++;
            var l = Math.abs(100 * k / b / b - 50) / 5;
            return c += 10 * l
        }
    }, g = {
        glog: function(a) {
            if (1 > a)
                throw new Error("glog(" + a + ")");
            return g.LOG_TABLE[a]
        },
        gexp: function(a) {
            for (; 0 > a; )
                a += 255;
            for (; a >= 256; )
                a -= 255;
            return g.EXP_TABLE[a]
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
    }, h = 0; 8 > h; h++)
        g.EXP_TABLE[h] = 1 << h;
    for (var h = 8; 256 > h; h++)
        g.EXP_TABLE[h] = g.EXP_TABLE[h - 4] ^ g.EXP_TABLE[h - 5] ^ g.EXP_TABLE[h - 6] ^ g.EXP_TABLE[h - 8];
    for (var h = 0; 255 > h; h++)
        g.LOG_TABLE[g.EXP_TABLE[h]] = h;
    i.prototype = {
        get: function(a) {
            return this.num[a]
        },
        getLength: function() {
            return this.num.length
        },
        multiply: function(a) {
            for (var b = new Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)
                for (var d = 0; d < a.getLength(); d++)
                    b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d)));
            return new i(b,0)
        },
        mod: function(a) {
            if (this.getLength() - a.getLength() < 0)
                return this;
            for (var b = g.glog(this.get(0)) - g.glog(a.get(0)), c = new Array(this.getLength()), d = 0; d < this.getLength(); d++)
                c[d] = this.get(d);
            for (var d = 0; d < a.getLength(); d++)
                c[d] ^= g.gexp(g.glog(a.get(d)) + b);
            return new i(c,0).mod(a)
        }
    },
        j.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
        j.getRSBlocks = function(a, b) {
            var c = j.getRsBlockTable(a, b);
            if (void 0 == c)
                throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
            for (var d = c.length / 3, e = [], f = 0; d > f; f++)
                for (var g = c[3 * f + 0], h = c[3 * f + 1], i = c[3 * f + 2], k = 0; g > k; k++)
                    e.push(new j(h,i));
            return e
        }
        ,
        j.getRsBlockTable = function(a, b) {
            switch (b) {
                case d.L:
                    return j.RS_BLOCK_TABLE[4 * (a - 1) + 0];
                case d.M:
                    return j.RS_BLOCK_TABLE[4 * (a - 1) + 1];
                case d.Q:
                    return j.RS_BLOCK_TABLE[4 * (a - 1) + 2];
                case d.H:
                    return j.RS_BLOCK_TABLE[4 * (a - 1) + 3];
                default:
                    return void 0
            }
        }
        ,
        k.prototype = {
            get: function(a) {
                var b = Math.floor(a / 8);
                return 1 == (1 & this.buffer[b] >>> 7 - a % 8)
            },
            put: function(a, b) {
                for (var c = 0; b > c; c++)
                    this.putBit(1 == (1 & a >>> b - c - 1))
            },
            getLengthInBits: function() {
                return this.length
            },
            putBit: function(a) {
                var b = Math.floor(this.length / 8);
                this.buffer.length <= b && this.buffer.push(0),
                a && (this.buffer[b] |= 128 >>> this.length % 8),
                    this.length++
            }
        };
    var l = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]]
        , o = function() {
        var a = function(a, b) {
            this._el = a,
                this._htOption = b
        };
        return a.prototype.draw = function(a) {
            function g(a, b) {
                var c = document.createElementNS("http://www.w3.org/2000/svg", a);
                for (var d in b)
                    b.hasOwnProperty(d) && c.setAttribute(d, b[d]);
                return c
            }
            var b = this._htOption
                , c = this._el
                , d = a.getModuleCount();
            Math.floor(b.width / d),
                Math.floor(b.height / d),
                this.clear();
            var h = g("svg", {
                viewBox: "0 0 " + String(d) + " " + String(d),
                width: "100%",
                height: "100%",
                fill: b.colorLight
            });
            h.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"),
                c.appendChild(h),
                h.appendChild(g("rect", {
                    fill: b.colorDark,
                    width: "1",
                    height: "1",
                    id: "template"
                }));
            for (var i = 0; d > i; i++)
                for (var j = 0; d > j; j++)
                    if (a.isDark(i, j)) {
                        var k = g("use", {
                            x: String(i),
                            y: String(j)
                        });
                        k.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"),
                            h.appendChild(k)
                    }
        }
            ,
            a.prototype.clear = function() {
                for (; this._el.hasChildNodes(); )
                    this._el.removeChild(this._el.lastChild)
            }
            ,
            a
    }()
        , p = "svg" === document.documentElement.tagName.toLowerCase()
        , q = p ? o : m() ? function() {
        function a() {
            this._elImage.src = this._elCanvas.toDataURL("image/png"),
                this._elImage.style.display = "block",
                this._elCanvas.style.display = "none"
        }
        function d(a, b) {
            var c = this;
            if (c._fFail = b,
                c._fSuccess = a,
            null === c._bSupportDataURI) {
                var d = document.createElement("img")
                    , e = function() {
                    c._bSupportDataURI = !1,
                    c._fFail && _fFail.call(c)
                }
                    , f = function() {
                    c._bSupportDataURI = !0,
                    c._fSuccess && c._fSuccess.call(c)
                };
                return d.onabort = e,
                    d.onerror = e,
                    d.onload = f,
                    d.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
                    void 0
            }
            c._bSupportDataURI === !0 && c._fSuccess ? c._fSuccess.call(c) : c._bSupportDataURI === !1 && c._fFail && c._fFail.call(c)
        }
        if (this._android && this._android <= 2.1) {
            var b = 1 / window.devicePixelRatio
                , c = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function(a, d, e, f, g, h, i, j) {
                if ("nodeName"in a && /img/i.test(a.nodeName))
                    for (var l = arguments.length - 1; l >= 1; l--)
                        arguments[l] = arguments[l] * b;
                else
                    "undefined" == typeof j && (arguments[1] *= b,
                        arguments[2] *= b,
                        arguments[3] *= b,
                        arguments[4] *= b);
                c.apply(this, arguments)
            }
        }
        var e = function(a, b) {
            this._bIsPainted = !1,
                this._android = n(),
                this._htOption = b,
                this._elCanvas = document.createElement("canvas"),
                this._elCanvas.width = b.width,
                this._elCanvas.height = b.height,
                a.appendChild(this._elCanvas),
                this._el = a,
                this._oContext = this._elCanvas.getContext("2d"),
                this._bIsPainted = !1,
                this._elImage = document.createElement("img"),
                this._elImage.style.display = "none",
                this._el.appendChild(this._elImage),
                this._bSupportDataURI = null
        };
        return e.prototype.draw = function(a) {
            var b = this._elImage
                , c = this._oContext
                , d = this._htOption
                , e = a.getModuleCount()
                , f = d.width / e
                , g = d.height / e
                , h = Math.round(f)
                , i = Math.round(g);
            b.style.display = "none",
                this.clear();
            for (var j = 0; e > j; j++)
                for (var k = 0; e > k; k++) {
                    var l = a.isDark(j, k)
                        , m = k * f
                        , n = j * g;
                    c.strokeStyle = l ? d.colorDark : d.colorLight,
                        c.lineWidth = 1,
                        c.fillStyle = l ? d.colorDark : d.colorLight,
                        c.fillRect(m, n, f, g),
                        c.strokeRect(Math.floor(m) + .5, Math.floor(n) + .5, h, i),
                        c.strokeRect(Math.ceil(m) - .5, Math.ceil(n) - .5, h, i)
                }
            this._bIsPainted = !0
        }
            ,
            e.prototype.makeImage = function() {
                this._bIsPainted && d.call(this, a)
            }
            ,
            e.prototype.isPainted = function() {
                return this._bIsPainted
            }
            ,
            e.prototype.clear = function() {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height),
                    this._bIsPainted = !1
            }
            ,
            e.prototype.round = function(a) {
                return a ? Math.floor(1e3 * a) / 1e3 : a
            }
            ,
            e
    }() : function() {
        var a = function(a, b) {
            this._el = a,
                this._htOption = b
        };
        return a.prototype.draw = function(a) {
            for (var b = this._htOption, c = this._el, d = a.getModuleCount(), e = Math.floor(b.width / d), f = Math.floor(b.height / d), g = ['<table style="border:0;border-collapse:collapse;">'], h = 0; d > h; h++) {
                g.push("<tr>");
                for (var i = 0; d > i; i++)
                    g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + e + "px;height:" + f + "px;background-color:" + (a.isDark(h, i) ? b.colorDark : b.colorLight) + ';"></td>');
                g.push("</tr>")
            }
            g.push("</table>"),
                c.innerHTML = g.join("");
            var j = c.childNodes[0]
                , k = (b.width - j.offsetWidth) / 2
                , l = (b.height - j.offsetHeight) / 2;
            k > 0 && l > 0 && (j.style.margin = l + "px " + k + "px")
        }
            ,
            a.prototype.clear = function() {
                this._el.innerHTML = ""
            }
            ,
            a
    }();
    QRCode = function(a, b) {
        if (this._htOption = {
            width: 256,
            height: 256,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: d.H
        },
        "string" == typeof b && (b = {
            text: b
        }),
            b)
            for (var c in b)
                this._htOption[c] = b[c];
        "string" == typeof a && (a = document.getElementById(a)),
            this._android = n(),
            this._el = a,
            this._oQRCode = null,
            this._oDrawing = new q(this._el,this._htOption),
        this._htOption.text && this.makeCode(this._htOption.text)
    }
        ,
        QRCode.prototype.makeCode = function(a) {
            this._oQRCode = new b(r(a, this._htOption.correctLevel),this._htOption.correctLevel),
                this._oQRCode.addData(a),
                this._oQRCode.make(),
                this._el.title = a,
                this._oDrawing.draw(this._oQRCode),
                this.makeImage()
        }
        ,
        QRCode.prototype.makeImage = function() {
            "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
        }
        ,
        QRCode.prototype.clear = function() {
            this._oDrawing.clear()
        }
        ,
        QRCode.CorrectLevel = d
}();
/******************************************************************************
 * jquery.i18n.properties
 *
 * Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and
 * MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
 *
 * @version     1.2.2
 * @url         https://github.com/jquery-i18n-properties/jquery-i18n-properties
 * @inspiration Localisation assistance for jQuery (http://keith-wood.name/localisation.html)
 *              by Keith Wood (kbwood{at}iinet.com.au) June 2007
 *
 *****************************************************************************/
!function($) {
    function callbackIfComplete(e) {
        e.async && (e.filesLoaded += 1,
        e.filesLoaded === e.totalFiles && e.callback && e.callback())
    }
    function loadAndParseFile(e, a) {
        $.ajax({
            url: e,
            async: a.async,
            cache: a.cache,
            dataType: "text",
            success: function(e, r) {
                parseData(e, a.mode),
                    callbackIfComplete(a)
            },
            error: function(r, t, n) {
                console.log("Failed to download or parse " + e),
                    callbackIfComplete(a)
            }
        })
    }
    function parseData(data, mode) {
        for (var parsed = "", parameters = data.split(/\n/), regPlaceHolder = /(\{\d+})/g, regRepPlaceHolder = /\{(\d+)}/g, unicodeRE = /(\\u.{4})/gi, i = 0; i < parameters.length; i++)
            if (parameters[i] = parameters[i].replace(/^\s\s*/, "").replace(/\s\s*$/, ""),
            parameters[i].length > 0 && "#" != parameters[i].match("^#")) {
                var pair = parameters[i].split("=")
                if (pair.length > 0) {
                    for (var name = decodeURI(pair[0]).replace(/^\s\s*/, "").replace(/\s\s*$/, ""), value = 1 == pair.length ? "" : pair[1]; "\\" == value.match(/\\$/); )
                        value = value.substring(0, value.length - 1),
                            value += parameters[++i].replace(/\s\s*$/, "")
                    for (var s = 2; s < pair.length; s++)
                        value += "=" + pair[s]
                    if (value = value.replace(/^\s\s*/, "").replace(/\s\s*$/, ""),
                    "map" == mode || "both" == mode) {
                        var unicodeMatches = value.match(unicodeRE)
                        if (unicodeMatches)
                            for (var u = 0; u < unicodeMatches.length; u++)
                                value = value.replace(unicodeMatches[u], unescapeUnicode(unicodeMatches[u]))
                        $.i18n.map[name] = value
                    }
                    if ("vars" == mode || "both" == mode)
                        if (value = value.replace(/"/g, '\\"'),
                            checkKeyNamespace(name),
                            regPlaceHolder.test(value)) {
                            for (var parts = value.split(regPlaceHolder), first = !0, fnArgs = "", usedArgs = [], p = 0; p < parts.length; p++)
                                !regPlaceHolder.test(parts[p]) || 0 != usedArgs.length && -1 != usedArgs.indexOf(parts[p]) || (first || (fnArgs += ","),
                                    fnArgs += parts[p].replace(regRepPlaceHolder, "v$1"),
                                    usedArgs.push(parts[p]),
                                    first = !1)
                            parsed += name + "=function(" + fnArgs + "){"
                            var fnExpr = '"' + value.replace(regRepPlaceHolder, '"+v$1+"') + '"'
                            parsed += "return " + fnExpr + ";};"
                        } else
                            parsed += name + '="' + value + '";'
                }
            }
        eval(parsed)
    }
    function checkKeyNamespace(key) {
        var regDot = /\./
        if (regDot.test(key))
            for (var fullname = "", names = key.split(/\./), i = 0; i < names.length; i++)
                i > 0 && (fullname += "."),
                    fullname += names[i],
                eval("typeof " + fullname + ' == "undefined"') && eval(fullname + "={};")
    }
    function getFiles(e) {
        return e && e.constructor == Array ? e : [e]
    }
    function unescapeUnicode(e) {
        var a = []
            , r = parseInt(e.substr(2), 16)
        r >= 0 && r < Math.pow(2, 16) && a.push(r)
        for (var t = "", n = 0; n < a.length; ++n)
            t += String.fromCharCode(a[n])
        return t
    }
    $.i18n = {},
        $.i18n.map = {},
        $.i18n.properties = function(e) {
            var a = {
                name: "Messages",
                language: "",
                path: "",
                mode: "vars",
                cache: !1,
                encoding: "UTF-8",
                async: !1,
                checkAvailableLanguages: !1,
                callback: null
            }
            e = $.extend(a, e),
                e.language = this.normaliseLanguageCode(e.language)
            var r = function(a) {
                e.totalFiles = 0,
                    e.filesLoaded = 0
                var r = getFiles(e.name)
                if (e.async)
                    for (var t = 0, n = r.length; n > t; t++) {
                        e.totalFiles += 1
                        var s = e.language.substring(0, 2)
                        if (0 != a.length && -1 == $.inArray(s, a) || (e.totalFiles += 1),
                        e.language.length >= 5) {
                            var l = e.language.substring(0, 5)
                            0 != a.length && -1 == $.inArray(l, a) || (e.totalFiles += 1)
                        }
                    }
                for (var i = 0, g = r.length; g > i; i++) {
                    loadAndParseFile(e.path + r[i] + ".properties", e)
                }
                e.callback && !e.async && e.callback()
            }
            e.checkAvailableLanguages ? $.ajax({
                url: e.path + "languages.json",
                async: e.async,
                cache: !1,
                success: function(e, a, t) {
                    r(e.languages || [])
                }
            }) : r([])
        }
        ,
        $.i18n.prop = function(e) {
            var a = $.i18n.map[e]
            if (null == a)
                return "[" + e + "]"
            var r
            2 == arguments.length && $.isArray(arguments[1]) && (r = arguments[1])
            var t
            if ("string" == typeof a) {
                for (t = 0; -1 != (t = a.indexOf("\\", t)); )
                    a = "t" == a.charAt(t + 1) ? a.substring(0, t) + "	" + a.substring(t++ + 2) : "r" == a.charAt(t + 1) ? a.substring(0, t) + "\r" + a.substring(t++ + 2) : "n" == a.charAt(t + 1) ? a.substring(0, t) + "\n" + a.substring(t++ + 2) : "f" == a.charAt(t + 1) ? a.substring(0, t) + "\f" + a.substring(t++ + 2) : "\\" == a.charAt(t + 1) ? a.substring(0, t) + "\\" + a.substring(t++ + 2) : a.substring(0, t) + a.substring(t + 1)
                var n, s, l = []
                for (t = 0; t < a.length; )
                    if ("'" == a.charAt(t))
                        if (t == a.length - 1)
                            a = a.substring(0, t)
                        else if ("'" == a.charAt(t + 1))
                            a = a.substring(0, t) + a.substring(++t)
                        else {
                            for (n = t + 2; -1 != (n = a.indexOf("'", n)); ) {
                                if (n == a.length - 1 || "'" != a.charAt(n + 1)) {
                                    a = a.substring(0, t) + a.substring(t + 1, n) + a.substring(n + 1),
                                        t = n - 1
                                    break
                                }
                                a = a.substring(0, n) + a.substring(++n)
                            }
                            -1 == n && (a = a.substring(0, t) + a.substring(t + 1))
                        }
                    else if ("{" == a.charAt(t))
                        if (n = a.indexOf("}", t + 1),
                        -1 == n)
                            t++
                        else if (s = parseInt(a.substring(t + 1, n)),
                        !isNaN(s) && s >= 0) {
                            var i = a.substring(0, t)
                            "" != i && l.push(i),
                                l.push(s),
                                t = 0,
                                a = a.substring(n + 1)
                        } else
                            t = n + 1
                    else
                        t++
                "" != a && l.push(a),
                    a = l,
                    $.i18n.map[e] = l
            }
            if (0 == a.length)
                return ""
            if (1 == a.length && "string" == typeof a[0])
                return a[0]
            var g = ""
            for (t = 0; t < a.length; t++)
                g += "string" == typeof a[t] ? a[t] : r && a[t] < r.length ? r[a[t]] : !r && a[t] + 1 < arguments.length ? arguments[a[t] + 1] : "{" + a[t] + "}"
            return g
        }
        ,
        $.i18n.normaliseLanguageCode = function(e) {
            return (!e || e.length < 2) && (e = navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage || "en"),
                e = e.toLowerCase(),
                e = e.replace(/-/, "_"),
            e.length > 3 && (e = e.substring(0, 3) + e.substring(3).toUpperCase()),
                e
        }
    var cbSplit
    cbSplit || (cbSplit = function(e, a, r) {
        if ("[object RegExp]" !== Object.prototype.toString.call(a))
            return "undefined" == typeof cbSplit._nativeSplit ? e.split(a, r) : cbSplit._nativeSplit.call(e, a, r)
        var t, n, s, l, i = [], g = 0, c = (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.sticky ? "y" : ""), a = new RegExp(a.source,c + "g")
        if (e += "",
        cbSplit._compliantExecNpcg || (t = new RegExp("^" + a.source + "$(?!\\s)",c)),
        void 0 === r || 0 > +r)
            r = 1 / 0
        else if (r = Math.floor(+r),
            !r)
            return []
        for (; (n = a.exec(e)) && (s = n.index + n[0].length,
            !(s > g && (i.push(e.slice(g, n.index)),
            !cbSplit._compliantExecNpcg && n.length > 1 && n[0].replace(t, function() {
                for (var e = 1; e < arguments.length - 2; e++)
                    void 0 === arguments[e] && (n[e] = void 0)
            }),
            n.length > 1 && n.index < e.length && Array.prototype.push.apply(i, n.slice(1)),
                l = n[0].length,
                g = s,
            i.length >= r))); )
            a.lastIndex === n.index && a.lastIndex++
        return g === e.length ? !l && a.test("") || i.push("") : i.push(e.slice(g)),
            i.length > r ? i.slice(0, r) : i
    }
        ,
        cbSplit._compliantExecNpcg = void 0 === /()??/.exec("")[1],
        cbSplit._nativeSplit = String.prototype.split),
        String.prototype.split = function(e, a) {
            return cbSplit(this, e, a)
        }
}(jQuery)

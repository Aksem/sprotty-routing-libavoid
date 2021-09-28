var initAvoidModule = (function () {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined')
        _scriptDir = _scriptDir || __filename;
    return (function (initAvoidModule) {
        initAvoidModule = initAvoidModule || {};
        var a;
        a || (a = typeof initAvoidModule !== 'undefined' ? initAvoidModule : {});
        var aa, ba;
        a.ready = new Promise(function (b, c) { aa = b; ba = c; });
        var ca = {}, k;
        for (k in a)
            a.hasOwnProperty(k) && (ca[k] = a[k]);
        var ea = "./this.program", fa = !1, ha = !1, ja = !1, ka = !1;
        fa = "object" === typeof window;
        ha = "function" === typeof importScripts;
        ja = "object" === typeof process && "object" === typeof process.versions && "string" === typeof process.versions.node;
        ka = !fa && !ja && !ha;
        var l = "", la, ma, na, oa, pa;
        if (ja)
            l = ha ? require("path").dirname(l) + "/" : __dirname + "/", la = function (b, c) { oa || (oa = require("fs")); pa || (pa = require("path")); b = pa.normalize(b); return oa.readFileSync(b, c ? null : "utf8"); }, na = function (b) { b = la(b, !0); b.buffer || (b = new Uint8Array(b)); assert(b.buffer); return b; }, 1 < process.argv.length && (ea = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), process.on("uncaughtException", function (b) { throw b; }), process.on("unhandledRejection", m), a.inspect = function () { return "[Emscripten Module object]"; };
        else if (ka)
            "undefined" !=
                typeof read && (la = function (b) { return read(b); }), na = function (b) { if ("function" === typeof readbuffer)
                return new Uint8Array(readbuffer(b)); b = read(b, "binary"); assert("object" === typeof b); return b; }, "undefined" !== typeof print && ("undefined" === typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" !== typeof printErr ? printErr : print);
        else if (fa || ha)
            ha ? l = self.location.href : "undefined" !== typeof document && document.currentScript && (l = document.currentScript.src), _scriptDir && (l = _scriptDir),
                0 !== l.indexOf("blob:") ? l = l.substr(0, l.lastIndexOf("/") + 1) : l = "", la = function (b) { var c = new XMLHttpRequest; c.open("GET", b, !1); c.send(null); return c.responseText; }, ha && (na = function (b) { var c = new XMLHttpRequest; c.open("GET", b, !1); c.responseType = "arraybuffer"; c.send(null); return new Uint8Array(c.response); }), ma = function (b, c, d) { var e = new XMLHttpRequest; e.open("GET", b, !0); e.responseType = "arraybuffer"; e.onload = function () { 200 == e.status || 0 == e.status && e.response ? c(e.response) : d(); }; e.onerror = d; e.send(null); };
        var qa = a.print || console.log.bind(console), ra = a.printErr || console.warn.bind(console);
        for (k in ca)
            ca.hasOwnProperty(k) && (a[k] = ca[k]);
        ca = null;
        a.thisProgram && (ea = a.thisProgram);
        var sa = [], ta, ua;
        a.wasmBinary && (ua = a.wasmBinary);
        var noExitRuntime = a.noExitRuntime || !0;
        "object" !== typeof WebAssembly && m("no native wasm support detected");
        var va, wa = !1;
        function assert(b, c) { b || m("Assertion failed: " + c); }
        var xa = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
        function ya(b, c, d) { var e = c + d; for (d = c; b[d] && !(d >= e);)
            ++d; if (16 < d - c && b.subarray && xa)
            return xa.decode(b.subarray(c, d)); for (e = ""; c < d;) {
            var g = b[c++];
            if (g & 128) {
                var h = b[c++] & 63;
                if (192 == (g & 224))
                    e += String.fromCharCode((g & 31) << 6 | h);
                else {
                    var t = b[c++] & 63;
                    g = 224 == (g & 240) ? (g & 15) << 12 | h << 6 | t : (g & 7) << 18 | h << 12 | t << 6 | b[c++] & 63;
                    65536 > g ? e += String.fromCharCode(g) : (g -= 65536, e += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
                }
            }
            else
                e += String.fromCharCode(g);
        } return e; }
        function za(b) { return b ? ya(Aa, b, void 0) : ""; }
        var Ba, Aa, n, q, Ca = [], Da = [], Ea = [], Fa = [], Ga = !1;
        Da.push({ Uc: function () { Ha(); } });
        function Ia() { var b = a.preRun.shift(); Ca.unshift(b); }
        var Ja = 0, Ka = null, La = null;
        a.preloadedImages = {};
        a.preloadedAudios = {};
        function m(b) { if (a.onAbort)
            a.onAbort(b); ra(b); wa = !0; b = new WebAssembly.RuntimeError("abort(" + b + "). Build with -s ASSERTIONS=1 for more info."); ba(b); throw b; }
        function Ma(b) { var c = r; return String.prototype.startsWith ? c.startsWith(b) : 0 === c.indexOf(b); }
        function Na() { return Ma("data:application/octet-stream;base64,"); }
        var r = "libavoid.wasm";
        if (!Na()) {
            var Oa = r;
            r = a.locateFile ? a.locateFile(Oa, l) : l + Oa;
        }
        function Pa() { var b = r; try {
            if (b == r && ua)
                return new Uint8Array(ua);
            if (na)
                return na(b);
            throw "both async and sync fetching of the wasm failed";
        }
        catch (c) {
            m(c);
        } }
        function Qa() { if (!ua && (fa || ha)) {
            if ("function" === typeof fetch && !Ma("file://"))
                return fetch(r, { credentials: "same-origin" }).then(function (b) { if (!b.ok)
                    throw "failed to load wasm binary file at '" + r + "'"; return b.arrayBuffer(); }).catch(function () { return Pa(); });
            if (ma)
                return new Promise(function (b, c) { ma(r, function (d) { b(new Uint8Array(d)); }, c); });
        } return Promise.resolve().then(function () { return Pa(); }); }
        function Ra(b) { for (; 0 < b.length;) {
            var c = b.shift();
            if ("function" == typeof c)
                c(a);
            else {
                var d = c.Uc;
                "number" === typeof d ? void 0 === c.Pc ? q.get(d)() : q.get(d)(c.Pc) : d(void 0 === c.Pc ? null : c.Pc);
            }
        } }
        function Sa(b) { this.Gc = b - 16; this.Rc = function (c) { n[this.Gc + 8 >> 2] = c; }; this.Tc = function () { return n[this.Gc + 8 >> 2]; }; this.ud = function (c) { n[this.Gc + 0 >> 2] = c; }; this.Gd = function () { n[this.Gc + 4 >> 2] = 0; }; this.td = function () { Ba[this.Gc + 12 >> 0] = 0; }; this.Hd = function () { Ba[this.Gc + 13 >> 0] = 0; }; this.rd = function (c, d) { this.Rc(c); this.ud(d); this.Gd(); this.td(); this.Hd(); }; }
        var Ta = 0;
        function Ua() { void 0 === Ua.start && (Ua.start = Date.now()); return 1E3 * (Date.now() - Ua.start) | 0; }
        var Va = {};
        function Wa() { if (!Xa) {
            var b = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ("object" === typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: ea || "./this.program" }, c;
            for (c in Va)
                b[c] = Va[c];
            var d = [];
            for (c in b)
                d.push(c + "=" + b[c]);
            Xa = d;
        } return Xa; }
        var Xa, Ya = [null, [], []];
        function Za(b) { return 0 === b % 4 && (0 !== b % 100 || 0 === b % 400); }
        function $a(b, c) { for (var d = 0, e = 0; e <= c; d += b[e++])
            ; return d; }
        var ab = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], bb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function cb(b, c) { for (b = new Date(b.getTime()); 0 < c;) {
            var d = b.getMonth(), e = (Za(b.getFullYear()) ? ab : bb)[d];
            if (c > e - b.getDate())
                c -= e - b.getDate() + 1, b.setDate(1), 11 > d ? b.setMonth(d + 1) : (b.setMonth(0), b.setFullYear(b.getFullYear() + 1));
            else {
                b.setDate(b.getDate() + c);
                break;
            }
        } return b; }
        function db(b, c, d, e) {
            function g(f, p, y) { for (f = "number" === typeof f ? f.toString() : f || ""; f.length < p;)
                f = y[0] + f; return f; }
            function h(f, p) { return g(f, p, "0"); }
            function t(f, p) { function y(eb) { return 0 > eb ? -1 : 0 < eb ? 1 : 0; } var da; 0 === (da = y(f.getFullYear() - p.getFullYear())) && 0 === (da = y(f.getMonth() - p.getMonth())) && (da = y(f.getDate() - p.getDate())); return da; }
            function F(f) {
                switch (f.getDay()) {
                    case 0: return new Date(f.getFullYear() - 1, 11, 29);
                    case 1: return f;
                    case 2: return new Date(f.getFullYear(), 0, 3);
                    case 3: return new Date(f.getFullYear(), 0, 2);
                    case 4: return new Date(f.getFullYear(), 0, 1);
                    case 5: return new Date(f.getFullYear() - 1, 11, 31);
                    case 6: return new Date(f.getFullYear() - 1, 11, 30);
                }
            }
            function ia(f) { f = cb(new Date(f.Jc + 1900, 0, 1), f.Oc); var p = new Date(f.getFullYear() + 1, 0, 4), y = F(new Date(f.getFullYear(), 0, 4)); p = F(p); return 0 >= t(y, f) ? 0 >= t(p, f) ? f.getFullYear() + 1 : f.getFullYear() : f.getFullYear() - 1; }
            var I = n[e + 40 >> 2];
            e = { Md: n[e >> 2], Ld: n[e + 4 >> 2], Mc: n[e + 8 >> 2], Lc: n[e + 12 >> 2], Kc: n[e + 16 >> 2], Jc: n[e + 20 >> 2], Nc: n[e + 24 >> 2], Oc: n[e + 28 >> 2], Od: n[e + 32 >> 2], Kd: n[e +
                    36 >> 2], Nd: I ? za(I) : "" };
            d = za(d);
            I = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
            for (var D in I)
                d = d.replace(new RegExp(D, "g"), I[D]);
            var fb = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), gb = "January February March April May June July August September October November December".split(" ");
            I = { "%a": function (f) { return fb[f.Nc].substring(0, 3); }, "%A": function (f) { return fb[f.Nc]; }, "%b": function (f) { return gb[f.Kc].substring(0, 3); }, "%B": function (f) { return gb[f.Kc]; }, "%C": function (f) { return h((f.Jc + 1900) / 100 | 0, 2); }, "%d": function (f) { return h(f.Lc, 2); }, "%e": function (f) { return g(f.Lc, 2, " "); }, "%g": function (f) { return ia(f).toString().substring(2); }, "%G": function (f) { return ia(f); }, "%H": function (f) {
                    return h(f.Mc, 2);
                }, "%I": function (f) { f = f.Mc; 0 == f ? f = 12 : 12 < f && (f -= 12); return h(f, 2); }, "%j": function (f) { return h(f.Lc + $a(Za(f.Jc + 1900) ? ab : bb, f.Kc - 1), 3); }, "%m": function (f) { return h(f.Kc + 1, 2); }, "%M": function (f) { return h(f.Ld, 2); }, "%n": function () { return "\n"; }, "%p": function (f) { return 0 <= f.Mc && 12 > f.Mc ? "AM" : "PM"; }, "%S": function (f) { return h(f.Md, 2); }, "%t": function () { return "\t"; }, "%u": function (f) { return f.Nc || 7; }, "%U": function (f) {
                    var p = new Date(f.Jc + 1900, 0, 1), y = 0 === p.getDay() ? p : cb(p, 7 - p.getDay());
                    f = new Date(f.Jc + 1900, f.Kc, f.Lc);
                    return 0 >
                        t(y, f) ? h(Math.ceil((31 - y.getDate() + ($a(Za(f.getFullYear()) ? ab : bb, f.getMonth() - 1) - 31) + f.getDate()) / 7), 2) : 0 === t(y, p) ? "01" : "00";
                }, "%V": function (f) { var p = new Date(f.Jc + 1901, 0, 4), y = F(new Date(f.Jc + 1900, 0, 4)); p = F(p); var da = cb(new Date(f.Jc + 1900, 0, 1), f.Oc); return 0 > t(da, y) ? "53" : 0 >= t(p, da) ? "01" : h(Math.ceil((y.getFullYear() < f.Jc + 1900 ? f.Oc + 32 - y.getDate() : f.Oc + 1 - y.getDate()) / 7), 2); }, "%w": function (f) { return f.Nc; }, "%W": function (f) {
                    var p = new Date(f.Jc, 0, 1), y = 1 === p.getDay() ? p : cb(p, 0 === p.getDay() ? 1 : 7 - p.getDay() + 1);
                    f = new Date(f.Jc + 1900, f.Kc, f.Lc);
                    return 0 > t(y, f) ? h(Math.ceil((31 - y.getDate() + ($a(Za(f.getFullYear()) ? ab : bb, f.getMonth() - 1) - 31) + f.getDate()) / 7), 2) : 0 === t(y, p) ? "01" : "00";
                }, "%y": function (f) { return (f.Jc + 1900).toString().substring(2); }, "%Y": function (f) { return f.Jc + 1900; }, "%z": function (f) { f = f.Kd; var p = 0 <= f; f = Math.abs(f) / 60; return (p ? "+" : "-") + String("0000" + (f / 60 * 100 + f % 60)).slice(-4); }, "%Z": function (f) { return f.Nd; }, "%%": function () { return "%"; } };
            for (D in I)
                0 <= d.indexOf(D) && (d = d.replace(new RegExp(D, "g"), I[D](e)));
            D = hb(d);
            if (D.length > c)
                return 0;
            Ba.set(D, b);
            return D.length - 1;
        }
        function hb(b) {
            for (var c = 0, d = 0; d < b.length; ++d) {
                var e = b.charCodeAt(d);
                55296 <= e && 57343 >= e && (e = 65536 + ((e & 1023) << 10) | b.charCodeAt(++d) & 1023);
                127 >= e ? ++c : c = 2047 >= e ? c + 2 : 65535 >= e ? c + 3 : c + 4;
            }
            c = Array(c + 1);
            e = c.length;
            d = 0;
            if (0 < e) {
                e = d + e - 1;
                for (var g = 0; g < b.length; ++g) {
                    var h = b.charCodeAt(g);
                    if (55296 <= h && 57343 >= h) {
                        var t = b.charCodeAt(++g);
                        h = 65536 + ((h & 1023) << 10) | t & 1023;
                    }
                    if (127 >= h) {
                        if (d >= e)
                            break;
                        c[d++] = h;
                    }
                    else {
                        if (2047 >= h) {
                            if (d + 1 >= e)
                                break;
                            c[d++] = 192 | h >> 6;
                        }
                        else {
                            if (65535 >= h) {
                                if (d + 2 >= e)
                                    break;
                                c[d++] = 224 | h >> 12;
                            }
                            else {
                                if (d + 3 >= e)
                                    break;
                                c[d++] = 240 | h >> 18;
                                c[d++] = 128 | h >> 12 & 63;
                            }
                            c[d++] = 128 | h >> 6 & 63;
                        }
                        c[d++] = 128 | h & 63;
                    }
                }
                c[d] = 0;
            }
            return c;
        }
        var jb = { a: function (b, c, d, e) { m("Assertion failed: " + za(b) + ", at: " + [c ? za(c) : "unknown filename", d, e ? za(e) : "unknown function"]); }, e: function (b) { return ib(b + 16) + 16; }, d: function (b, c, d) { (new Sa(b)).rd(c, d); Ta++; throw b; }, b: function () { m(); }, c: Ua, l: function (b, c, d) { Aa.copyWithin(b, c, c + d); }, m: function () { m("OOM"); }, h: function (b, c) { var d = 0; Wa().forEach(function (e, g) { var h = c + d; g = n[b + 4 * g >> 2] = h; for (h = 0; h < e.length; ++h)
                Ba[g++ >> 0] = e.charCodeAt(h); Ba[g >> 0] = 0; d += e.length + 1; }); return 0; }, i: function (b, c) {
                var d = Wa();
                n[b >> 2] = d.length;
                var e = 0;
                d.forEach(function (g) { e += g.length + 1; });
                n[c >> 2] = e;
                return 0;
            }, j: function () { return 0; }, k: function () { }, f: function (b, c, d, e) { for (var g = 0, h = 0; h < d; h++) {
                for (var t = n[c + 8 * h >> 2], F = n[c + (8 * h + 4) >> 2], ia = 0; ia < F; ia++) {
                    var I = Aa[t + ia], D = Ya[b];
                    0 === I || 10 === I ? ((1 === b ? qa : ra)(ya(D, 0)), D.length = 0) : D.push(I);
                }
                g += F;
            } n[e >> 2] = g; return 0; }, g: function (b, c, d, e) { return db(b, c, d, e); } };
        (function () {
            function b(g) { a.asm = g.exports; va = a.asm.n; g = va.buffer; a.HEAP8 = Ba = new Int8Array(g); a.HEAP16 = new Int16Array(g); a.HEAP32 = n = new Int32Array(g); a.HEAPU8 = Aa = new Uint8Array(g); a.HEAPU16 = new Uint16Array(g); a.HEAPU32 = new Uint32Array(g); a.HEAPF32 = new Float32Array(g); a.HEAPF64 = new Float64Array(g); q = a.asm.p; Ja--; a.monitorRunDependencies && a.monitorRunDependencies(Ja); 0 == Ja && (null !== Ka && (clearInterval(Ka), Ka = null), La && (g = La, La = null, g())); }
            function c(g) { b(g.instance); }
            function d(g) {
                return Qa().then(function (h) {
                    return WebAssembly.instantiate(h, e);
                }).then(g, function (h) { ra("failed to asynchronously prepare wasm: " + h); m(h); });
            }
            var e = { a: jb };
            Ja++;
            a.monitorRunDependencies && a.monitorRunDependencies(Ja);
            if (a.instantiateWasm)
                try {
                    return a.instantiateWasm(e, b);
                }
                catch (g) {
                    return ra("Module.instantiateWasm callback failed with error: " + g), !1;
                }
            (function () {
                return ua || "function" !== typeof WebAssembly.instantiateStreaming || Na() || Ma("file://") || "function" !== typeof fetch ? d(c) : fetch(r, { credentials: "same-origin" }).then(function (g) {
                    return WebAssembly.instantiateStreaming(g, e).then(c, function (h) { ra("wasm streaming compile failed: " + h); ra("falling back to ArrayBuffer instantiation"); return d(c); });
                });
            })().catch(ba);
            return {};
        })();
        var Ha = a.___wasm_call_ctors = function () { return (Ha = a.___wasm_call_ctors = a.asm.o).apply(null, arguments); }, ib = a._malloc = function () { return (ib = a._malloc = a.asm.q).apply(null, arguments); };
        a._free = function () { return (a._free = a.asm.r).apply(null, arguments); };
        var kb = a._emscripten_bind_VoidPtr___destroy___0 = function () { return (kb = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.s).apply(null, arguments); }, lb = a._emscripten_bind_HyperedgeImprover_HyperedgeImprover_0 = function () { return (lb = a._emscripten_bind_HyperedgeImprover_HyperedgeImprover_0 = a.asm.t).apply(null, arguments); }, mb = a._emscripten_bind_HyperedgeImprover_clear_0 = function () { return (mb = a._emscripten_bind_HyperedgeImprover_clear_0 = a.asm.u).apply(null, arguments); }, nb = a._emscripten_bind_HyperedgeImprover_setRouter_1 =
            function () { return (nb = a._emscripten_bind_HyperedgeImprover_setRouter_1 = a.asm.v).apply(null, arguments); }, ob = a._emscripten_bind_HyperedgeImprover___destroy___0 = function () { return (ob = a._emscripten_bind_HyperedgeImprover___destroy___0 = a.asm.w).apply(null, arguments); }, pb = a._emscripten_bind_Box_Box_0 = function () { return (pb = a._emscripten_bind_Box_Box_0 = a.asm.x).apply(null, arguments); }, qb = a._emscripten_bind_Box_length_1 = function () { return (qb = a._emscripten_bind_Box_length_1 = a.asm.y).apply(null, arguments); }, rb = a._emscripten_bind_Box_width_0 =
            function () { return (rb = a._emscripten_bind_Box_width_0 = a.asm.z).apply(null, arguments); }, sb = a._emscripten_bind_Box_height_0 = function () { return (sb = a._emscripten_bind_Box_height_0 = a.asm.A).apply(null, arguments); }, tb = a._emscripten_bind_Box_get_min_0 = function () { return (tb = a._emscripten_bind_Box_get_min_0 = a.asm.B).apply(null, arguments); }, ub = a._emscripten_bind_Box_set_min_1 = function () { return (ub = a._emscripten_bind_Box_set_min_1 = a.asm.C).apply(null, arguments); }, vb = a._emscripten_bind_Box_get_max_0 = function () {
            return (vb =
                a._emscripten_bind_Box_get_max_0 = a.asm.D).apply(null, arguments);
        }, wb = a._emscripten_bind_Box_set_max_1 = function () { return (wb = a._emscripten_bind_Box_set_max_1 = a.asm.E).apply(null, arguments); }, xb = a._emscripten_bind_Box___destroy___0 = function () { return (xb = a._emscripten_bind_Box___destroy___0 = a.asm.F).apply(null, arguments); }, yb = a._emscripten_bind_PolygonInterface_clear_0 = function () { return (yb = a._emscripten_bind_PolygonInterface_clear_0 = a.asm.G).apply(null, arguments); }, zb = a._emscripten_bind_PolygonInterface_empty_0 =
            function () { return (zb = a._emscripten_bind_PolygonInterface_empty_0 = a.asm.H).apply(null, arguments); }, Ab = a._emscripten_bind_PolygonInterface_size_0 = function () { return (Ab = a._emscripten_bind_PolygonInterface_size_0 = a.asm.I).apply(null, arguments); }, Bb = a._emscripten_bind_PolygonInterface_id_0 = function () { return (Bb = a._emscripten_bind_PolygonInterface_id_0 = a.asm.J).apply(null, arguments); }, Cb = a._emscripten_bind_PolygonInterface_at_1 = function () {
            return (Cb = a._emscripten_bind_PolygonInterface_at_1 = a.asm.K).apply(null, arguments);
        }, Db = a._emscripten_bind_PolygonInterface_boundingRectPolygon_0 = function () { return (Db = a._emscripten_bind_PolygonInterface_boundingRectPolygon_0 = a.asm.L).apply(null, arguments); }, Eb = a._emscripten_bind_PolygonInterface_offsetBoundingBox_1 = function () { return (Eb = a._emscripten_bind_PolygonInterface_offsetBoundingBox_1 = a.asm.M).apply(null, arguments); }, Fb = a._emscripten_bind_PolygonInterface_offsetPolygon_1 = function () { return (Fb = a._emscripten_bind_PolygonInterface_offsetPolygon_1 = a.asm.N).apply(null, arguments); }, Gb = a._emscripten_bind_PolygonInterface___destroy___0 = function () { return (Gb = a._emscripten_bind_PolygonInterface___destroy___0 = a.asm.O).apply(null, arguments); }, Hb = a._emscripten_bind_Polygon_Polygon_0 = function () { return (Hb = a._emscripten_bind_Polygon_Polygon_0 = a.asm.P).apply(null, arguments); }, Ib = a._emscripten_bind_Polygon_Polygon_1 = function () { return (Ib = a._emscripten_bind_Polygon_Polygon_1 = a.asm.Q).apply(null, arguments); }, Jb = a._emscripten_bind_Polygon_setPoint_2 = function () {
            return (Jb = a._emscripten_bind_Polygon_setPoint_2 =
                a.asm.R).apply(null, arguments);
        }, Kb = a._emscripten_bind_Polygon_size_0 = function () { return (Kb = a._emscripten_bind_Polygon_size_0 = a.asm.S).apply(null, arguments); }, Lb = a._emscripten_bind_Polygon_get_ps_1 = function () { return (Lb = a._emscripten_bind_Polygon_get_ps_1 = a.asm.T).apply(null, arguments); }, Mb = a._emscripten_bind_Polygon_set_ps_2 = function () { return (Mb = a._emscripten_bind_Polygon_set_ps_2 = a.asm.U).apply(null, arguments); }, Nb = a._emscripten_bind_Polygon___destroy___0 = function () {
            return (Nb = a._emscripten_bind_Polygon___destroy___0 =
                a.asm.V).apply(null, arguments);
        }, Ob = a._emscripten_bind_Point_Point_0 = function () { return (Ob = a._emscripten_bind_Point_Point_0 = a.asm.W).apply(null, arguments); }, Pb = a._emscripten_bind_Point_Point_2 = function () { return (Pb = a._emscripten_bind_Point_Point_2 = a.asm.X).apply(null, arguments); }, Qb = a._emscripten_bind_Point_equal_1 = function () { return (Qb = a._emscripten_bind_Point_equal_1 = a.asm.Y).apply(null, arguments); }, Rb = a._emscripten_bind_Point_get_x_0 = function () {
            return (Rb = a._emscripten_bind_Point_get_x_0 = a.asm.Z).apply(null, arguments);
        }, Sb = a._emscripten_bind_Point_set_x_1 = function () { return (Sb = a._emscripten_bind_Point_set_x_1 = a.asm._).apply(null, arguments); }, Tb = a._emscripten_bind_Point_get_y_0 = function () { return (Tb = a._emscripten_bind_Point_get_y_0 = a.asm.$).apply(null, arguments); }, Ub = a._emscripten_bind_Point_set_y_1 = function () { return (Ub = a._emscripten_bind_Point_set_y_1 = a.asm.aa).apply(null, arguments); }, Vb = a._emscripten_bind_Point_get_id_0 = function () { return (Vb = a._emscripten_bind_Point_get_id_0 = a.asm.ba).apply(null, arguments); }, Wb = a._emscripten_bind_Point_set_id_1 = function () { return (Wb = a._emscripten_bind_Point_set_id_1 = a.asm.ca).apply(null, arguments); }, Xb = a._emscripten_bind_Point_get_vn_0 = function () { return (Xb = a._emscripten_bind_Point_get_vn_0 = a.asm.da).apply(null, arguments); }, Yb = a._emscripten_bind_Point_set_vn_1 = function () { return (Yb = a._emscripten_bind_Point_set_vn_1 = a.asm.ea).apply(null, arguments); }, Zb = a._emscripten_bind_Point___destroy___0 = function () { return (Zb = a._emscripten_bind_Point___destroy___0 = a.asm.fa).apply(null, arguments); }, $b = a._emscripten_bind_Rectangle_Rectangle_3 = function () { return ($b = a._emscripten_bind_Rectangle_Rectangle_3 = a.asm.ga).apply(null, arguments); }, ac = a._emscripten_bind_Rectangle___destroy___0 = function () { return (ac = a._emscripten_bind_Rectangle___destroy___0 = a.asm.ha).apply(null, arguments); }, bc = a._emscripten_bind_HyperedgeTreeNode_HyperedgeTreeNode_0 = function () { return (bc = a._emscripten_bind_HyperedgeTreeNode_HyperedgeTreeNode_0 = a.asm.ia).apply(null, arguments); }, cc = a._emscripten_bind_HyperedgeTreeNode_writeEdgesToConns_2 =
            function () { return (cc = a._emscripten_bind_HyperedgeTreeNode_writeEdgesToConns_2 = a.asm.ja).apply(null, arguments); }, dc = a._emscripten_bind_HyperedgeTreeNode___destroy___0 = function () { return (dc = a._emscripten_bind_HyperedgeTreeNode___destroy___0 = a.asm.ka).apply(null, arguments); }, ec = a._emscripten_bind_HyperedgeTreeEdge_HyperedgeTreeEdge_3 = function () { return (ec = a._emscripten_bind_HyperedgeTreeEdge_HyperedgeTreeEdge_3 = a.asm.la).apply(null, arguments); }, fc = a._emscripten_bind_HyperedgeTreeEdge___destroy___0 = function () {
            return (fc =
                a._emscripten_bind_HyperedgeTreeEdge___destroy___0 = a.asm.ma).apply(null, arguments);
        }, hc = a._emscripten_bind_AStarPath_AStarPath_0 = function () { return (hc = a._emscripten_bind_AStarPath_AStarPath_0 = a.asm.na).apply(null, arguments); }, ic = a._emscripten_bind_AStarPath_search_4 = function () { return (ic = a._emscripten_bind_AStarPath_search_4 = a.asm.oa).apply(null, arguments); }, jc = a._emscripten_bind_AStarPath___destroy___0 = function () { return (jc = a._emscripten_bind_AStarPath___destroy___0 = a.asm.pa).apply(null, arguments); }, kc = a._emscripten_bind_ConnEnd_ConnEnd_1 = function () { return (kc = a._emscripten_bind_ConnEnd_ConnEnd_1 = a.asm.qa).apply(null, arguments); }, lc = a._emscripten_bind_ConnEnd_ConnEnd_2 = function () { return (lc = a._emscripten_bind_ConnEnd_ConnEnd_2 = a.asm.ra).apply(null, arguments); }, mc = a._emscripten_bind_ConnEnd___destroy___0 = function () { return (mc = a._emscripten_bind_ConnEnd___destroy___0 = a.asm.sa).apply(null, arguments); }, nc = a._emscripten_bind_ActionInfo_ActionInfo_2 = function () {
            return (nc = a._emscripten_bind_ActionInfo_ActionInfo_2 =
                a.asm.ta).apply(null, arguments);
        }, oc = a._emscripten_bind_ActionInfo_ActionInfo_3 = function () { return (oc = a._emscripten_bind_ActionInfo_ActionInfo_3 = a.asm.ua).apply(null, arguments); }, pc = a._emscripten_bind_ActionInfo_ActionInfo_4 = function () { return (pc = a._emscripten_bind_ActionInfo_ActionInfo_4 = a.asm.va).apply(null, arguments); }, qc = a._emscripten_bind_ActionInfo_obstacle_0 = function () { return (qc = a._emscripten_bind_ActionInfo_obstacle_0 = a.asm.wa).apply(null, arguments); }, rc = a._emscripten_bind_ActionInfo_shape_0 = function () {
            return (rc =
                a._emscripten_bind_ActionInfo_shape_0 = a.asm.xa).apply(null, arguments);
        }, sc = a._emscripten_bind_ActionInfo_conn_0 = function () { return (sc = a._emscripten_bind_ActionInfo_conn_0 = a.asm.ya).apply(null, arguments); }, tc = a._emscripten_bind_ActionInfo_junction_0 = function () { return (tc = a._emscripten_bind_ActionInfo_junction_0 = a.asm.za).apply(null, arguments); }, uc = a._emscripten_bind_ActionInfo_addConnEndUpdate_3 = function () { return (uc = a._emscripten_bind_ActionInfo_addConnEndUpdate_3 = a.asm.Aa).apply(null, arguments); }, vc = a._emscripten_bind_ActionInfo_get_type_0 =
            function () { return (vc = a._emscripten_bind_ActionInfo_get_type_0 = a.asm.Ba).apply(null, arguments); }, wc = a._emscripten_bind_ActionInfo_set_type_1 = function () { return (wc = a._emscripten_bind_ActionInfo_set_type_1 = a.asm.Ca).apply(null, arguments); }, xc = a._emscripten_bind_ActionInfo_get_objPtr_0 = function () { return (xc = a._emscripten_bind_ActionInfo_get_objPtr_0 = a.asm.Da).apply(null, arguments); }, yc = a._emscripten_bind_ActionInfo_set_objPtr_1 = function () {
            return (yc = a._emscripten_bind_ActionInfo_set_objPtr_1 = a.asm.Ea).apply(null, arguments);
        }, zc = a._emscripten_bind_ActionInfo_get_newPoly_0 = function () { return (zc = a._emscripten_bind_ActionInfo_get_newPoly_0 = a.asm.Fa).apply(null, arguments); }, Ac = a._emscripten_bind_ActionInfo_set_newPoly_1 = function () { return (Ac = a._emscripten_bind_ActionInfo_set_newPoly_1 = a.asm.Ga).apply(null, arguments); }, Bc = a._emscripten_bind_ActionInfo_get_newPosition_0 = function () { return (Bc = a._emscripten_bind_ActionInfo_get_newPosition_0 = a.asm.Ha).apply(null, arguments); }, Cc = a._emscripten_bind_ActionInfo_set_newPosition_1 =
            function () { return (Cc = a._emscripten_bind_ActionInfo_set_newPosition_1 = a.asm.Ia).apply(null, arguments); }, Dc = a._emscripten_bind_ActionInfo_get_firstMove_0 = function () { return (Dc = a._emscripten_bind_ActionInfo_get_firstMove_0 = a.asm.Ja).apply(null, arguments); }, Ec = a._emscripten_bind_ActionInfo_set_firstMove_1 = function () { return (Ec = a._emscripten_bind_ActionInfo_set_firstMove_1 = a.asm.Ka).apply(null, arguments); }, Fc = a._emscripten_bind_ActionInfo___destroy___0 = function () {
            return (Fc = a._emscripten_bind_ActionInfo___destroy___0 =
                a.asm.La).apply(null, arguments);
        }, Gc = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_2 = function () { return (Gc = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_2 = a.asm.Ma).apply(null, arguments); }, Hc = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_3 = function () { return (Hc = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_3 = a.asm.Na).apply(null, arguments); }, Ic = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_6 = function () {
            return (Ic = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_6 =
                a.asm.Oa).apply(null, arguments);
        }, Jc = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_7 = function () { return (Jc = a._emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_7 = a.asm.Pa).apply(null, arguments); }, Kc = a._emscripten_bind_ShapeConnectionPin_setConnectionCost_1 = function () { return (Kc = a._emscripten_bind_ShapeConnectionPin_setConnectionCost_1 = a.asm.Qa).apply(null, arguments); }, Lc = a._emscripten_bind_ShapeConnectionPin_position_0 = function () {
            return (Lc = a._emscripten_bind_ShapeConnectionPin_position_0 =
                a.asm.Ra).apply(null, arguments);
        }, Mc = a._emscripten_bind_ShapeConnectionPin_position_1 = function () { return (Mc = a._emscripten_bind_ShapeConnectionPin_position_1 = a.asm.Sa).apply(null, arguments); }, Nc = a._emscripten_bind_ShapeConnectionPin_directions_0 = function () { return (Nc = a._emscripten_bind_ShapeConnectionPin_directions_0 = a.asm.Ta).apply(null, arguments); }, Oc = a._emscripten_bind_ShapeConnectionPin_setExclusive_1 = function () { return (Oc = a._emscripten_bind_ShapeConnectionPin_setExclusive_1 = a.asm.Ua).apply(null, arguments); }, Pc = a._emscripten_bind_ShapeConnectionPin_isExclusive_0 = function () { return (Pc = a._emscripten_bind_ShapeConnectionPin_isExclusive_0 = a.asm.Va).apply(null, arguments); }, Qc = a._emscripten_bind_ShapeConnectionPin___destroy___0 = function () { return (Qc = a._emscripten_bind_ShapeConnectionPin___destroy___0 = a.asm.Wa).apply(null, arguments); }, Rc = a._emscripten_bind_Obstacle_id_0 = function () { return (Rc = a._emscripten_bind_Obstacle_id_0 = a.asm.Xa).apply(null, arguments); }, Sc = a._emscripten_bind_Obstacle_polygon_0 = function () {
            return (Sc =
                a._emscripten_bind_Obstacle_polygon_0 = a.asm.Ya).apply(null, arguments);
        }, Tc = a._emscripten_bind_Obstacle_router_0 = function () { return (Tc = a._emscripten_bind_Obstacle_router_0 = a.asm.Za).apply(null, arguments); }, Uc = a._emscripten_bind_Obstacle_position_0 = function () { return (Uc = a._emscripten_bind_Obstacle_position_0 = a.asm._a).apply(null, arguments); }, Vc = a._emscripten_bind_Obstacle___destroy___0 = function () { return (Vc = a._emscripten_bind_Obstacle___destroy___0 = a.asm.$a).apply(null, arguments); }, Wc = a._emscripten_bind_JunctionRef_JunctionRef_2 =
            function () { return (Wc = a._emscripten_bind_JunctionRef_JunctionRef_2 = a.asm.ab).apply(null, arguments); }, Xc = a._emscripten_bind_JunctionRef_JunctionRef_3 = function () { return (Xc = a._emscripten_bind_JunctionRef_JunctionRef_3 = a.asm.bb).apply(null, arguments); }, Yc = a._emscripten_bind_JunctionRef_position_0 = function () { return (Yc = a._emscripten_bind_JunctionRef_position_0 = a.asm.cb).apply(null, arguments); }, Zc = a._emscripten_bind_JunctionRef___destroy___0 = function () {
            return (Zc = a._emscripten_bind_JunctionRef___destroy___0 =
                a.asm.db).apply(null, arguments);
        }, $c = a._emscripten_bind_ShapeRef_ShapeRef_2 = function () { return ($c = a._emscripten_bind_ShapeRef_ShapeRef_2 = a.asm.eb).apply(null, arguments); }, ad = a._emscripten_bind_ShapeRef_ShapeRef_3 = function () { return (ad = a._emscripten_bind_ShapeRef_ShapeRef_3 = a.asm.fb).apply(null, arguments); }, bd = a._emscripten_bind_ShapeRef_polygon_0 = function () { return (bd = a._emscripten_bind_ShapeRef_polygon_0 = a.asm.gb).apply(null, arguments); }, cd = a._emscripten_bind_ShapeRef_position_0 = function () {
            return (cd = a._emscripten_bind_ShapeRef_position_0 =
                a.asm.hb).apply(null, arguments);
        }, dd = a._emscripten_bind_ShapeRef___destroy___0 = function () { return (dd = a._emscripten_bind_ShapeRef___destroy___0 = a.asm.ib).apply(null, arguments); }, ed = a._emscripten_bind_HyperedgeNewAndDeletedObjectLists___destroy___0 = function () { return (ed = a._emscripten_bind_HyperedgeNewAndDeletedObjectLists___destroy___0 = a.asm.jb).apply(null, arguments); }, fd = a._emscripten_bind_HyperedgeRerouter_HyperedgeRerouter_0 = function () {
            return (fd = a._emscripten_bind_HyperedgeRerouter_HyperedgeRerouter_0 =
                a.asm.kb).apply(null, arguments);
        }, gd = a._emscripten_bind_HyperedgeRerouter_registerHyperedgeForRerouting_1 = function () { return (gd = a._emscripten_bind_HyperedgeRerouter_registerHyperedgeForRerouting_1 = a.asm.lb).apply(null, arguments); }, hd = a._emscripten_bind_HyperedgeRerouter___destroy___0 = function () { return (hd = a._emscripten_bind_HyperedgeRerouter___destroy___0 = a.asm.mb).apply(null, arguments); }, id = a._emscripten_bind_VertInf___destroy___0 = function () {
            return (id = a._emscripten_bind_VertInf___destroy___0 = a.asm.nb).apply(null, arguments);
        }, jd = a._emscripten_bind_VertID_VertID_0 = function () { return (jd = a._emscripten_bind_VertID_VertID_0 = a.asm.ob).apply(null, arguments); }, kd = a._emscripten_bind_VertID_VertID_2 = function () { return (kd = a._emscripten_bind_VertID_VertID_2 = a.asm.pb).apply(null, arguments); }, ld = a._emscripten_bind_VertID_VertID_3 = function () { return (ld = a._emscripten_bind_VertID_VertID_3 = a.asm.qb).apply(null, arguments); }, md = a._emscripten_bind_VertID_get_objID_0 = function () {
            return (md = a._emscripten_bind_VertID_get_objID_0 = a.asm.rb).apply(null, arguments);
        }, nd = a._emscripten_bind_VertID_set_objID_1 = function () { return (nd = a._emscripten_bind_VertID_set_objID_1 = a.asm.sb).apply(null, arguments); }, od = a._emscripten_bind_VertID_get_vn_0 = function () { return (od = a._emscripten_bind_VertID_get_vn_0 = a.asm.tb).apply(null, arguments); }, pd = a._emscripten_bind_VertID_set_vn_1 = function () { return (pd = a._emscripten_bind_VertID_set_vn_1 = a.asm.ub).apply(null, arguments); }, qd = a._emscripten_bind_VertID_get_props_0 = function () {
            return (qd = a._emscripten_bind_VertID_get_props_0 = a.asm.vb).apply(null, arguments);
        }, rd = a._emscripten_bind_VertID_set_props_1 = function () { return (rd = a._emscripten_bind_VertID_set_props_1 = a.asm.wb).apply(null, arguments); }, sd = a._emscripten_bind_VertID_get_src_0 = function () { return (sd = a._emscripten_bind_VertID_get_src_0 = a.asm.xb).apply(null, arguments); }, td = a._emscripten_bind_VertID_get_tar_0 = function () { return (td = a._emscripten_bind_VertID_get_tar_0 = a.asm.yb).apply(null, arguments); }, ud = a._emscripten_bind_VertID_get_PROP_ConnPoint_0 = function () {
            return (ud = a._emscripten_bind_VertID_get_PROP_ConnPoint_0 =
                a.asm.zb).apply(null, arguments);
        }, vd = a._emscripten_bind_VertID_get_PROP_OrthShapeEdge_0 = function () { return (vd = a._emscripten_bind_VertID_get_PROP_OrthShapeEdge_0 = a.asm.Ab).apply(null, arguments); }, wd = a._emscripten_bind_VertID_get_PROP_ConnectionPin_0 = function () { return (wd = a._emscripten_bind_VertID_get_PROP_ConnectionPin_0 = a.asm.Bb).apply(null, arguments); }, xd = a._emscripten_bind_VertID_get_PROP_ConnCheckpoint_0 = function () { return (xd = a._emscripten_bind_VertID_get_PROP_ConnCheckpoint_0 = a.asm.Cb).apply(null, arguments); }, yd = a._emscripten_bind_VertID_get_PROP_DummyPinHelper_0 = function () { return (yd = a._emscripten_bind_VertID_get_PROP_DummyPinHelper_0 = a.asm.Db).apply(null, arguments); }, zd = a._emscripten_bind_VertID___destroy___0 = function () { return (zd = a._emscripten_bind_VertID___destroy___0 = a.asm.Eb).apply(null, arguments); }, Ad = a._emscripten_bind_MinimumTerminalSpanningTree___destroy___0 = function () { return (Ad = a._emscripten_bind_MinimumTerminalSpanningTree___destroy___0 = a.asm.Fb).apply(null, arguments); }, Bd = a._emscripten_bind_Checkpoint_Checkpoint_1 =
            function () { return (Bd = a._emscripten_bind_Checkpoint_Checkpoint_1 = a.asm.Gb).apply(null, arguments); }, Cd = a._emscripten_bind_Checkpoint___destroy___0 = function () { return (Cd = a._emscripten_bind_Checkpoint___destroy___0 = a.asm.Hb).apply(null, arguments); }, Dd = a._emscripten_bind_ConnRef_ConnRef_3 = function () { return (Dd = a._emscripten_bind_ConnRef_ConnRef_3 = a.asm.Ib).apply(null, arguments); }, Ed = a._emscripten_bind_ConnRef_ConnRef_4 = function () { return (Ed = a._emscripten_bind_ConnRef_ConnRef_4 = a.asm.Jb).apply(null, arguments); }, Fd = a._emscripten_bind_ConnRef_id_0 = function () { return (Fd = a._emscripten_bind_ConnRef_id_0 = a.asm.Kb).apply(null, arguments); }, Gd = a._emscripten_bind_ConnRef_setCallback_2 = function () { return (Gd = a._emscripten_bind_ConnRef_setCallback_2 = a.asm.Lb).apply(null, arguments); }, Hd = a._emscripten_bind_ConnRef_setSourceEndpoint_1 = function () { return (Hd = a._emscripten_bind_ConnRef_setSourceEndpoint_1 = a.asm.Mb).apply(null, arguments); }, Id = a._emscripten_bind_ConnRef_setDestEndpoint_1 = function () {
            return (Id = a._emscripten_bind_ConnRef_setDestEndpoint_1 =
                a.asm.Nb).apply(null, arguments);
        }, Jd = a._emscripten_bind_ConnRef_routingType_0 = function () { return (Jd = a._emscripten_bind_ConnRef_routingType_0 = a.asm.Ob).apply(null, arguments); }, Kd = a._emscripten_bind_ConnRef_setRoutingType_1 = function () { return (Kd = a._emscripten_bind_ConnRef_setRoutingType_1 = a.asm.Pb).apply(null, arguments); }, Ld = a._emscripten_bind_ConnRef_displayRoute_0 = function () { return (Ld = a._emscripten_bind_ConnRef_displayRoute_0 = a.asm.Qb).apply(null, arguments); }, Md = a._emscripten_bind_ConnRef___destroy___0 =
            function () { return (Md = a._emscripten_bind_ConnRef___destroy___0 = a.asm.Rb).apply(null, arguments); }, Nd = a._emscripten_bind_EdgeInf_EdgeInf_2 = function () { return (Nd = a._emscripten_bind_EdgeInf_EdgeInf_2 = a.asm.Sb).apply(null, arguments); }, Od = a._emscripten_bind_EdgeInf_EdgeInf_3 = function () { return (Od = a._emscripten_bind_EdgeInf_EdgeInf_3 = a.asm.Tb).apply(null, arguments); }, Pd = a._emscripten_bind_EdgeInf___destroy___0 = function () { return (Pd = a._emscripten_bind_EdgeInf___destroy___0 = a.asm.Ub).apply(null, arguments); }, Qd = a._emscripten_bind_LineRep_get_begin_0 =
            function () { return (Qd = a._emscripten_bind_LineRep_get_begin_0 = a.asm.Vb).apply(null, arguments); }, Rd = a._emscripten_bind_LineRep_set_begin_1 = function () { return (Rd = a._emscripten_bind_LineRep_set_begin_1 = a.asm.Wb).apply(null, arguments); }, Sd = a._emscripten_bind_LineRep_get_end_0 = function () { return (Sd = a._emscripten_bind_LineRep_get_end_0 = a.asm.Xb).apply(null, arguments); }, Td = a._emscripten_bind_LineRep_set_end_1 = function () { return (Td = a._emscripten_bind_LineRep_set_end_1 = a.asm.Yb).apply(null, arguments); }, Ud = a._emscripten_bind_LineRep___destroy___0 =
            function () { return (Ud = a._emscripten_bind_LineRep___destroy___0 = a.asm.Zb).apply(null, arguments); }, Vd = a._emscripten_bind_Router_Router_1 = function () { return (Vd = a._emscripten_bind_Router_Router_1 = a.asm._b).apply(null, arguments); }, Wd = a._emscripten_bind_Router_processTransaction_0 = function () { return (Wd = a._emscripten_bind_Router_processTransaction_0 = a.asm.$b).apply(null, arguments); }, Xd = a._emscripten_bind_Router_printInfo_0 = function () { return (Xd = a._emscripten_bind_Router_printInfo_0 = a.asm.ac).apply(null, arguments); }, Yd = a._emscripten_bind_Router_deleteConnector_1 = function () { return (Yd = a._emscripten_bind_Router_deleteConnector_1 = a.asm.bc).apply(null, arguments); }, Zd = a._emscripten_bind_Router_moveShape_3 = function () { return (Zd = a._emscripten_bind_Router_moveShape_3 = a.asm.cc).apply(null, arguments); }, $d = a._emscripten_bind_Router___destroy___0 = function () { return ($d = a._emscripten_bind_Router___destroy___0 = a.asm.dc).apply(null, arguments); }, ae = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirNone = function () {
            return (ae = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirNone =
                a.asm.ec).apply(null, arguments);
        }, be = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirUp = function () { return (be = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirUp = a.asm.fc).apply(null, arguments); }, ce = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirDown = function () { return (ce = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirDown = a.asm.gc).apply(null, arguments); }, de = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirLeft = function () { return (de = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirLeft = a.asm.hc).apply(null, arguments); }, ee = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirRight =
            function () { return (ee = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirRight = a.asm.ic).apply(null, arguments); }, fe = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirAll = function () { return (fe = a._emscripten_enum_Avoid_ConnDirFlag_ConnDirAll = a.asm.jc).apply(null, arguments); }, ge = a._emscripten_enum_Avoid_ConnEndType_ConnEndPoint = function () { return (ge = a._emscripten_enum_Avoid_ConnEndType_ConnEndPoint = a.asm.kc).apply(null, arguments); }, he = a._emscripten_enum_Avoid_ConnEndType_ConnEndShapePin = function () {
            return (he = a._emscripten_enum_Avoid_ConnEndType_ConnEndShapePin =
                a.asm.lc).apply(null, arguments);
        }, ie = a._emscripten_enum_Avoid_ConnEndType_ConnEndJunction = function () { return (ie = a._emscripten_enum_Avoid_ConnEndType_ConnEndJunction = a.asm.mc).apply(null, arguments); }, je = a._emscripten_enum_Avoid_ConnEndType_ConnEndEmpty = function () { return (je = a._emscripten_enum_Avoid_ConnEndType_ConnEndEmpty = a.asm.nc).apply(null, arguments); }, ke = a._emscripten_enum_Avoid_ActionType_ShapeMove = function () { return (ke = a._emscripten_enum_Avoid_ActionType_ShapeMove = a.asm.oc).apply(null, arguments); }, le = a._emscripten_enum_Avoid_ActionType_ShapeAdd = function () { return (le = a._emscripten_enum_Avoid_ActionType_ShapeAdd = a.asm.pc).apply(null, arguments); }, me = a._emscripten_enum_Avoid_ActionType_ShapeRemove = function () { return (me = a._emscripten_enum_Avoid_ActionType_ShapeRemove = a.asm.qc).apply(null, arguments); }, ne = a._emscripten_enum_Avoid_ActionType_JunctionMove = function () { return (ne = a._emscripten_enum_Avoid_ActionType_JunctionMove = a.asm.rc).apply(null, arguments); }, oe = a._emscripten_enum_Avoid_ActionType_JunctionAdd =
            function () { return (oe = a._emscripten_enum_Avoid_ActionType_JunctionAdd = a.asm.sc).apply(null, arguments); }, pe = a._emscripten_enum_Avoid_ActionType_JunctionRemove = function () { return (pe = a._emscripten_enum_Avoid_ActionType_JunctionRemove = a.asm.tc).apply(null, arguments); }, qe = a._emscripten_enum_Avoid_ActionType_ConnChange = function () { return (qe = a._emscripten_enum_Avoid_ActionType_ConnChange = a.asm.uc).apply(null, arguments); }, re = a._emscripten_enum_Avoid_ActionType_ConnectionPinChange = function () {
            return (re = a._emscripten_enum_Avoid_ActionType_ConnectionPinChange =
                a.asm.vc).apply(null, arguments);
        }, se = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_CW90 = function () { return (se = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_CW90 = a.asm.wc).apply(null, arguments); }, te = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_CW180 = function () { return (te = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_CW180 = a.asm.xc).apply(null, arguments); }, ue = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_CW270 =
            function () { return (ue = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_CW270 = a.asm.yc).apply(null, arguments); }, ve = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_FlipX = function () { return (ve = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_FlipX = a.asm.zc).apply(null, arguments); }, we = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_FlipY = function () {
            return (we = a._emscripten_enum_Avoid_ShapeTransformationType_TransformationType_FlipY =
                a.asm.Ac).apply(null, arguments);
        }, xe = a._emscripten_enum_Avoid_ConnType_ConnType_None = function () { return (xe = a._emscripten_enum_Avoid_ConnType_ConnType_None = a.asm.Bc).apply(null, arguments); }, ye = a._emscripten_enum_Avoid_ConnType_ConnType_PolyLine = function () { return (ye = a._emscripten_enum_Avoid_ConnType_ConnType_PolyLine = a.asm.Cc).apply(null, arguments); }, ze = a._emscripten_enum_Avoid_ConnType_ConnType_Orthogonal = function () { return (ze = a._emscripten_enum_Avoid_ConnType_ConnType_Orthogonal = a.asm.Dc).apply(null, arguments); }, Ae = a._emscripten_enum_Avoid_RouterFlag_PolyLineRouting = function () { return (Ae = a._emscripten_enum_Avoid_RouterFlag_PolyLineRouting = a.asm.Ec).apply(null, arguments); }, Be = a._emscripten_enum_Avoid_RouterFlag_OrthogonalRouting = function () { return (Be = a._emscripten_enum_Avoid_RouterFlag_OrthogonalRouting = a.asm.Fc).apply(null, arguments); }, Ce;
        La = function De() { Ce || Ee(); Ce || (La = De); };
        function Ee() {
            function b() { if (!Ce && (Ce = !0, a.calledRun = !0, !wa)) {
                Ga = !0;
                Ra(Da);
                Ra(Ea);
                aa(a);
                if (a.onRuntimeInitialized)
                    a.onRuntimeInitialized();
                if (a.postRun)
                    for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length;) {
                        var c = a.postRun.shift();
                        Fa.unshift(c);
                    }
                Ra(Fa);
            } }
            if (!(0 < Ja)) {
                if (a.preRun)
                    for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length;)
                        Ia();
                Ra(Ca);
                0 < Ja || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function () { setTimeout(function () { a.setStatus(""); }, 1); b(); }, 1)) :
                    b());
            }
        }
        a.run = Ee;
        if (a.preInit)
            for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length;)
                a.preInit.pop()();
        Ee();
        function u() { }
        u.prototype = Object.create(u.prototype);
        u.prototype.constructor = u;
        u.prototype.Hc = u;
        u.Ic = {};
        a.WrapperObject = u;
        function v(b) { return (b || u).Ic; }
        a.getCache = v;
        function w(b, c) { var d = v(c), e = d[b]; if (e)
            return e; e = Object.create((c || u).prototype); e.Gc = b; return d[b] = e; }
        a.wrapPointer = w;
        a.castObject = function (b, c) { return w(b.Gc, c); };
        a.NULL = w(0);
        a.destroy = function (b) { if (!b.__destroy__)
            throw "Error: Cannot destroy object. (Did you create it yourself?)"; b.__destroy__(); delete v(b.Hc)[b.Gc]; };
        a.compare = function (b, c) { return b.Gc === c.Gc; };
        a.getPointer = function (b) { return b.Gc; };
        a.getClass = function (b) { return b.Hc; };
        var Fe = 0, Ge = 0, He = [], Ie = 0;
        function x() { throw "cannot construct a VoidPtr, no constructor in IDL"; }
        x.prototype = Object.create(u.prototype);
        x.prototype.constructor = x;
        x.prototype.Hc = x;
        x.Ic = {};
        a.VoidPtr = x;
        x.prototype.__destroy__ = function () { kb(this.Gc); };
        function z() { this.Gc = lb(); v(z)[this.Gc] = this; }
        z.prototype = Object.create(u.prototype);
        z.prototype.constructor = z;
        z.prototype.Hc = z;
        z.Ic = {};
        a.HyperedgeImprover = z;
        z.prototype.clear = z.prototype.clear = function () { mb(this.Gc); };
        z.prototype.setRouter = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); nb(c, b); };
        z.prototype.__destroy__ = function () { ob(this.Gc); };
        function A() { this.Gc = pb(); v(A)[this.Gc] = this; }
        A.prototype = Object.create(u.prototype);
        A.prototype.constructor = A;
        A.prototype.Hc = A;
        A.Ic = {};
        a.Box = A;
        A.prototype.length = A.prototype.length = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return qb(c, b); };
        A.prototype.width = A.prototype.width = function () { return rb(this.Gc); };
        A.prototype.height = A.prototype.height = function () { return sb(this.Gc); };
        A.prototype.get_min = A.prototype.ed = function () { return w(tb(this.Gc), B); };
        A.prototype.set_min = A.prototype.zd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); ub(c, b); };
        Object.defineProperty(A.prototype, "min", { get: A.prototype.ed, set: A.prototype.zd });
        A.prototype.get_max = A.prototype.dd = function () { return w(vb(this.Gc), B); };
        A.prototype.set_max = A.prototype.yd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); wb(c, b); };
        Object.defineProperty(A.prototype, "max", { get: A.prototype.dd, set: A.prototype.yd });
        A.prototype.__destroy__ = function () { xb(this.Gc); };
        function C() { throw "cannot construct a PolygonInterface, no constructor in IDL"; }
        C.prototype = Object.create(u.prototype);
        C.prototype.constructor = C;
        C.prototype.Hc = C;
        C.Ic = {};
        a.PolygonInterface = C;
        C.prototype.clear = C.prototype.clear = function () { yb(this.Gc); };
        C.prototype.empty = C.prototype.empty = function () { return !!zb(this.Gc); };
        C.prototype.size = C.prototype.size = function () { return Ab(this.Gc); };
        C.prototype.id = C.prototype.id = function () { return Bb(this.Gc); };
        C.prototype.at = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return w(Cb(c, b), B); };
        C.prototype.boundingRectPolygon = function () { return w(Db(this.Gc), E); };
        C.prototype.offsetBoundingBox = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return w(Eb(c, b), A); };
        C.prototype.offsetPolygon = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return w(Fb(c, b), E); };
        C.prototype.__destroy__ = function () { Gb(this.Gc); };
        function E(b) { b && "object" === typeof b && (b = b.Gc); this.Gc = void 0 === b ? Hb() : Ib(b); v(E)[this.Gc] = this; }
        E.prototype = Object.create(u.prototype);
        E.prototype.constructor = E;
        E.prototype.Hc = E;
        E.Ic = {};
        a.Polygon = E;
        E.prototype.setPoint = function (b, c) { var d = this.Gc; b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); Jb(d, b, c); };
        E.prototype.size = E.prototype.size = function () { return Kb(this.Gc); };
        E.prototype.get_ps = E.prototype.md = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return w(Lb(c, b), B); };
        E.prototype.set_ps = E.prototype.Fd = function (b, c) { var d = this.Gc; if (Ie) {
            for (var e = 0; e < He.length; e++)
                a._free(He[e]);
            He.length = 0;
            a._free(Fe);
            Fe = 0;
            Ge += Ie;
            Ie = 0;
        } Fe || (Ge += 128, Fe = a._malloc(Ge), assert(Fe)); b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); Mb(d, b, c); };
        Object.defineProperty(E.prototype, "ps", { get: E.prototype.md, set: E.prototype.Fd });
        E.prototype.__destroy__ = function () { Nb(this.Gc); };
        function B(b, c) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); this.Gc = void 0 === b ? Ob() : void 0 === c ? _emscripten_bind_Point_Point_1(b) : Pb(b, c); v(B)[this.Gc] = this; }
        B.prototype = Object.create(u.prototype);
        B.prototype.constructor = B;
        B.prototype.Hc = B;
        B.Ic = {};
        a.Point = B;
        B.prototype.equal = B.prototype.equal = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return !!Qb(c, b); };
        B.prototype.get_x = B.prototype.pd = function () { return Rb(this.Gc); };
        B.prototype.set_x = B.prototype.Id = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Sb(c, b); };
        Object.defineProperty(B.prototype, "x", { get: B.prototype.pd, set: B.prototype.Id });
        B.prototype.get_y = B.prototype.qd = function () { return Tb(this.Gc); };
        B.prototype.set_y = B.prototype.Jd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Ub(c, b); };
        Object.defineProperty(B.prototype, "y", { get: B.prototype.qd, set: B.prototype.Jd });
        B.prototype.get_id = B.prototype.cd = function () { return Vb(this.Gc); };
        B.prototype.set_id = B.prototype.xd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Wb(c, b); };
        Object.defineProperty(B.prototype, "id", { get: B.prototype.cd, set: B.prototype.xd });
        B.prototype.get_vn = B.prototype.Qc = function () { return Xb(this.Gc); };
        B.prototype.set_vn = B.prototype.Sc = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Yb(c, b); };
        Object.defineProperty(B.prototype, "vn", { get: B.prototype.Qc, set: B.prototype.Sc });
        B.prototype.__destroy__ = function () { Zb(this.Gc); };
        function G(b, c, d) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); this.Gc = $b(b, c, d); v(G)[this.Gc] = this; }
        G.prototype = Object.create(u.prototype);
        G.prototype.constructor = G;
        G.prototype.Hc = G;
        G.Ic = {};
        a.Rectangle = G;
        G.prototype.__destroy__ = function () { ac(this.Gc); };
        function H() { this.Gc = bc(); v(H)[this.Gc] = this; }
        H.prototype = Object.create(u.prototype);
        H.prototype.constructor = H;
        H.prototype.Hc = H;
        H.Ic = {};
        a.HyperedgeTreeNode = H;
        H.prototype.writeEdgesToConns = function (b, c) { var d = this.Gc; b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); cc(d, b, c); };
        H.prototype.__destroy__ = function () { dc(this.Gc); };
        function J(b, c, d) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); this.Gc = ec(b, c, d); v(J)[this.Gc] = this; }
        J.prototype = Object.create(u.prototype);
        J.prototype.constructor = J;
        J.prototype.Hc = J;
        J.Ic = {};
        a.HyperedgeTreeEdge = J;
        J.prototype.__destroy__ = function () { fc(this.Gc); };
        function K() { this.Gc = hc(); v(K)[this.Gc] = this; }
        K.prototype = Object.create(u.prototype);
        K.prototype.constructor = K;
        K.prototype.Hc = K;
        K.Ic = {};
        a.AStarPath = K;
        K.prototype.search = K.prototype.search = function (b, c, d, e) { var g = this.Gc; b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); e && "object" === typeof e && (e = e.Gc); ic(g, b, c, d, e); };
        K.prototype.__destroy__ = function () { jc(this.Gc); };
        function L(b, c) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); this.Gc = void 0 === c ? kc(b) : lc(b, c); v(L)[this.Gc] = this; }
        L.prototype = Object.create(u.prototype);
        L.prototype.constructor = L;
        L.prototype.Hc = L;
        L.Ic = {};
        a.ConnEnd = L;
        L.prototype.__destroy__ = function () { mc(this.Gc); };
        function M(b, c, d, e) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); e && "object" === typeof e && (e = e.Gc); this.Gc = void 0 === d ? nc(b, c) : void 0 === e ? oc(b, c, d) : pc(b, c, d, e); v(M)[this.Gc] = this; }
        M.prototype = Object.create(u.prototype);
        M.prototype.constructor = M;
        M.prototype.Hc = M;
        M.Ic = {};
        a.ActionInfo = M;
        M.prototype.obstacle = function () { return w(qc(this.Gc), N); };
        M.prototype.shape = M.prototype.shape = function () { return w(rc(this.Gc), O); };
        M.prototype.conn = function () { return w(sc(this.Gc), P); };
        M.prototype.junction = function () { return w(tc(this.Gc), Q); };
        M.prototype.addConnEndUpdate = function (b, c, d) { var e = this.Gc; b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); uc(e, b, c, d); };
        M.prototype.get_type = M.prototype.Tc = function () { return vc(this.Gc); };
        M.prototype.set_type = M.prototype.Rc = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); wc(c, b); };
        Object.defineProperty(M.prototype, "type", { get: M.prototype.Tc, set: M.prototype.Rc });
        M.prototype.get_objPtr = M.prototype.kd = function () { return w(xc(this.Gc), x); };
        M.prototype.set_objPtr = M.prototype.Dd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); yc(c, b); };
        Object.defineProperty(M.prototype, "objPtr", { get: M.prototype.kd, set: M.prototype.Dd });
        M.prototype.get_newPoly = M.prototype.gd = function () { return w(zc(this.Gc), E); };
        M.prototype.set_newPoly = M.prototype.Ad = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Ac(c, b); };
        Object.defineProperty(M.prototype, "newPoly", { get: M.prototype.gd, set: M.prototype.Ad });
        M.prototype.get_newPosition = M.prototype.hd = function () { return w(Bc(this.Gc), B); };
        M.prototype.set_newPosition = M.prototype.Bd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Cc(c, b); };
        Object.defineProperty(M.prototype, "newPosition", { get: M.prototype.hd, set: M.prototype.Bd });
        M.prototype.get_firstMove = M.prototype.bd = function () { return !!Dc(this.Gc); };
        M.prototype.set_firstMove = M.prototype.wd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Ec(c, b); };
        Object.defineProperty(M.prototype, "firstMove", { get: M.prototype.bd, set: M.prototype.wd });
        M.prototype.__destroy__ = function () { Fc(this.Gc); };
        function R(b, c, d, e, g, h, t) {
            b && "object" === typeof b && (b = b.Gc);
            c && "object" === typeof c && (c = c.Gc);
            d && "object" === typeof d && (d = d.Gc);
            e && "object" === typeof e && (e = e.Gc);
            g && "object" === typeof g && (g = g.Gc);
            h && "object" === typeof h && (h = h.Gc);
            t && "object" === typeof t && (t = t.Gc);
            this.Gc = void 0 === d ? Gc(b, c) : void 0 === e ? Hc(b, c, d) : void 0 === g ? _emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_4(b, c, d, e) : void 0 === h ? _emscripten_bind_ShapeConnectionPin_ShapeConnectionPin_5(b, c, d, e, g) : void 0 === t ? Ic(b, c, d, e, g, h) : Jc(b, c, d, e, g, h, t);
            v(R)[this.Gc] = this;
        }
        R.prototype = Object.create(u.prototype);
        R.prototype.constructor = R;
        R.prototype.Hc = R;
        R.Ic = {};
        a.ShapeConnectionPin = R;
        R.prototype.setConnectionCost = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Kc(c, b); };
        R.prototype.position = R.prototype.position = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return void 0 === b ? w(Lc(c), B) : w(Mc(c, b), B); };
        R.prototype.directions = function () { return Nc(this.Gc); };
        R.prototype.setExclusive = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Oc(c, b); };
        R.prototype.isExclusive = function () { return !!Pc(this.Gc); };
        R.prototype.__destroy__ = function () { Qc(this.Gc); };
        function N() { throw "cannot construct a Obstacle, no constructor in IDL"; }
        N.prototype = Object.create(u.prototype);
        N.prototype.constructor = N;
        N.prototype.Hc = N;
        N.Ic = {};
        a.Obstacle = N;
        N.prototype.id = N.prototype.id = function () { return Rc(this.Gc); };
        N.prototype.polygon = function () { return w(Sc(this.Gc), E); };
        N.prototype.router = function () { return w(Tc(this.Gc), S); };
        N.prototype.position = N.prototype.position = function () { return w(Uc(this.Gc), B); };
        N.prototype.__destroy__ = function () { Vc(this.Gc); };
        function Q(b, c, d) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); this.Gc = void 0 === d ? Wc(b, c) : Xc(b, c, d); v(Q)[this.Gc] = this; }
        Q.prototype = Object.create(u.prototype);
        Q.prototype.constructor = Q;
        Q.prototype.Hc = Q;
        Q.Ic = {};
        a.JunctionRef = Q;
        Q.prototype.position = Q.prototype.position = function () { return w(Yc(this.Gc), B); };
        Q.prototype.__destroy__ = function () { Zc(this.Gc); };
        function O(b, c, d) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); this.Gc = void 0 === d ? $c(b, c) : ad(b, c, d); v(O)[this.Gc] = this; }
        O.prototype = Object.create(u.prototype);
        O.prototype.constructor = O;
        O.prototype.Hc = O;
        O.Ic = {};
        a.ShapeRef = O;
        O.prototype.polygon = function () { return w(bd(this.Gc), E); };
        O.prototype.position = O.prototype.position = function () { return w(cd(this.Gc), B); };
        O.prototype.__destroy__ = function () { dd(this.Gc); };
        function T() { throw "cannot construct a HyperedgeNewAndDeletedObjectLists, no constructor in IDL"; }
        T.prototype = Object.create(u.prototype);
        T.prototype.constructor = T;
        T.prototype.Hc = T;
        T.Ic = {};
        a.HyperedgeNewAndDeletedObjectLists = T;
        T.prototype.__destroy__ = function () { ed(this.Gc); };
        function U() { this.Gc = fd(); v(U)[this.Gc] = this; }
        U.prototype = Object.create(u.prototype);
        U.prototype.constructor = U;
        U.prototype.Hc = U;
        U.Ic = {};
        a.HyperedgeRerouter = U;
        U.prototype.registerHyperedgeForRerouting = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); return gd(c, b); };
        U.prototype.__destroy__ = function () { hd(this.Gc); };
        function V() { throw "cannot construct a VertInf, no constructor in IDL"; }
        V.prototype = Object.create(u.prototype);
        V.prototype.constructor = V;
        V.prototype.Hc = V;
        V.Ic = {};
        a.VertInf = V;
        V.prototype.__destroy__ = function () { id(this.Gc); };
        function W(b, c, d) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); this.Gc = void 0 === b ? jd() : void 0 === c ? _emscripten_bind_VertID_VertID_1(b) : void 0 === d ? kd(b, c) : ld(b, c, d); v(W)[this.Gc] = this; }
        W.prototype = Object.create(u.prototype);
        W.prototype.constructor = W;
        W.prototype.Hc = W;
        W.Ic = {};
        a.VertID = W;
        W.prototype.get_objID = W.prototype.jd = function () { return md(this.Gc); };
        W.prototype.set_objID = W.prototype.Cd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); nd(c, b); };
        Object.defineProperty(W.prototype, "objID", { get: W.prototype.jd, set: W.prototype.Cd });
        W.prototype.get_vn = W.prototype.Qc = function () { return od(this.Gc); };
        W.prototype.set_vn = W.prototype.Sc = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); pd(c, b); };
        Object.defineProperty(W.prototype, "vn", { get: W.prototype.Qc, set: W.prototype.Sc });
        W.prototype.get_props = W.prototype.ld = function () { return qd(this.Gc); };
        W.prototype.set_props = W.prototype.Ed = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); rd(c, b); };
        Object.defineProperty(W.prototype, "props", { get: W.prototype.ld, set: W.prototype.Ed });
        W.prototype.get_src = W.prototype.nd = function () { return sd(this.Gc); };
        Object.defineProperty(W.prototype, "src", { get: W.prototype.nd });
        W.prototype.get_tar = W.prototype.od = function () { return td(this.Gc); };
        Object.defineProperty(W.prototype, "tar", { get: W.prototype.od });
        W.prototype.get_PROP_ConnPoint = W.prototype.Wc = function () { return ud(this.Gc); };
        Object.defineProperty(W.prototype, "PROP_ConnPoint", { get: W.prototype.Wc });
        W.prototype.get_PROP_OrthShapeEdge = W.prototype.Zc = function () { return vd(this.Gc); };
        Object.defineProperty(W.prototype, "PROP_OrthShapeEdge", { get: W.prototype.Zc });
        W.prototype.get_PROP_ConnectionPin = W.prototype.Xc = function () { return wd(this.Gc); };
        Object.defineProperty(W.prototype, "PROP_ConnectionPin", { get: W.prototype.Xc });
        W.prototype.get_PROP_ConnCheckpoint = W.prototype.Vc = function () { return xd(this.Gc); };
        Object.defineProperty(W.prototype, "PROP_ConnCheckpoint", { get: W.prototype.Vc });
        W.prototype.get_PROP_DummyPinHelper = W.prototype.Yc = function () { return yd(this.Gc); };
        Object.defineProperty(W.prototype, "PROP_DummyPinHelper", { get: W.prototype.Yc });
        W.prototype.__destroy__ = function () { zd(this.Gc); };
        function Je() { throw "cannot construct a MinimumTerminalSpanningTree, no constructor in IDL"; }
        Je.prototype = Object.create(u.prototype);
        Je.prototype.constructor = Je;
        Je.prototype.Hc = Je;
        Je.Ic = {};
        a.MinimumTerminalSpanningTree = Je;
        Je.prototype.__destroy__ = function () { Ad(this.Gc); };
        function X(b) { b && "object" === typeof b && (b = b.Gc); this.Gc = Bd(b); v(X)[this.Gc] = this; }
        X.prototype = Object.create(u.prototype);
        X.prototype.constructor = X;
        X.prototype.Hc = X;
        X.Ic = {};
        a.Checkpoint = X;
        X.prototype.__destroy__ = function () { Cd(this.Gc); };
        function P(b, c, d, e) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); e && "object" === typeof e && (e = e.Gc); this.Gc = void 0 === e ? Dd(b, c, d) : Ed(b, c, d, e); v(P)[this.Gc] = this; }
        P.prototype = Object.create(u.prototype);
        P.prototype.constructor = P;
        P.prototype.Hc = P;
        P.Ic = {};
        a.ConnRef = P;
        P.prototype.id = P.prototype.id = function () { return Fd(this.Gc); };
        P.prototype.setCallback = function (b, c) {
            var d = this.Gc;
            assert(b instanceof Function, "Expecting function");
            if (!ta) {
                ta = new WeakMap;
                for (var e = 0; e < q.length; e++) {
                    var g = q.get(e);
                    g && ta.set(g, e);
                }
            }
            if (ta.has(b))
                b = ta.get(b);
            else {
                if (sa.length)
                    e = sa.pop();
                else {
                    try {
                        q.grow(1);
                    }
                    catch (F) {
                        if (!(F instanceof RangeError))
                            throw F;
                        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                    }
                    e = q.length - 1;
                }
                try {
                    q.set(e, b);
                }
                catch (F) {
                    if (!(F instanceof TypeError))
                        throw F;
                    if ("function" === typeof WebAssembly.Function) {
                        var h = { i: "i32", j: "i64",
                            f: "f32", d: "f64" }, t = { parameters: [], results: [] };
                        for (g = 1; 2 > g; ++g)
                            t.parameters.push(h["vi"[g]]);
                        g = new WebAssembly.Function(t, b);
                    }
                    else {
                        h = [1, 0, 1, 96];
                        t = { i: 127, j: 126, f: 125, d: 124 };
                        h.push(1);
                        for (g = 0; 1 > g; ++g)
                            h.push(t["i"[g]]);
                        h.push(0);
                        h[1] = h.length - 2;
                        g = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(h, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
                        g = new WebAssembly.Module(g);
                        g = (new WebAssembly.Instance(g, { e: { f: b } })).exports.f;
                    }
                    q.set(e, g);
                }
                ta.set(b, e);
                b = e;
            }
            c && "object" === typeof c && (c = c.Gc);
            Gd(d, b, c);
        };
        P.prototype.setSourceEndpoint = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Hd(c, b); };
        P.prototype.setDestEndpoint = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Id(c, b); };
        P.prototype.routingType = function () { return Jd(this.Gc); };
        P.prototype.setRoutingType = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Kd(c, b); };
        P.prototype.displayRoute = function () { return w(Ld(this.Gc), E); };
        P.prototype.__destroy__ = function () { Md(this.Gc); };
        function Y(b, c, d) { b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); this.Gc = void 0 === d ? Nd(b, c) : Od(b, c, d); v(Y)[this.Gc] = this; }
        Y.prototype = Object.create(u.prototype);
        Y.prototype.constructor = Y;
        Y.prototype.Hc = Y;
        Y.Ic = {};
        a.EdgeInf = Y;
        Y.prototype.__destroy__ = function () { Pd(this.Gc); };
        function Z() { throw "cannot construct a LineRep, no constructor in IDL"; }
        Z.prototype = Object.create(u.prototype);
        Z.prototype.constructor = Z;
        Z.prototype.Hc = Z;
        Z.Ic = {};
        a.LineRep = Z;
        Z.prototype.get_begin = Z.prototype.$c = function () { return w(Qd(this.Gc), B); };
        Z.prototype.set_begin = Z.prototype.sd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Rd(c, b); };
        Object.defineProperty(Z.prototype, "begin", { get: Z.prototype.$c, set: Z.prototype.sd });
        Z.prototype.get_end = Z.prototype.ad = function () { return w(Sd(this.Gc), B); };
        Z.prototype.set_end = Z.prototype.vd = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Td(c, b); };
        Object.defineProperty(Z.prototype, "end", { get: Z.prototype.ad, set: Z.prototype.vd });
        Z.prototype.__destroy__ = function () { Ud(this.Gc); };
        function S(b) { b && "object" === typeof b && (b = b.Gc); this.Gc = Vd(b); v(S)[this.Gc] = this; }
        S.prototype = Object.create(u.prototype);
        S.prototype.constructor = S;
        S.prototype.Hc = S;
        S.Ic = {};
        a.Router = S;
        S.prototype.processTransaction = function () { return !!Wd(this.Gc); };
        S.prototype.printInfo = function () { Xd(this.Gc); };
        S.prototype.deleteConnector = function (b) { var c = this.Gc; b && "object" === typeof b && (b = b.Gc); Yd(c, b); };
        S.prototype.moveShape = function (b, c, d) { var e = this.Gc; b && "object" === typeof b && (b = b.Gc); c && "object" === typeof c && (c = c.Gc); d && "object" === typeof d && (d = d.Gc); Zd(e, b, c, d); };
        S.prototype.__destroy__ = function () { $d(this.Gc); };
        (function () {
            function b() {
                a.ConnDirNone = ae();
                a.ConnDirUp = be();
                a.ConnDirDown = ce();
                a.ConnDirLeft = de();
                a.ConnDirRight = ee();
                a.ConnDirAll = fe();
                a.ConnEndPoint = ge();
                a.ConnEndShapePin = he();
                a.ConnEndJunction = ie();
                a.ConnEndEmpty = je();
                a.ShapeMove = ke();
                a.ShapeAdd = le();
                a.ShapeRemove = me();
                a.JunctionMove = ne();
                a.JunctionAdd = oe();
                a.JunctionRemove = pe();
                a.ConnChange = qe();
                a.ConnectionPinChange = re();
                a.TransformationType_CW90 = se();
                a.TransformationType_CW180 = te();
                a.TransformationType_CW270 = ue();
                a.TransformationType_FlipX =
                    ve();
                a.TransformationType_FlipY = we();
                a.ConnType_None = xe();
                a.ConnType_PolyLine = ye();
                a.ConnType_Orthogonal = ze();
                a.PolyLineRouting = Ae();
                a.OrthogonalRouting = Be();
            }
            Ga ? b() : Ea.unshift(b);
        })();
        return initAvoidModule.ready;
    });
})();
export default initAvoidModule;
//# sourceMappingURL=libavoid.js.map
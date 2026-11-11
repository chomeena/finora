/* =========================================================
   FINORA - CREATIVE LAYER
   Scroll leaf, reveal animations, floating decoration,
   animated rings, red-flag phone, flip cards, Mudra ladder,
   50/30/20 donut and live charts for pricing / break-even.
   Runs entirely in the browser. Nothing is sent anywhere.
========================================================= */
(function () {
    "use strict";

    var d = document;
    d.documentElement.classList.add("js");

    var $ = function (s, c) { return (c || d).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
    var byId = function (id) { return d.getElementById(id); };
    var rupee = function (n) { return "\u20B9" + Math.round(Number(n)).toLocaleString("en-IN"); };
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var canIO = "IntersectionObserver" in window;

    /* ---------- 1. Scroll progress leaf ---------- */
    (function () {
        var track = d.createElement("div");
        track.className = "scroll-track";
        track.setAttribute("aria-hidden", "true");
        track.innerHTML = '<div class="scroll-bar"><i class="fa-solid fa-leaf"></i></div>';
        d.body.appendChild(track);
        var bar = $(".scroll-bar", track), ticking = false;
        function update() {
            var h = d.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
        }, { passive: true });
        update();
    })();

    /* ---------- 3. Rings for the home statistics ---------- */
    var ringEls = [];
    $$(".barrier-stat").forEach(function (el) {
        var m = el.textContent.match(/([\d.]+)/);
        if (!m) { return; }
        var v = parseFloat(m[1]);
        el.setAttribute("role", "img");
        el.setAttribute("aria-label", el.textContent.trim());
        el.classList.add("ring");
        el.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="rt" cx="50" cy="50" r="44"></circle><circle class="rp" cx="50" cy="50" r="44"></circle></svg><b>0<small>%</small></b>';
        el._v = v;
        ringEls.push(el);
    });
    function runRing(el) {
        if (el._ran) { return; }
        el._ran = true;
        var rp = $(".rp", el), b = $("b", el), v = el._v, start = null, dur = 1500;
        rp.style.strokeDashoffset = String(276.46 * (1 - v / 100));
        function step(ts) {
            if (!start) { start = ts; }
            var t = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - t, 3);
            b.firstChild.nodeValue = String(Math.round(v * e));
            if (t < 1) { window.requestAnimationFrame(step); }
        }
        window.requestAnimationFrame(step);
    }

    /* ---------- 4. Myth / fact flip cards ---------- */
    $$(".myth-card").forEach(function (card) {
        var ps = $$("p", card);
        if (ps.length < 2) { return; }
        var mythText = ps[0].textContent, factText = ps[1].textContent;
        card.classList.add("flip");
        card.innerHTML =
            '<button type="button" class="flip-btn" aria-pressed="false">' +
            '<span class="flip-face flip-front"><span class="myth-label myth">MYTH</span><p></p><span class="flip-tap"><i class="fa-solid fa-hand-pointer"></i> Tap to reveal the fact</span></span>' +
            '<span class="flip-face flip-back"><span class="myth-label fact">FACT</span><p></p><span class="flip-tap" style="color:#2F7A59"><i class="fa-solid fa-rotate-left"></i> Tap to flip back</span></span>' +
            '</button>';
        $$("p", card)[0].textContent = mythText;
        $$("p", card)[1].textContent = factText;
        var btn = $(".flip-btn", card);
        btn.addEventListener("click", function () {
            var on = btn.classList.toggle("flipped");
            btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
    });

    /* ---------- 5. Red-flag phone ---------- */
    (function () {
        var game = byId("flagGame");
        if (!game) { return; }
        var flags = $$(".flag", game), dots = $$(".flag-dots i", game);
        var info = byId("flagInfo"), count = byId("flagCount"), found = 0;
        flags.forEach(function (f) {
            f.addEventListener("click", function () {
                if (!f.classList.contains("found")) {
                    f.classList.add("found");
                    if (dots[found]) { dots[found].classList.add("on"); dots[found].innerHTML = '<i class="fa-solid fa-flag"></i>'; }
                    found++;
                    count.textContent = found + " of " + flags.length + " found";
                }
                var done = found === flags.length;
                info.className = "flag-info" + (done ? " done" : "");
                info.innerHTML = '<h4><i class="fa-solid ' + (done ? "fa-circle-check" : "fa-triangle-exclamation") + '"></i></h4><p></p>';
                $("h4", info).appendChild(d.createTextNode(f.getAttribute("data-title")));
                $("p", info).textContent = f.getAttribute("data-why") + (done ? " You found every red flag. Now try the game below." : "");
            });
        });
    })();

    /* ---------- 6. Mudra ladder ---------- */
    (function () {
        var rungs = $$(".rung");
        if (!rungs.length) { return; }
        var tag = byId("ladTag"), name = byId("ladName"), amt = byId("ladAmt"), txt = byId("ladText"), tip = byId("ladTip");
        function pick(r) {
            rungs.forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
            r.classList.add("active");
            r.setAttribute("aria-pressed", "true");
            tag.textContent = r.getAttribute("data-tag");
            name.textContent = r.getAttribute("data-name");
            amt.textContent = r.getAttribute("data-amt");
            txt.textContent = r.getAttribute("data-text");
            tip.textContent = r.getAttribute("data-tip");
        }
        rungs.forEach(function (r) { r.addEventListener("click", function () { pick(r); }); });
        pick(rungs[0]);
    })();

    /* ---------- 7. 50/30/20 donut ---------- */
    (function () {
        var inp = byId("ruleIncome");
        if (!inp) { return; }
        function draw() {
            var v = parseFloat(inp.value);
            if (isNaN(v) || v < 0) { v = 0; }
            byId("ruleHole").textContent = rupee(v);
            byId("ruleNeeds").textContent = rupee(v * 0.5);
            byId("ruleWants").textContent = rupee(v * 0.3);
            byId("ruleSave").textContent = rupee(v * 0.2);
        }
        inp.addEventListener("input", draw);
        draw();
    })();

    /* ---------- 8. Live charts: pricing and break-even ---------- */
    function val(id) { var el = byId(id); if (!el) { return NaN; } var v = parseFloat(el.value); return isNaN(v) ? NaN : v; }

    (function () {
        var form = byId("priceForm"), viz = byId("priceViz");
        if (!form || !viz) { return; }
        form.addEventListener("submit", function () {
            var mat = val("prMaterial"), oth = val("prOther") || 0, mins = val("prMinutes") || 0, hr = val("prHourly") || 0, mar = val("prMargin");
            if (isNaN(mat) || mat < 0 || isNaN(mar) || mar < 0) { viz.innerHTML = ""; return; }
            var time = (mins / 60) * hr, cost = mat + oth + time, profit = cost * mar / 100, price = cost + profit;
            var segs = [
                ["Materials", mat, "#9F86CE"], ["Packaging and other", oth, "#6C8EBF"],
                ["Your time", time, "#4FA37F"], ["Profit", profit, "#F3CC78"]
            ].filter(function (s) { return s[1] > 0; });
            if (price <= 0) { viz.innerHTML = ""; return; }
            var bar = segs.map(function (s) { return '<span style="flex-basis:' + (s[1] / price * 100).toFixed(2) + '%;background:' + s[2] + '" title="' + s[0] + '"></span>'; }).join("");
            var leg = segs.map(function (s) { return '<div><i style="background:' + s[2] + '"></i>' + s[0] + '<b>' + rupee(s[1]) + '</b></div>'; }).join("");
            viz.innerHTML = '<span class="viz-title">WHERE YOUR PRICE GOES</span><div class="stack-bar">' + bar + '</div><div class="stack-legend">' + leg + '</div>';
        });
        form.addEventListener("reset", function () { viz.innerHTML = ""; });
    })();

    (function () {
        var form = byId("beForm"), viz = byId("beViz");
        if (!form || !viz) { return; }
        form.addEventListener("submit", function () {
            var fixed = val("beFixed"), price = val("bePrice"), vc = val("beVar"), target = val("beTarget") || 0;
            if (isNaN(fixed) || fixed < 0 || isNaN(price) || price <= 0 || isNaN(vc) || vc < 0 || price - vc <= 0) { viz.innerHTML = ""; return; }
            var cm = price - vc, be = fixed / cm, goal = (fixed + target) / cm;
            var maxX = Math.max(10, Math.ceil(Math.max(be, goal) * 1.7));
            var maxY = Math.max(price * maxX, fixed + vc * maxX);
            var W = 320, H = 190, L = 40, R = 12, T = 12, B = 28;
            function X(u) { return L + (u / maxX) * (W - L - R); }
            function Y(v) { return H - B - (v / maxY) * (H - T - B); }
            var ry = function (u) { return price * u; }, cy = function (u) { return fixed + vc * u; };
            var loss = [X(0), Y(0), X(be), Y(ry(be)), X(0), Y(cy(0))].join(" ");
            var gain = [X(be), Y(ry(be)), X(maxX), Y(ry(maxX)), X(maxX), Y(cy(maxX))].join(" ");
            var svg =
                '<svg class="be-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Break-even chart: revenue line crosses cost line at ' + Math.ceil(be) + ' items">' +
                '<polygon points="' + loss + '" fill="#E04B5A" opacity=".22"></polygon>' +
                '<polygon points="' + gain + '" fill="#4FA37F" opacity=".3"></polygon>' +
                '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="currentColor" opacity=".4"></line>' +
                '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="currentColor" opacity=".4"></line>' +
                '<line x1="' + X(0) + '" y1="' + Y(fixed) + '" x2="' + X(maxX) + '" y2="' + Y(fixed) + '" stroke="#9F86CE" stroke-dasharray="4 4" opacity=".8"></line>' +
                '<line x1="' + X(0) + '" y1="' + Y(cy(0)) + '" x2="' + X(maxX) + '" y2="' + Y(cy(maxX)) + '" stroke="#9F86CE" stroke-width="2.5"></line>' +
                '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(maxX) + '" y2="' + Y(ry(maxX)) + '" stroke="#F3CC78" stroke-width="2.5"></line>' +
                '<circle cx="' + X(be) + '" cy="' + Y(ry(be)) + '" r="6" fill="#fff" stroke="#E04B5A" stroke-width="3"></circle>' +
                '<text x="' + Math.min(X(be) + 9, W - 78) + '" y="' + (Y(ry(be)) + 16) + '" style="font-weight:600">Break-even: ' + Math.ceil(be) + '</text>' +
                (target > 0 ? '<circle cx="' + X(goal) + '" cy="' + Y(ry(goal)) + '" r="5" fill="#4FA37F" stroke="#fff" stroke-width="2"></circle><text x="' + Math.min(X(goal) - 4, W - 62) + '" y="' + (Y(ry(goal)) - 9) + '" style="font-weight:600">Goal: ' + Math.ceil(goal) + '</text>' : "") +
                '<text x="' + (W - R) + '" y="' + (H - 9) + '" text-anchor="end">items sold per month \u2192</text>' +
                '<text x="' + (L + 4) + '" y="' + (T + 6) + '">\u20B9</text>' +
                "</svg>";
            viz.innerHTML = '<span class="viz-title">YOUR BREAK-EVEN CHART</span>' + svg +
                '<div class="be-legend"><span><i style="background:#F3CC78"></i>Money in (sales)</span><span><i style="background:#9F86CE"></i>Money out (costs)</span><span><i style="background:#4FA37F"></i>Profit zone</span><span><i style="background:#E04B5A"></i>Loss zone</span></div>';
        });
        form.addEventListener("reset", function () { viz.innerHTML = ""; });
    })();

    /* ---------- 8b. One question at a time (quiz + loan readiness) ---------- */
    function stepify(form, itemSel, actionSel, label) {
        if (!form) { return; }
        var items = $$(itemSel, form), actions = $$(actionSel, form), i = 0;
        if (items.length < 2) { return; }
        var nav = d.createElement("div");
        nav.className = "step-nav";
        nav.innerHTML = '<div class="step-top"><span class="step-count"></span><span class="step-hint">Pick an answer to continue</span></div><div class="step-bar"><span></span></div>';
        items[0].parentNode.insertBefore(nav, items[0]);
        var btns = d.createElement("div");
        btns.className = "step-btns";
        btns.innerHTML = '<button type="button" class="btn-outline-dark step-back">Back</button><button type="button" class="btn btn-primary step-next">Next <i class="fa-solid fa-arrow-right"></i></button>';
        items[items.length - 1].parentNode.insertBefore(btns, items[items.length - 1].nextSibling);
        var back = $(".step-back", btns), next = $(".step-next", btns);
        function answered(it) { return !!$("input:checked", it) || !$("input", it); }
        function show(n) {
            i = Math.max(0, Math.min(items.length - 1, n));
            items.forEach(function (it, k) { it.classList.toggle("step-hidden", k !== i); });
            var last = i === items.length - 1;
            actions.forEach(function (a) { a.classList.toggle("step-hidden", !last); });
            $(".step-count", nav).textContent = label + " " + (i + 1) + " of " + items.length;
            $(".step-bar span", nav).style.width = ((i + 1) / items.length * 100) + "%";
            back.style.visibility = i === 0 ? "hidden" : "visible";
            next.style.display = last ? "none" : "";
            next.disabled = !answered(items[i]);
            $(".step-hint", nav).style.visibility = answered(items[i]) ? "hidden" : "visible";
        }
        items.forEach(function (it) {
            it.addEventListener("change", function () {
                next.disabled = false;
                $(".step-hint", nav).style.visibility = "hidden";
                if (i < items.length - 1) { setTimeout(function () { if (answered(items[i])) { show(i + 1); } }, 380); }
            });
        });
        back.addEventListener("click", function () { show(i - 1); });
        next.addEventListener("click", function () { show(i + 1); });
        form.addEventListener("reset", function () { setTimeout(function () { show(0); }, 0); });
        show(0);
    }
    stepify(byId("financeQuiz"), ".quiz-question", ".quiz-actions", "Question");
    stepify(byId("readyForm"), ".ready-q", ".estimator-actions, #readyError", "Question");

    /* ---------- 9. Reveal on scroll ---------- */
    var targets = $$(
        ".section-heading, .door, .barrier-card, .tool-card, .path-card, .scheme-card, .essential-card, .dir-card, .story3, .gov-link, .step-card, .myth-card, .planner-card, .journey-box, .wizard, .estimator-wrapper, .ready-form, .checklist-box, .table-wrap, .flag-wrap, .ladder, .rule-wrap, .never, .safety-notice, .glossary, .matcher-wrap, .plan-wrap, .rb-wrap, .enquiry-wrapper, .quiz-container, .scam-game, .tab-panel.active"
    );
    targets.forEach(function (el, i) {
        el.classList.add("reveal");
        el.style.setProperty("--d", ((i % 4) * 0.08) + "s");
    });
    if (canIO) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) { return; }
                en.target.classList.add("in");
                $$(".ring", en.target).forEach(runRing);
                if (en.target.classList.contains("ring")) { runRing(en.target); }
                io.unobserve(en.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
        targets.forEach(function (el) { io.observe(el); });
        ringEls.forEach(function (el) { if (!el.classList.contains("reveal")) { io.observe(el); } });
    } else {
        targets.forEach(function (el) { el.classList.add("in"); });
        ringEls.forEach(runRing);
    }
})();

/* =========================================================
   LIVING TREE - grows as the visitor tries Finora tools.
   Reads the same saved progress as the journey badges.
========================================================= */
(function () {
    "use strict";
    var box = document.querySelector(".journey-box");
    if (!box) { return; }
    var spots = [[100,62,22],[72,76,17],[128,76,17],[100,88,19],[58,98,13],[142,98,13],[84,50,13],[116,50,13],[100,38,12]];
    var coins = [[100,60],[74,78],[126,78],[100,90],[60,99],[140,99],[84,50],[116,50],[100,38]];
    var leaves = spots.map(function (s, i) {
        return '<circle class="tl" data-i="' + i + '" cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="' + (i % 2 ? "#5DB38D" : "#4FA37F") + '"/>';
    }).join("");
    var gold = coins.map(function (c, i) {
        return '<circle class="tc" data-i="' + i + '" cx="' + c[0] + '" cy="' + c[1] + '" r="4.5" fill="#F3CC78" stroke="#C48E2C" stroke-width="1.3"/>';
    }).join("");
    var wrap = document.createElement("div");
    wrap.className = "live-tree";
    wrap.innerHTML =
        '<svg viewBox="0 0 200 190" role="img" aria-label="Your Finora tree">' +
        '<path d="M20 178 Q100 154 180 178 Z" fill="#7A5A3A"/><path d="M45 178 Q100 164 155 178 Z" fill="#8F6D49"/>' +
        '<ellipse class="tseed" cx="100" cy="170" rx="9" ry="6" fill="#D9A441"/>' +
        '<g class="ttrunk"><path d="M93 174C94 150 95 120 94 92H106C105 120 106 150 107 174Z" fill="#7A5A3A"/></g>' +
        '<g class="tcrown">' + leaves + gold + '</g></svg>' +
        '<div class="live-tree-text"><span class="tag">YOUR LIVING TREE</span><h3 id="treeStage"></h3><p id="treeMsg"></p></div>';
    box.insertBefore(wrap, box.firstChild);

    var stages = [
        ["A seed in the soil", "Try any tool and your tree will sprout."],
        ["A tiny sprout", "Great start. Every tool you try adds new leaves."],
        ["A growing sapling", "You are building real money skills. Keep going."],
        ["A strong young tree", "More than halfway there. Your branches are filling out."],
        ["A full, fruiting tree", "You tried every tool. Your tree is covered in gold coins."]
    ];
    function count() {
        try { var a = JSON.parse(localStorage.getItem("finoraJourney") || "[]"); return Array.isArray(a) ? Math.min(9, a.length) : 0; } catch (e) { return 0; }
    }
    function draw() {
        var n = count();
        var trunk = wrap.querySelector(".ttrunk"), seed = wrap.querySelector(".tseed");
        seed.style.opacity = n === 0 ? 1 : 0;
        trunk.style.transform = "scaleY(" + (n === 0 ? 0.02 : 0.3 + 0.7 * n / 9) + ")";
        Array.prototype.forEach.call(wrap.querySelectorAll(".tl"), function (el) {
            var on = +el.getAttribute("data-i") < n;
            el.style.transform = on ? "scale(1)" : "scale(0)";
        });
        Array.prototype.forEach.call(wrap.querySelectorAll(".tc"), function (el) {
            el.style.opacity = n === 9 ? 1 : 0;
        });
        var s = n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 8 ? 3 : 4;
        document.getElementById("treeStage").textContent = stages[s][0];
        document.getElementById("treeMsg").textContent = stages[s][1] + " (" + n + " of 9 tools tried)";
    }
    draw();
    var c = document.getElementById("journeyCount");
    if (c && "MutationObserver" in window) { new MutationObserver(draw).observe(c, { childList: true, characterData: true, subtree: true }); }
    window.addEventListener("storage", draw);
})();

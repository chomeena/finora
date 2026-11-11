/* =========================================
   FINORA - INTERACTIVE TOOLS
   Scheme Finder, Loan Readiness, EMI, Idea Matcher,
   Plan Builder, Pricing, Break-even, Record Book,
   Scam Spotter, checklists, tabs, journey badges.
   Everything runs in the browser. Nothing is sent anywhere.
========================================= */

(function () {
    "use strict";

    var $ = function (id) { return document.getElementById(id); };
    var fmt = function (n) { return "\u20B9" + Math.round(Number(n)).toLocaleString("en-IN"); };
    var esc = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    };
    var store = {
        get: function (k, fallback) {
            try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
        },
        set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
    };
    function num(id) { var v = parseFloat($(id).value); return isNaN(v) ? NaN : v; }
    function setErr(id, msg) { var el = $(id); if (el) el.textContent = msg; }

    /* ---------- Journey badges ---------- */
    var BADGES = [
        { id: "finder", icon: "fa-magnifying-glass-dollar", name: "Scheme Finder" },
        { id: "readiness", icon: "fa-clipboard-check", name: "Loan Readiness" },
        { id: "emi", icon: "fa-calculator", name: "EMI Calculator" },
        { id: "matcher", icon: "fa-lightbulb", name: "Idea Matcher" },
        { id: "plan", icon: "fa-file-lines", name: "Plan Builder" },
        { id: "pricing", icon: "fa-tags", name: "Pricing" },
        { id: "breakeven", icon: "fa-scale-balanced", name: "Break-Even" },
        { id: "recordbook", icon: "fa-book", name: "Record Book" },
        { id: "scam", icon: "fa-shield-halved", name: "Scam Spotter" }
    ];
    var earned = store.get("finoraJourney", []);

    function toast(msg) {
        var t = document.createElement("div");
        t.className = "toast";
        t.setAttribute("role", "status");
        t.innerHTML = '<i class="fa-solid fa-medal"></i> ' + esc(msg);
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add("show"); }, 20);
        setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 3200);
    }
    function renderBadges() {
        var grid = $("badgeGrid");
        if (!grid) return;
        grid.innerHTML = BADGES.map(function (b) {
            var on = earned.indexOf(b.id) !== -1;
            return '<div class="badge-item' + (on ? " earned" : "") + '"><i class="fa-solid ' + b.icon + '"></i><span>' + b.name + "</span><small>" + (on ? "Earned" : "Not yet") + "</small></div>";
        }).join("");
        var pct = Math.round((earned.length / BADGES.length) * 100);
        $("journeyCount").textContent = earned.length + " of " + BADGES.length + " tools tried";
        $("journeyPct").textContent = pct + "%";
        $("journeyFill").style.width = pct + "%";
    }
    function earn(id) {
        if (earned.indexOf(id) !== -1) return;
        earned.push(id);
        store.set("finoraJourney", earned);
        var b = BADGES.filter(function (x) { return x.id === id; })[0];
        if (b) toast("Badge earned: " + b.name);
        renderBadges();
    }
    renderBadges();

    /* ---------- Tabs ---------- */
    document.querySelectorAll(".tabs").forEach(function (tabs) {
        var scope = tabs.parentElement;
        tabs.querySelectorAll(".tab-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                tabs.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
                scope.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
                btn.classList.add("active");
                var panel = $(btn.getAttribute("data-tab"));
                if (panel) panel.classList.add("active");
            });
        });
    });

    /* ---------- Saved checklists ---------- */
    document.querySelectorAll(".cl-block").forEach(function (block) {
        var key = "finoraCL_" + block.getAttribute("data-checklist");
        var boxes = block.querySelectorAll('input[type="checkbox"]');
        var saved = store.get(key, []);
        boxes.forEach(function (b, i) { b.checked = saved.indexOf(i) !== -1; });
        function update(save) {
            var done = 0, ticked = [];
            boxes.forEach(function (b, i) {
                var item = b.closest(".check-item");
                if (b.checked) { done++; ticked.push(i); item.classList.add("checked"); } else { item.classList.remove("checked"); }
            });
            var pct = Math.round((done / boxes.length) * 100);
            block.querySelector(".cl-count").textContent = done + " of " + boxes.length + " done";
            block.querySelector(".cl-pct").textContent = pct + "%";
            block.querySelector(".cl-fill").style.width = pct + "%";
            if (save) store.set(key, ticked);
        }
        boxes.forEach(function (b) { b.addEventListener("change", function () { update(true); }); });
        update(false);
    });

    /* ---------- Support directory filter ---------- */
    var dirFilters = $("dirFilters");
    if (dirFilters) {
        dirFilters.addEventListener("click", function (e) {
            var btn = e.target.closest(".chip-btn");
            if (!btn) return;
            dirFilters.querySelectorAll(".chip-btn").forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            var f = btn.getAttribute("data-filter");
            document.querySelectorAll("#dirGrid .dir-card").forEach(function (c) {
                var tags = c.getAttribute("data-tags").split(" ");
                c.style.display = (f === "all" || tags.indexOf(f) !== -1) ? "" : "none";
            });
        });
    }

    /* ---------- Business Idea Matcher ---------- */
    var IDEAS = [
        { n: "Home-cooked tiffin and snacks", s: ["cooking"], h: 2, b: 0, why: "Steady demand from workers, students and busy families. Start with a few regular customers.", steps: ["Cook 3 dishes for 10 neighbours and collect feedback", "Take weekly pre-orders so nothing is wasted", "Check FSSAI food licence rules before you grow"] },
        { n: "Pickles, masalas and millet snacks", s: ["cooking", "farming"], h: 2, b: 0, why: "Long shelf life and good repeat sales. Works well through WhatsApp and local shops.", steps: ["Make small test batches and get taste feedback", "Design a clear label with ingredients and date", "Register for a food licence before selling widely"] },
        { n: "Baking cakes and custom desserts", s: ["cooking"], h: 2, b: 1, why: "Birthdays and festivals bring regular orders. Customised designs let you charge more.", steps: ["Photograph your best 5 cakes for a catalogue", "Take advance orders only", "Price using the Pricing Calculator"] },
        { n: "Tailoring, alterations and blouse stitching", s: ["stitching"], h: 2, b: 0, why: "Needed in every neighbourhood. Alterations bring quick, repeat income.", steps: ["Put up a simple rate card", "Offer pick-up and delivery", "Ask every happy customer for a referral"] },
        { n: "Boutique or small stitching unit", s: ["stitching", "organising"], h: 6, b: 2, why: "Growth step for experienced tailors: hire helpers and take bulk orders from shops.", steps: ["Get 2 to 3 written quotes for machines", "Register on Udyam", "Check PMEGP and Mudra for funding"] },
        { n: "Handmade jewellery and gifts", s: ["crafts"], h: 2, b: 0, why: "Low starting cost and good margins when designs are different. Sells well online and at fairs.", steps: ["Make a small collection of 10 pieces", "Take clear photos in daylight", "Try a WhatsApp catalogue and one local exhibition"] },
        { n: "Event decoration and gift hampers", s: ["crafts", "organising"], h: 3, b: 1, why: "Weddings and festivals create regular demand for custom decorations and hampers.", steps: ["Build a portfolio from small family events", "Partner with caterers and photographers", "Take advances to cover materials"] },
        { n: "Tuition and online coaching", s: ["teaching"], h: 1, b: 0, why: "Almost no investment. Reputation grows by word of mouth, and online classes widen your reach.", steps: ["Pick one subject and age group", "Run a free demo class", "Collect fees monthly in advance"] },
        { n: "Freelance writing, design or data work", s: ["computer"], h: 2, b: 0, why: "Work from home on your own schedule. You need a laptop, internet and a few sample pieces.", steps: ["Create 3 sample pieces", "Create a profile on a freelancing website", "Quote a fixed price per task"] },
        { n: "Social media and WhatsApp help for local shops", s: ["phone", "computer"], h: 2, b: 0, why: "Small shops need catalogues, posts and online listings but have no time. You can do it for a monthly fee.", steps: ["Offer one shop a free first month", "Set up their WhatsApp Business catalogue", "Show results and ask for referrals"] },
        { n: "Beauty and mehendi services at home", s: ["beauty"], h: 2, b: 1, why: "Strong demand around weddings and festivals. Trust and a good portfolio matter most.", steps: ["Collect photos of your best work", "Offer festival packages", "Keep hygiene and safety standards visible"] },
        { n: "Kitchen-garden vegetables and organic produce", s: ["farming"], h: 2, b: 0, why: "Fresh, chemical-free produce sold to nearby families through a weekly subscription.", steps: ["Start with 3 to 4 quick-growing vegetables", "Sign up 10 families for weekly boxes", "Keep a record of yield and sales"] },
        { n: "Small packed-food unit", s: ["cooking", "organising"], h: 6, b: 2, why: "Move from home cooking to a small unit with workers and shop supply.", steps: ["Get FSSAI licence and Udyam registration", "Compare quotes for equipment", "Check PMEGP, Mudra and credit guarantee options"] }
    ];
    var BUD = ["Low investment", "Medium investment", "Higher investment"];

    if ($("matcherForm")) {
        $("matcherForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var skills = Array.prototype.map.call($("matcherForm").querySelectorAll("#skillChips input:checked"), function (i) { return i.value; });
            var hours = parseInt($("matcherForm").querySelector('input[name="hours"]:checked').value, 10);
            var budget = parseInt($("matcherForm").querySelector('input[name="budget"]:checked').value, 10);
            setErr("matcherError", "");
            if (!skills.length) { setErr("matcherError", "Please pick at least one skill."); return; }
            var list = IDEAS.filter(function (i) {
                var overlap = i.s.filter(function (x) { return skills.indexOf(x) !== -1; }).length;
                i.score = overlap;
                return overlap > 0 && i.h <= hours && i.b <= budget;
            }).sort(function (a, b) { return b.score - a.score; });
            var box = $("matcherResults");
            if (!list.length) {
                box.innerHTML = '<div class="matcher-empty"><i class="fa-regular fa-face-meh"></i><p>No exact match. Try more skills, more hours or a bigger budget. Starting small is fine.</p></div>';
                return;
            }
            box.innerHTML = list.map(function (i) {
                return '<div class="idea-result"><h3>' + esc(i.n) + '</h3><span class="scheme-tag">' + BUD[i.b].toUpperCase() + '</span><p>' + esc(i.why) + '</p><strong>First steps</strong><ul>' +
                    i.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>";
            }).join("") + '<a class="btn btn-primary" href="#planbuilder">Build a plan for my idea <i class="fa-solid fa-arrow-right"></i></a>';
            earn("matcher");
        });
    }

    /* ---------- One-page plan builder ---------- */
    if ($("planForm")) {
        $("planForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var name = $("pbName").value.trim(), offer = $("pbOffer").value.trim(), cust = $("pbCustomers").value.trim();
            var price = num("pbPrice"), cost = num("pbCost"), own = num("pbOwn");
            var actions = $("pbActions").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 5);
            setErr("planError", "");
            if (!name || !offer || !cust) { setErr("planError", "Please fill in the business name, what you offer and who will buy."); return; }
            if (isNaN(cost) || cost < 0) { setErr("planError", "Please enter the money needed to start (0 if nothing)."); return; }
            if (isNaN(own) || own < 0) own = 0;
            var gap = Math.max(0, cost - own);
            var today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
            var funding = gap === 0
                ? "No outside funding needed. Your own money covers the start-up cost."
                : "Outside funding needed: <strong>" + fmt(gap) + "</strong>. Check <a href=\"schemes.html#finder\">matching schemes</a> and your <a href=\"schemes.html#readiness\">loan readiness</a>.";
            $("planOutput").innerHTML =
                '<h3>' + esc(name) + '</h3><p class="plan-date">One-page business plan &bull; ' + today + '</p>' +
                '<h4>What we offer</h4><p>' + esc(offer) + '</p>' +
                '<h4>Customers and why they choose us</h4><p>' + esc(cust) + '</p>' +
                '<h4>Price</h4><p>' + (isNaN(price) ? "To be decided" : fmt(price) + " per item or service") + '</p>' +
                '<h4>Money needed</h4><table class="plan-table"><tr><td>Total start-up cost</td><td>' + fmt(cost) + '</td></tr><tr><td>Own contribution</td><td>' + fmt(own) + '</td></tr><tr><td>Funding gap</td><td>' + fmt(gap) + '</td></tr></table><p class="plan-funding">' + funding + '</p>' +
                '<h4>First actions</h4>' + (actions.length ? "<ol>" + actions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol>" : "<p>Not added yet.</p>") +
                '<button type="button" class="btn btn-primary no-print" id="planPrint">Print or Save as PDF <i class="fa-solid fa-print"></i></button>';
            $("planPrint").addEventListener("click", function () {
                document.body.classList.add("printing-plan");
                window.print();
            });
            earn("plan");
        });
        window.addEventListener("afterprint", function () { document.body.classList.remove("printing-plan"); });
    }

    /* ---------- Scheme Finder ---------- */
    var SCHEMES = {
        mudra: { name: "PM Mudra Yojana", link: "https://www.mudra.org.in/", why: "Collateral-free loans up to \u20B920 lakh for small and micro businesses, new or existing.", next: ["Choose a bank, NBFC or microfinance lender", "Take your plan, KYC documents and 6 months of bank statements"] },
        standup: { name: "Stand-Up India (revamped)", link: "https://www.standupmitra.in/", why: "Bank loans for first-time women and SC/ST entrepreneurs starting a new business. The original scheme ended in March 2025 and a revamp with higher limits has been announced, so check the portal for the latest rules.", next: ["Check current eligibility on the portal", "Visit your bank with a project report"] },
        pmegp: { name: "PMEGP", link: "https://www.kviconline.gov.in/pmegpeportal/", why: "Credit-linked subsidy for setting up a NEW micro enterprise, with a higher subsidy rate for women and for rural areas.", next: ["Apply online on the PMEGP e-portal", "Prepare a project report and complete the training if asked"] },
        cgtmse: { name: "Credit guarantee (CGTMSE)", link: "https://www.cgtmse.in/", why: "Guarantee cover that lets banks lend to micro and small enterprises without collateral. Ask your bank if your loan can be covered.", next: ["Ask the bank officer about guarantee cover for your loan"] },
        nrlm: { name: "Self-help groups and Lakhpati Didi (DAY-NRLM)", link: "https://aajeevika.gov.in/", why: "Rural women in self-help groups get savings habits, group loans, training and market links to build a sustainable income.", next: ["Contact your local SHG or block mission office", "Ask about skill training and group credit"] },
        tread: { name: "TREAD", link: "https://msme.gov.in/", why: "Training and credit-linked support for women entrepreneurs, usually through NGOs and institutions.", next: ["Ask the MSME Development Institute near you about current TREAD programmes"] },
        dcmsme: { name: "MSME training institutes", link: "https://www.dcmsme.gov.in/", why: "Government institutes offering entrepreneurship and skill programmes for small businesses.", next: ["Find the nearest MSME Development Institute and ask for the next batch"] },
        wep: { name: "Women Entrepreneurship Platform (NITI Aayog)", link: "https://wep.gov.in/", why: "Mentorship, incubation, funding access and compliance help for women entrepreneurs, all in one place.", next: ["Create a free profile and explore the programmes"] },
        ssy: { name: "Sukanya Samriddhi Yojana", link: "https://www.indiapost.gov.in/", why: "Government-backed savings for a girl child, opened before she turns ten. The interest rate is set by the government every quarter.", next: ["Open the account at a post office or authorised bank", "Take the child's birth certificate and guardian's ID"] },
        udyam: { name: "Udyam Registration (do this first)", link: "https://udyamregistration.gov.in/", why: "Free registration that many schemes and banks ask for.", next: ["Register online with your Aadhaar"] }
    };
    var FQ = [
        { id: "where", q: "Where is your business, or where will it be?", o: [["rural", "In a village or rural area"], ["urban", "In a town or city"]] },
        { id: "stage", q: "Where are you in your journey?", o: [["idea", "I have an idea, not started yet"], ["new", "Started in the last 2 years"], ["running", "Running for more than 2 years"]] },
        { id: "need", q: "What do you need most?", o: [["loan", "A loan"], ["subsidy", "A subsidy"], ["training", "Training and skills"], ["savings", "Safe savings for my daughter"]] },
        { id: "shg", q: "Are you part of a self-help group (SHG)?", o: [["yes", "Yes"], ["no", "No"]] },
        { id: "scst", q: "Do you belong to the SC or ST category?", o: [["yes", "Yes"], ["no", "No"], ["skip", "Prefer not to say"]] },
        { id: "size", q: "How big a loan are you thinking about?", o: [["small", "Up to \u20B910 lakh"], ["large", "More than \u20B910 lakh"]], only: function (a) { return a.need === "loan"; } }
    ];
    function finderMatch(a) {
        var out = [], add = function (k) { if (out.indexOf(k) === -1) out.push(k); };
        var isNew = a.stage !== "running";
        if (a.need === "savings") { add("ssy"); return out; }
        if (a.need === "training") { add("tread"); add("dcmsme"); add("wep"); if (a.shg === "yes" || a.where === "rural") add("nrlm"); return out; }
        if (a.need === "loan") {
            add("mudra");
            if (isNew && (a.size === "large" || a.scst === "yes")) add("standup");
            if (isNew) add("pmegp");
            add("cgtmse");
        }
        if (a.need === "subsidy") {
            if (isNew) add("pmegp");
            if (a.shg === "yes" || a.where === "rural") add("nrlm");
            add("wep");
        }
        if (a.shg === "yes" && a.where === "rural") add("nrlm");
        add("udyam");
        return out;
    }
    if ($("finderWizard")) {
        var ans = {}, step = 0, path = [];
        var active = function () { return FQ.filter(function (q) { return !q.only || q.only(ans); }); };
        function renderQ() {
            var qs = active();
            $("finderResults").hidden = true;
            $("finderQ").hidden = false; $("finderOptions").hidden = false;
            if (step >= qs.length) { showResults(); return; }
            var q = qs[step];
            $("finderStep").textContent = "Question " + (step + 1);
            $("finderPct").textContent = "";
            $("finderBar").style.width = Math.round((step / qs.length) * 100) + "%";
            $("finderQ").textContent = q.q;
            $("finderOptions").innerHTML = q.o.map(function (o) { return '<button type="button" class="option-btn" data-v="' + o[0] + '">' + esc(o[1]) + "</button>"; }).join("");
            $("finderBack").style.visibility = step === 0 ? "hidden" : "visible";
        }
        function showResults() {
            $("finderBar").style.width = "100%";
            $("finderStep").textContent = "Your matches";
            $("finderQ").hidden = true; $("finderOptions").hidden = true;
            var keys = finderMatch(ans);
            var html = keys.map(function (k) {
                var s = SCHEMES[k];
                return '<div class="result-card"><h3>' + esc(s.name) + "</h3><p>" + esc(s.why) + "</p><strong>Next steps</strong><ul>" + s.next.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + '</ul><a href="' + s.link + '" target="_blank" rel="noopener noreferrer">Official website <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>';
            }).join("");
            if (ans.need === "subsidy" && ans.stage === "running") html = '<p class="scheme-note"><i class="fa-solid fa-circle-info"></i>PMEGP is only for new units, so it is not shown for a business already running more than 2 years. Ask your bank about Mudra and guarantee cover for expansion.</p>' + html;
            html += '<div class="result-actions"><a class="btn btn-primary" href="#readiness">Check my loan readiness <i class="fa-solid fa-arrow-right"></i></a><button type="button" class="btn btn-outline-dark" id="finderRestart">Start Again <i class="fa-solid fa-rotate-left"></i></button></div>';
            $("finderResults").innerHTML = html;
            $("finderResults").hidden = false;
            $("finderRestart").addEventListener("click", function () { ans = {}; step = 0; renderQ(); });
            earn("finder");
        }
        $("finderOptions").addEventListener("click", function (e) {
            var b = e.target.closest(".option-btn");
            if (!b) return;
            ans[active()[step].id] = b.getAttribute("data-v");
            step++;
            renderQ();
        });
        $("finderBack").addEventListener("click", function () { if (step > 0) { step--; renderQ(); } });
        renderQ();
    }

    /* ---------- Loan readiness ---------- */
    var FIX = {
        bank: "Open a savings account in your own name and run your business money through it. Banks like to see 6 months of statements.",
        udyam: "Register free on the Udyam portal with your Aadhaar. Many schemes ask for the certificate.",
        plan: "Write a one-page plan using the Plan Builder on the Women Entrepreneur page.",
        records: "Start the Money Record Book today. Three months of records shows a lender your sales are real.",
        amount: "Get 2 to 3 written quotations from suppliers so you can ask for an exact amount.",
        credit: "Pay all bills and EMIs on time, and get your free credit report to check for mistakes.",
        kyc: "Collect Aadhaar, PAN and address proof, and make sure your mobile number is linked to your Aadhaar.",
        own: "Banks usually expect a small contribution from you. Start saving towards it, even a little each month."
    };
    if ($("readyForm")) {
        $("readyForm").addEventListener("submit", function (e) {
            e.preventDefault();
            setErr("readyError", "");
            var keys = Object.keys(FIX), score = 0, missing = [];
            for (var i = 0; i < keys.length; i++) {
                var c = $("readyForm").querySelector('input[name="' + keys[i] + '"]:checked');
                if (!c) { setErr("readyError", "Please answer all 8 questions."); return; }
                if (c.value === "1") score++; else missing.push(keys[i]);
            }
            var level = score >= 7 ? ["Loan-ready", "You have most of what lenders look for. Pick a scheme and apply."] : score >= 4 ? ["Almost there", "Fix the items below first and your application will be much stronger."] : ["Build your base first", "You do not need to give up. Work through the list below, one item at a time."];
            var html = '<div class="ready-score"><strong>' + score + ' / 8</strong><div><h3>' + level[0] + "</h3><p>" + level[1] + "</p></div></div>";
            if (missing.length) html += "<h4>Fix these first</h4><ul>" + missing.map(function (k) { return "<li>" + esc(FIX[k]) + "</li>"; }).join("") + "</ul>";
            html += '<a class="btn btn-primary" href="#finder">Find my scheme <i class="fa-solid fa-arrow-right"></i></a>';
            $("readyResult").innerHTML = html;
            $("readyResult").hidden = false;
            earn("readiness");
        });
        $("readyForm").addEventListener("reset", function () { $("readyResult").hidden = true; setErr("readyError", ""); });
    }

    /* ---------- EMI calculator ---------- */
    if ($("emiForm")) {
        $("emiForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var P = num("emiAmount"), rate = num("emiRate"), yrs = num("emiYears"), profit = num("emiProfit");
            setErr("emiError", "");
            if (isNaN(P) || P <= 0 || isNaN(rate) || rate < 0 || isNaN(yrs) || yrs <= 0) { setErr("emiError", "Please enter a loan amount, interest rate and period."); return; }
            var n = Math.max(1, Math.round(yrs * 12)), r = rate / 12 / 100;
            var emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            var total = emi * n, interest = total - P;
            $("emiMain").textContent = fmt(emi) + " a month";
            var s = "You repay " + fmt(total) + " in total over " + n + " months, of which " + fmt(interest) + " is interest.";
            if (!isNaN(profit) && profit > 0) {
                var share = (emi / profit) * 100;
                s += " The EMI is " + Math.round(share) + "% of your monthly profit. " + (share <= 30 ? "That looks comfortable." : share <= 40 ? "That is on the high side, so be careful." : "That is risky. Consider a smaller loan or a longer period.");
            }
            $("emiSub").textContent = s;
            earn("emi");
        });
        $("emiForm").addEventListener("reset", function () { setErr("emiError", ""); $("emiMain").textContent = "Enter the loan details to see the result."; $("emiSub").textContent = ""; });
    }

    /* ---------- Pricing calculator ---------- */
    if ($("priceForm")) {
        $("priceForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var mat = num("prMaterial"), oth = num("prOther") || 0, min = num("prMinutes") || 0, hr = num("prHourly") || 0, mar = num("prMargin"), units = num("prUnits");
            setErr("priceError", "");
            if (isNaN(mat) || mat < 0 || isNaN(mar) || mar < 0) { setErr("priceError", "Please enter the material cost and your profit margin."); return; }
            var time = (min / 60) * hr, cost = mat + oth + time, price = cost * (1 + mar / 100), profit = price - cost;
            $("priceMain").textContent = fmt(Math.ceil(price)) + " per item";
            var s = "Your cost is " + fmt(cost) + " per item, including " + fmt(time) + " for your time. That leaves about " + fmt(profit) + " profit on each item.";
            if (!isNaN(units) && units > 0) s += " Selling " + units + " items a month brings about " + fmt(units * price) + ", of which " + fmt(units * time) + " pays your time and " + fmt(units * profit) + " is business profit.";
            $("priceSub").textContent = s;
            earn("pricing");
        });
        $("priceForm").addEventListener("reset", function () { setErr("priceError", ""); $("priceMain").textContent = "Enter your costs to see the result."; $("priceSub").textContent = ""; });
    }

    /* ---------- Break-even ---------- */
    if ($("beForm")) {
        $("beForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var fixed = num("beFixed"), price = num("bePrice"), vc = num("beVar"), target = num("beTarget") || 0;
            setErr("beError", "");
            if (isNaN(fixed) || fixed < 0 || isNaN(price) || price <= 0 || isNaN(vc) || vc < 0) { setErr("beError", "Please enter fixed costs, selling price and cost per item."); return; }
            var cm = price - vc;
            if (cm <= 0) { $("beMain").textContent = "You lose money on every sale"; $("beSub").textContent = "Your cost per item is higher than or equal to your selling price. Raise the price or lower the cost first."; return; }
            var units = Math.ceil((fixed + target) / cm);
            $("beMain").textContent = units + " items a month";
            var s = "You need to sell about " + units + " items (" + fmt(units * price) + " in sales) each month to cover your costs" + (target > 0 ? " and earn " + fmt(target) + " profit" : "") + ". That is about " + Math.ceil(units / 26) + " items per working day. Each sale adds " + fmt(cm) + " towards your costs.";
            $("beSub").textContent = s;
            earn("breakeven");
        });
        $("beForm").addEventListener("reset", function () { setErr("beError", ""); $("beMain").textContent = "Enter your numbers to see the result."; $("beSub").textContent = ""; });
    }

    /* ---------- Money record book ---------- */
    if ($("rbForm")) {
        var KEY = "finoraRecords", recs = store.get(KEY, []);
        var today = function () { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
        $("rbDate").value = today();
        function renderRB() {
            var ym = today().slice(0, 7), inc = 0, exp = 0;
            recs.forEach(function (r) { if (r.date.slice(0, 7) === ym) { if (r.type === "income") inc += r.amount; else exp += r.amount; } });
            $("rbIncome").textContent = fmt(inc); $("rbExpense").textContent = fmt(exp);
            $("rbProfit").textContent = (inc - exp < 0 ? "-" : "") + fmt(Math.abs(inc - exp));
            $("rbProfit").className = inc - exp < 0 ? "neg" : "pos";
            var rows = recs.slice().sort(function (a, b) { return b.date.localeCompare(a.date) || b.id - a.id; }).slice(0, 30);
            $("rbBody").innerHTML = rows.length ? rows.map(function (r) {
                return "<tr><td>" + esc(r.date) + "</td><td>" + esc(r.note || "-") + '</td><td class="' + (r.type === "income" ? "pos" : "neg") + '">' + (r.type === "income" ? "+" : "-") + fmt(r.amount) + '</td><td><button type="button" class="rb-del" data-id="' + r.id + '" aria-label="Delete entry"><i class="fa-solid fa-xmark"></i></button></td></tr>';
            }).join("") : '<tr><td colspan="4" class="rb-empty">No entries yet. Add your first sale or expense.</td></tr>';
        }
        $("rbForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var amt = num("rbAmount"), date = $("rbDate").value;
            setErr("rbError", "");
            if (isNaN(amt) || amt <= 0) { setErr("rbError", "Please enter an amount greater than 0."); return; }
            if (!date) { setErr("rbError", "Please choose a date."); return; }
            recs.push({ id: Date.now(), date: date, type: $("rbType").value, amount: amt, note: $("rbNote").value.trim() });
            store.set(KEY, recs);
            $("rbAmount").value = ""; $("rbNote").value = "";
            renderRB();
            earn("recordbook");
        });
        $("rbBody").addEventListener("click", function (e) {
            var b = e.target.closest(".rb-del");
            if (!b) return;
            var id = parseInt(b.getAttribute("data-id"), 10);
            recs = recs.filter(function (r) { return r.id !== id; });
            store.set(KEY, recs); renderRB();
        });
        $("rbClear").addEventListener("click", function () {
            if (recs.length && window.confirm("Delete all entries from this device? This cannot be undone.")) { recs = []; store.set(KEY, recs); renderRB(); }
        });
        $("rbExport").addEventListener("click", function () {
            if (!recs.length) { setErr("rbError", "Nothing to download yet."); return; }
            var csv = "Date,Type,Amount,Note\n" + recs.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).map(function (r) {
                return [r.date, r.type, r.amount, '"' + String(r.note || "").replace(/"/g, '""') + '"'].join(",");
            }).join("\n");
            var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob); a.download = "finora-records.csv";
            document.body.appendChild(a); a.click(); a.remove();
        });
        renderRB();
    }

    /* ---------- Scam Spotter ---------- */
    var SC = [
        { from: "SMS from 'SBI-ALERT'", t: "Your account will be blocked today. Update your KYC now: bit.ly/sbi-kyc-update", a: "scam", why: "Banks do not block accounts through links in messages. Shortened links hide the real website. Contact your bank using the number on your passbook or card." },
        { from: "UPI notification", t: "'Cashback Rewards' has sent you a collect request of \u20B92,000. Approve to receive your reward.", a: "scam", why: "You never need to approve or enter a PIN to RECEIVE money. A collect request takes money out of your account." },
        { from: "Customer on WhatsApp", t: "I will pay \u20B93,000 for the order. Please scan this QR code I am sending, so the money reaches you.", a: "scam", why: "Scanning a QR code asks for your PIN to SEND money. Give the customer your own QR code and let them scan it." },
        { from: "'Loan agent' on phone", t: "I can get your Mudra loan approved today. Just pay \u20B95,000 processing fee to me first. Guaranteed.", a: "scam", why: "Nobody can guarantee approval. Apply directly at the bank or official portal, and do not pay fees to individuals." },
        { from: "Your UPI app", t: "You received \u20B9800 from Lakshmi Stores. Balance: \u20B912,450. (You see the same credit in your bank passbook app.)", a: "safe", why: "This is a credit shown inside your own app. Always confirm payments inside your own bank or UPI app, not from screenshots." },
        { from: "Call from 'bank customer care'", t: "We noticed suspicious activity. To stop the fraud, please tell me the OTP you just received.", a: "scam", why: "Real bank staff never ask for your OTP, PIN or password. Hang up and call the bank yourself." },
        { from: "Website: pm-women-loan-apply.in", t: "100% subsidy for women! Register with \u20B9499 and get \u20B92 lakh in your account in 3 days.", a: "scam", why: "Official government sites end in .gov.in or .nic.in. Real schemes do not promise full subsidy for a small fee." },
        { from: "Customer on WhatsApp", t: "Payment done! Here is the screenshot. Please send the parcel now.", a: "scam", why: "Screenshots are easy to fake. Check that the money has actually reached your own bank or UPI app before you send the goods." }
    ];
    if ($("scamGame")) {
        var si = 0, sc = 0, locked = false;
        function renderS() {
            if (si >= SC.length) { finishS(); return; }
            var s = SC[si];
            $("scamStep").textContent = "Situation " + (si + 1) + " of " + SC.length;
            $("scamScore").textContent = "Score: " + sc;
            $("scamBar").style.width = Math.round((si / SC.length) * 100) + "%";
            $("scamCard").innerHTML = '<div class="scam-from"><i class="fa-regular fa-message"></i> ' + esc(s.from) + '</div><p>' + esc(s.t) + "</p>";
            $("scamFeedback").hidden = true; $("scamActions").hidden = false; locked = false;
        }
        function finishS() {
            $("scamBar").style.width = "100%";
            $("scamActions").hidden = true; $("scamFeedback").hidden = true; $("scamCard").innerHTML = "";
            var msg = sc >= 7 ? "Excellent! You have sharp eyes. Share these tips with other women." : sc >= 5 ? "Good work. Read the explanations again for the ones you missed." : "Do not worry. Scammers fool many people. Replay and remember: never share OTP or PIN, and never approve a request to receive money.";
            $("scamFinal").innerHTML = "<h3>You scored " + sc + " out of " + SC.length + "</h3><p>" + msg + '</p><button type="button" class="btn btn-primary" id="scamAgain">Play Again <i class="fa-solid fa-rotate-left"></i></button>';
            $("scamFinal").hidden = false;
            $("scamAgain").addEventListener("click", function () { si = 0; sc = 0; $("scamFinal").hidden = true; renderS(); });
            earn("scam");
        }
        $("scamActions").addEventListener("click", function (e) {
            var b = e.target.closest("[data-answer]");
            if (!b || locked) return;
            locked = true;
            var s = SC[si], ok = b.getAttribute("data-answer") === s.a;
            if (ok) sc++;
            $("scamScore").textContent = "Score: " + sc;
            var fb = $("scamFeedback");
            fb.className = "scam-feedback " + (ok ? "right" : "wrong");
            fb.innerHTML = "<strong>" + (ok ? "Correct! " : "Not quite. ") + "This is " + (s.a === "scam" ? "a scam." : "safe.") + "</strong> " + esc(s.why) + '<br><button type="button" class="btn btn-primary" id="scamNext">' + (si === SC.length - 1 ? "See My Score" : "Next Situation") + ' <i class="fa-solid fa-arrow-right"></i></button>';
            fb.hidden = false;
            $("scamNext").addEventListener("click", function () { si++; renderS(); });
        });
        renderS();
    }
})();

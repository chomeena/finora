/* =========================================
   FINORA - HOME PAGE JAVASCRIPT
========================================= */


/* =========================================
   1. MOBILE NAVIGATION MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }

    });


    // Close menu after clicking a navigation link

    const navigationItems = navLinks.querySelectorAll("a");

    navigationItems.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    });


    // Close menu when clicking outside

    document.addEventListener("click", function (event) {

        if (
            !menuToggle.contains(event.target) &&
            !navLinks.contains(event.target)
        ) {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    });


    // Close menu using Escape key

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    });

}


/* =========================================
   2. INSPIRING WOMEN CAROUSEL
========================================= */

const storyCarousel = document.getElementById("storyCarousel");

const prevStory = document.getElementById("prevStory");

const nextStory = document.getElementById("nextStory");


if (storyCarousel && prevStory && nextStory) {

    const storyCards = storyCarousel.querySelectorAll(".story-card");

    let currentStory = 0;

    let autoSlide;


    // Carousel layout

    storyCarousel.style.display = "flex";

    storyCarousel.style.overflow = "hidden";

    storyCarousel.style.scrollBehavior = "smooth";

    storyCarousel.style.gap = "25px";


    storyCards.forEach(function (card) {

        card.style.flex = "0 0 100%";

        card.style.minWidth = "0";

    });


    // Display selected story

    function showStory(index) {

        currentStory = index;

        storyCarousel.scrollTo({

            left: currentStory * (
                storyCarousel.clientWidth + 25
            ),

            behavior: "smooth"

        });

    }


    // Next story

    nextStory.addEventListener("click", function () {

        currentStory++;

        if (currentStory >= storyCards.length) {

            currentStory = 0;

        }

        showStory(currentStory);

        restartAutoSlide();

    });


    // Previous story

    prevStory.addEventListener("click", function () {

        currentStory--;

        if (currentStory < 0) {

            currentStory = storyCards.length - 1;

        }

        showStory(currentStory);

        restartAutoSlide();

    });


    // Automatic carousel movement

    function startAutoSlide() {

        if (storyCards.length > 1) {

            autoSlide = setInterval(function () {

                currentStory++;

                if (currentStory >= storyCards.length) {

                    currentStory = 0;

                }

                showStory(currentStory);

            }, 5000);

        }

    }


    // Restart automatic movement after button click

    function restartAutoSlide() {

        clearInterval(autoSlide);

        startAutoSlide();

    }


    // Pause carousel when mouse enters

    storyCarousel.addEventListener("mouseenter", function () {

        clearInterval(autoSlide);

    });


    // Resume carousel when mouse leaves

    storyCarousel.addEventListener("mouseleave", function () {

        startAutoSlide();

    });


    // Start carousel

    startAutoSlide();


    // Adjust carousel when window is resized

    window.addEventListener("resize", function () {

        showStory(currentStory);

    });

}


/* =========================================
   3. SMOOTH SCROLLING
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {

            event.preventDefault();

            targetElement.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    });

});


/* =========================================
   4. NAVIGATION ACTIVE STATE
========================================= */

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a").forEach(function (link) {

    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {

        link.classList.add("active");

    } else {

        link.classList.remove("active");

    }

});


/* =========================================
   5. FOOTER CURRENT YEAR
========================================= */

const footerYear = document.querySelector(".footer-bottom p");

if (footerYear) {

    footerYear.innerHTML =
        "&copy; " + new Date().getFullYear() +
        " Finora. All Rights Reserved.";

}


/* =========================================
   FINORA HOME PAGE INITIALIZED
========================================= */

console.log("FINORA Home Page loaded successfully!");
/* =====================================
   PAGE 2 - FINANCIAL AWARENESS QUIZ
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const quizForm = document.getElementById("financeQuiz");
    const quizResult = document.getElementById("quizResult");
    const scoreText = document.getElementById("scoreText");
    const resultMessage = document.getElementById("resultMessage");

    // Run only on the Financial Awareness page
    if (quizForm) {

        // Correct answers
        const answers = {
            q1: "b",
            q2: "c",
            q3: "a",
            q4: "b",
            q5: "c"
        };

        // Submit quiz
        quizForm.addEventListener("submit", function (event) {

            event.preventDefault();

            let score = 0;
            let total = Object.keys(answers).length;

            // Check answers
            for (let question in answers) {

                const selected = quizForm.querySelector(
                    `input[name="${question}"]:checked`
                );

                if (!selected) {
                    alert("Please answer all questions!");
                    return;
                }

                if (selected.value === answers[question]) {
                    score++;
                }
            }

            // Display result
            quizResult.style.display = "block";
            scoreText.textContent = `Your Score: ${score} / ${total}`;

            if (score === 5) {
                resultMessage.textContent =
                    "Excellent! You have great financial knowledge!";
            }
            else if (score >= 3) {
                resultMessage.textContent =
                    "Good job! Keep learning about financial awareness.";
            }
            else {
                resultMessage.textContent =
                    "Keep practising! You can improve your financial knowledge.";
            }

            // Explanations for every question
            const explanations = {
                q1: "Saving prepares you for future needs and unexpected expenses.",
                q2: "EMI stands for Equated Monthly Instalment: a fixed monthly loan payment.",
                q3: "Never share your OTP or PIN. Banks and genuine services never ask for them.",
                q4: "A budget plans your income and expenses so you can save on purpose.",
                q5: "An emergency fund is money kept aside for unexpected expenses."
            };

            const oldList = quizResult.querySelector(".quiz-explain");
            if (oldList) oldList.remove();

            const list = document.createElement("ul");
            list.className = "quiz-explain";

            let number = 1;

            for (let question in answers) {

                const chosen = quizForm.querySelector(
                    `input[name="${question}"]:checked`
                );

                const correct = chosen && chosen.value === answers[question];

                const item = document.createElement("li");
                item.className = correct ? "right" : "wrong";
                item.innerHTML =
                    "<strong>Q" + number + (correct ? " correct." : " review this.") +
                    "</strong> " + explanations[question];

                list.appendChild(item);
                number++;
            }

            quizResult.appendChild(list);

            // Scroll to result
            quizResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });

        // Reset quiz
        quizForm.addEventListener("reset", function () {

            quizResult.style.display = "none";
            const staleList = quizResult.querySelector(".quiz-explain");
            if (staleList) staleList.remove();
            scoreText.textContent = "";
            resultMessage.textContent = "";

        });
    }

});
/* =====================================
   PAGE 3 - WOMEN ENTREPRENEURS
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Smooth scrolling for business ideas button
    const exploreButton = document.querySelector(
        '.entrepreneur-hero a[href="#business-ideas"]'
    );

    if (exploreButton) {
        exploreButton.addEventListener("click", function (event) {
            event.preventDefault();

            document.getElementById("business-ideas")
                .scrollIntoView({
                    behavior: "smooth"
                });
        });
    }

    // Business idea card hover interaction
    const businessCards = document.querySelectorAll(
        ".business-idea-card"
    );

    businessCards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {
            card.style.transform = "translateY(-8px)";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "translateY(0)";
        });

    });

    // Inspirational story interaction
    const storyCards = document.querySelectorAll(
        ".entrepreneur-story-card"
    );

    storyCards.forEach(function (card) {

        card.addEventListener("click", function () {

            card.classList.toggle("story-expanded");

        });

    });

});
/* =========================================
   FINORA - MEMBER 2 JAVASCRIPT
   Pages: schemes.html, planning.html
   Load AFTER member1.js. The mobile menu,
   smooth scrolling, active nav link and footer
   year are already handled by member1.js.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. SCHEME ENQUIRY FORM (schemes.html)
    ========================================= */

    const schemeForm = document.getElementById("schemeForm");

    if (schemeForm) {

        const fields = {
            name: {
                input: document.getElementById("enqName"),
                error: document.getElementById("nameError")
            },
            email: {
                input: document.getElementById("enqEmail"),
                error: document.getElementById("emailError")
            },
            type: {
                input: document.getElementById("enqType"),
                error: document.getElementById("typeError")
            },
            message: {
                input: document.getElementById("enqMessage"),
                error: document.getElementById("messageError")
            }
        };

        const formSuccess = document.getElementById("formSuccess");
        const successText = document.getElementById("successText");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        function setError(field, message) {
            field.error.textContent = message;
            field.input.parentElement.classList.add("invalid");
        }

        function clearError(field) {
            field.error.textContent = "";
            field.input.parentElement.classList.remove("invalid");
        }

        // Returns an error message, or "" when the value is valid
        function validate(key) {

            const value = fields[key].input.value.trim();

            if (key === "name") {
                if (value === "") return "Please enter your name.";
                if (value.length < 2) return "Name must be at least 2 characters.";
                if (!/^[A-Za-z\s.'-]+$/.test(value)) return "Name can contain only letters and spaces.";
            }

            if (key === "email") {
                if (value === "") return "Please enter your email address.";
                if (!emailPattern.test(value)) return "Please enter a valid email address.";
            }

            if (key === "type") {
                if (value === "") return "Please select a type of assistance.";
            }

            if (key === "message") {
                if (value === "") return "Please write your message.";
                if (value.length < 10) return "Message must be at least 10 characters.";
            }

            return "";
        }

        // Live validation: check a field when the user leaves it,
        // and clear its error as soon as they fix it
        Object.keys(fields).forEach(function (key) {

            const input = fields[key].input;
            const eventName = key === "type" ? "change" : "blur";

            input.addEventListener(eventName, function () {
                const message = validate(key);
                if (message) {
                    setError(fields[key], message);
                } else {
                    clearError(fields[key]);
                }
            });

            input.addEventListener("input", function () {
                if (input.parentElement.classList.contains("invalid") && !validate(key)) {
                    clearError(fields[key]);
                }
            });

        });

        schemeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            formSuccess.hidden = true;

            let firstInvalid = null;

            Object.keys(fields).forEach(function (key) {

                const message = validate(key);

                if (message) {
                    setError(fields[key], message);
                    if (!firstInvalid) firstInvalid = fields[key].input;
                } else {
                    clearError(fields[key]);
                }

            });

            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            const firstName = fields.name.input.value.trim().split(" ")[0];

            successText.textContent =
                "Thank you, " + firstName + "! Your question has been noted. " +
                "This website does not send messages yet, so for a reply please " +
                "use the official portals below or visit your nearest bank branch.";

            formSuccess.hidden = false;

            schemeForm.reset();

            formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });

        });

        schemeForm.addEventListener("reset", function () {

            Object.keys(fields).forEach(function (key) {
                clearError(fields[key]);
            });

            formSuccess.hidden = true;

        });
    }


    /* =========================================
       2. PLANNING CHECKLIST (planning.html)
    ========================================= */

    const checklist = document.getElementById("planChecklist");

    if (checklist) {

        const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
        const checkCount = document.getElementById("checkCount");
        const checkPercent = document.getElementById("checkPercent");
        const progressFill = document.getElementById("progressFill");
        const checklistDone = document.getElementById("checklistDone");

        const STORAGE_KEY = "finoraChecklist";

        // Restore saved ticks (storage may be blocked, so always try/catch)
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            checkboxes.forEach(function (box, index) {
                box.checked = saved.indexOf(index) !== -1;
            });
        } catch (error) {
            // Ignore: checklist simply starts empty
        }

        function saveChecklist() {
            try {
                const ticked = [];
                checkboxes.forEach(function (box, index) {
                    if (box.checked) ticked.push(index);
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ticked));
            } catch (error) {
                // Ignore: progress just will not be remembered
            }
        }

        function updateChecklist() {

            const total = checkboxes.length;
            let done = 0;

            checkboxes.forEach(function (box) {

                const item = box.closest(".check-item");

                if (box.checked) {
                    done++;
                    item.classList.add("checked");
                } else {
                    item.classList.remove("checked");
                }

            });

            const percent = Math.round((done / total) * 100);

            checkCount.textContent = done + " of " + total + " completed";
            checkPercent.textContent = percent + "%";
            progressFill.style.width = percent + "%";
            checklistDone.hidden = done !== total;

        }

        checkboxes.forEach(function (box) {
            box.addEventListener("change", function () {
                updateChecklist();
                saveChecklist();
            });
        });

        updateChecklist();
    }


    /* =========================================
       Shared helpers for the calculators
    ========================================= */

    // Indian number format, e.g. 1,00,000
    function formatRupees(amount) {
        return "\u20B9" + Math.round(Number(amount)).toLocaleString("en-IN");
    }

    function plural(count, word) {
        return count + " " + word + (count === 1 ? "" : "s");
    }

    function showFieldError(input, errorEl, message) {
        errorEl.textContent = message;
        input.parentElement.classList.add("invalid");
    }

    function clearFieldError(input, errorEl) {
        errorEl.textContent = "";
        input.parentElement.classList.remove("invalid");
    }

    function timeText(totalMonths) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        if (years === 0) return plural(months, "month");
        if (months === 0) return plural(years, "year");
        return plural(years, "year") + " " + plural(months, "month");
    }


    /* =========================================
       3. SAVINGS GOAL ESTIMATOR (planning.html)
    ========================================= */

    const savingsForm = document.getElementById("savingsForm");

    if (savingsForm) {

        const goalInput = document.getElementById("goalAmount");
        const monthlyInput = document.getElementById("monthlySaving");
        const interestInput = document.getElementById("interestRate");
        const goalError = document.getElementById("goalError");
        const monthlyError = document.getElementById("monthlyError");
        const interestError = document.getElementById("interestError");
        const resultBox = document.getElementById("estimatorResult");
        const resultMain = document.getElementById("resultMain");
        const resultSub = document.getElementById("resultSub");

        const defaultMessage = "Enter your goal and monthly saving to see the result.";

        function clearAll() {
            clearFieldError(goalInput, goalError);
            clearFieldError(monthlyInput, monthlyError);
            clearFieldError(interestInput, interestError);
        }

        function resetResult() {
            resultBox.classList.remove("has-result");
            resultMain.textContent = defaultMessage;
            resultSub.textContent = "";
        }

        [goalInput, monthlyInput, interestInput].forEach(function (input) {
            input.addEventListener("input", clearAll);
        });

        savingsForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const goal = parseFloat(goalInput.value);
            const monthly = parseFloat(monthlyInput.value);
            const rateText = interestInput.value.trim();
            const rate = rateText === "" ? 0 : parseFloat(rateText);

            let valid = true;

            clearAll();

            if (isNaN(goal) || goal <= 0) {
                showFieldError(goalInput, goalError, "Please enter a goal amount greater than 0.");
                valid = false;
            }

            if (isNaN(monthly) || monthly <= 0) {
                showFieldError(monthlyInput, monthlyError, "Please enter a monthly saving greater than 0.");
                valid = false;
            }

            if (isNaN(rate) || rate < 0 || rate > 30) {
                showFieldError(interestInput, interestError, "Enter a rate between 0 and 30, or leave it empty.");
                valid = false;
            }

            if (!valid) {
                resetResult();
                return;
            }

            let totalMonths;
            let finalAmount = goal;

            if (rate === 0) {

                totalMonths = Math.ceil(goal / monthly);

            } else {

                // Deposits at the end of each month, interest compounded monthly
                const r = rate / 12 / 100;

                totalMonths = Math.ceil(Math.log(1 + (goal * r) / monthly) / Math.log(1 + r));

                finalAmount = monthly * ((Math.pow(1 + r, totalMonths) - 1) / r);
            }

            if (totalMonths < 1) totalMonths = 1;

            resultBox.classList.add("has-result");
            resultMain.textContent = timeText(totalMonths);

            let sub;

            if (monthly >= goal) {
                sub = "Your monthly saving already covers this goal in a single month!";
            } else if (rate === 0) {
                sub = "Saving " + formatRupees(monthly) + " every month, you can reach " +
                      formatRupees(goal) + " in about " + plural(totalMonths, "month") + ".";
            } else {
                const deposited = monthly * totalMonths;
                sub = "Saving " + formatRupees(monthly) + " a month at " + rate + "% a year, " +
                      "you would have about " + formatRupees(finalAmount) + ". You deposit " +
                      formatRupees(deposited) + " and interest adds about " +
                      formatRupees(finalAmount - deposited) + ".";
            }

            resultSub.textContent = sub;

        });

        savingsForm.addEventListener("reset", function () {
            clearAll();
            resetResult();
        });
    }


    /* =========================================
       4. MONTHLY BUDGET CHECK (planning.html)
    ========================================= */

    const budgetForm = document.getElementById("budgetForm");

    if (budgetForm) {

        const incomeInput = document.getElementById("budIncome");
        const needsInput = document.getElementById("budNeeds");
        const wantsInput = document.getElementById("budWants");
        const budgetError = document.getElementById("budgetError");
        const budgetResult = document.getElementById("budgetResult");

        function barRow(label, percent) {
            const width = Math.max(0, Math.min(100, percent));
            return '<div class="planner-bar-row"><span>' + label + '</span>' +
                   '<div class="planner-bar"><div style="width:' + width + '%"></div></div>' +
                   '<span>' + Math.round(percent) + '%</span></div>';
        }

        budgetForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const income = parseFloat(incomeInput.value);
            const needs = parseFloat(needsInput.value) || 0;
            const wants = parseFloat(wantsInput.value) || 0;

            budgetError.textContent = "";
            budgetResult.hidden = true;

            if (isNaN(income) || income <= 0) {
                budgetError.textContent = "Please enter your monthly income.";
                incomeInput.focus();
                return;
            }

            if (needs < 0 || wants < 0) {
                budgetError.textContent = "Expenses cannot be negative.";
                return;
            }

            const savings = income - needs - wants;

            const needsPct = (needs / income) * 100;
            const wantsPct = (wants / income) * 100;
            const savePct = (savings / income) * 100;

            let advice;

            if (savings < 0) {
                advice = "You are spending " + formatRupees(Math.abs(savings)) +
                         " more than you earn each month. Look at your wants first, then your needs, to close the gap.";
            } else if (savePct >= 20) {
                advice = "Well done! You are saving " + Math.round(savePct) +
                         "% of your income, which meets the 20% guide. Keep it going.";
            } else {
                const target = income * 0.2;
                advice = "You are saving " + Math.round(savePct) + "% of your income. " +
                         "To reach 20% you would save about " + formatRupees(target) +
                         " a month, which means finding " + formatRupees(target - savings) + " more.";
            }

            budgetResult.innerHTML =
                "<strong>Left for savings: " + formatRupees(savings) + "</strong>" +
                '<div class="planner-bars">' +
                barRow("Needs", needsPct) +
                barRow("Wants", wantsPct) +
                barRow("Savings", savePct) +
                "</div>" + advice;

            budgetResult.hidden = false;

        });

        budgetForm.addEventListener("reset", function () {
            budgetError.textContent = "";
            budgetResult.hidden = true;
        });
    }


    /* =========================================
       5. EMERGENCY FUND TARGET (planning.html)
    ========================================= */

    const emergencyForm = document.getElementById("emergencyForm");

    if (emergencyForm) {

        const expensesInput = document.getElementById("emExpenses");
        const monthsSelect = document.getElementById("emMonths");
        const savedInput = document.getElementById("emSaved");
        const emergencyError = document.getElementById("emergencyError");
        const emergencyResult = document.getElementById("emergencyResult");

        emergencyForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const expenses = parseFloat(expensesInput.value);
            const months = parseInt(monthsSelect.value, 10);
            const saved = parseFloat(savedInput.value) || 0;

            emergencyError.textContent = "";
            emergencyResult.hidden = true;

            if (isNaN(expenses) || expenses <= 0) {
                emergencyError.textContent = "Please enter your essential monthly expenses.";
                expensesInput.focus();
                return;
            }

            if (saved < 0) {
                emergencyError.textContent = "Saved amount cannot be negative.";
                return;
            }

            const target = expenses * months;
            const remaining = target - saved;

            let text = "<strong>Your target: " + formatRupees(target) + "</strong><br>" +
                       "That covers " + plural(months, "month") + " of essential expenses.<br>";

            if (remaining <= 0) {
                text += "You have already reached your target. Well done!";
            } else {
                const percent = Math.round((saved / target) * 100);
                text += "You have saved " + percent + "% so far. " +
                        "You still need " + formatRupees(remaining) + ".";
            }

            emergencyResult.innerHTML = text;
            emergencyResult.hidden = false;

        });

        emergencyForm.addEventListener("reset", function () {
            emergencyError.textContent = "";
            emergencyResult.hidden = true;
        });
    }

});

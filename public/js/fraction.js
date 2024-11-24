let currentAnswer = { whole: 0, numerator: 0, denominator: 1 };
let correctAnswers = 0;
let totalQuestions = 0;
let lastQuestion = null;
// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}

// Helper function to get GCD for fraction simplification
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Convert improper fraction to mixed number
function improperToMixed(numerator, denominator) {
    if (numerator === 0) return { whole: 0, numerator: 0, denominator: 1 };
    if (denominator > numerator) return { whole: 0, numerator: numerator, denominator: denominator };

    let whole = numerator < 0 ? Math.ceil(numerator / denominator) : Math.floor(numerator / denominator);
    let newNumerator = numerator % denominator;
    return { whole: whole, numerator: newNumerator, denominator: denominator };
}

// Simplify fraction
function simplifyFraction(numberObject) {
    // Convert to improper fraction
    numerator = numberObject.numerator + (numberObject.whole * numberObject.denominator);

    // Find GCD and simplify
    const divisor = gcd(numerator, numberObject.denominator);
    numerator = numerator / divisor;
    denominator = numberObject.denominator / divisor;

    // Convert back to mixed number
    return { numerator: numerator, denominator: denominator };
}

function checkAnswer() {
    const userWhole = parseInt($("#wholeNumber").val()) || 0;
    const userNumerator = parseInt($("#numerator").val()) || 0;
    const userDenominator = parseInt($("#denominator").val()) || 1;

    // Convert user answer to improper fraction for comparison
    const userImproper = userNumerator + (userWhole * userDenominator);
    const correctImproper = currentAnswer.numerator + (currentAnswer.whole * currentAnswer.denominator);

    // Compare the fractions by cross multiplication
    const isCorrect = (userImproper * currentAnswer.denominator) === (correctImproper * userDenominator);
    let correctAnswerText = '';
    if (isCorrect) {
        $("#feedback").html("Correct 👍").css("color", "green");
        correctAnswers++;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        correctAnswerText = `${currentAnswer.whole} ${currentAnswer.numerator}/${currentAnswer.denominator}`;
    } else {
        const simplified = simplifyFraction(currentAnswer);
        correctAnswerText += `${currentAnswer.whole} ${currentAnswer.numerator}/${currentAnswer.denominator}  `;
        correctAnswerText += `simplified: ${simplified.numerator}/${simplified.denominator}`;
        $("#feedback").html(`Wrong! The correct answer is ${correctAnswerText}`).css("color", "red");
    }

    // add question and answer and feedback to logs
    const log = {
        time: new Date().toLocaleTimeString(),
        question: $("#question").html(),
        answer: correctAnswerText,
        userAnswer: `${userWhole} ${userNumerator}/${userDenominator}`,
        feedback: $("#feedback").text()
    };
    $('#logsContent').append(`<p>${log.time}: ${log.question} (${log.userAnswer}) ${log.feedback}</p>`);

    totalQuestions++;
    updateScore();
    $("#submitAnswer").hide();
    $("#newQuestion").show();
    $("#newQuestion").focus();
}

function generateQuestion() {
    const allowMixedNumbers = $("#allowMixedNumbers").is(":checked");
    const operations = $(".operation:checked").map(function () { return this.value; }).get();
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const sameDenominator = $("#sameDenominator").is(":checked");
    const allowNegativeResults = $("#allowNegativeResults").is(":checked");

    // Generate fractions with numerator less than denominator
    let fraction1 = {
        whole: allowMixedNumbers ? Math.floor(Math.random() * 3) : 0,
        denominator: Math.floor(Math.random() * 5) + 2,  // Generate denominator first (minimum 2)
        numerator: 1  // Placeholder, will be set below
    };
    fraction1.numerator = Math.floor(Math.random() * (fraction1.denominator - 1)) + 1; // Ensures numerator < denominator
    fraction1.total = fraction1.whole + (fraction1.numerator / fraction1.denominator)

    let fraction2 = {
        whole: allowMixedNumbers ? Math.floor(Math.random() * 3) : 0,
        denominator: sameDenominator ? fraction1.denominator : (Math.floor(Math.random() * 5) + 2),  // Generate denominator first (minimum 2)
        numerator: 1  // Placeholder, will be set below
    };
    fraction2.numerator = Math.floor(Math.random() * (fraction2.denominator - 1)) + 1; // Ensures numerator < denominator
    fraction2.total = fraction2.whole + (fraction2.numerator / fraction2.denominator)

    while (!allowNegativeResults && operation === '-' && fraction2.total > fraction1.total) {
        let diff = Math.floor(fraction2.total - fraction1.total + 1)
        let max = Math.floor(Math.random() * 10)
        let adjustment = Math.floor(Math.random() * (max - diff + 1)) + diff;
        fraction1.total += adjustment;
        fraction1.whole += adjustment;
    }

    // Display question
    let questionText = '<div class="fraction-display">';

    // First fraction
    questionText += '<div class="fraction-number">';
    if (fraction1.whole > 0) questionText += `<span class="whole">${fraction1.whole}</span>`;
    questionText += '<div class="fraction-part">';
    questionText += `<span class="numerator">${fraction1.numerator}</span>`;
    questionText += `<span class="denominator">${fraction1.denominator}</span>`;
    questionText += '</div></div>';

    // Operation
    questionText += `<span class="operation">${operation}</span>`;

    // Second fraction
    questionText += '<div class="fraction-number">';
    if (fraction2.whole > 0) questionText += `<span class="whole">${fraction2.whole}</span>`;
    questionText += '<div class="fraction-part">';
    questionText += `<span class="numerator">${fraction2.numerator}</span>`;
    questionText += `<span class="denominator">${fraction2.denominator}</span>`;
    questionText += '</div></div>';

    questionText += '<span class="operation">=</span>';
    questionText += '</div>';

    $("#question").html(questionText);

    // Calculate answer
    currentAnswer = calculateFractions(fraction1, fraction2, operation)

    // Reset UI
    $("#wholeNumber, #numerator, #denominator").val('');
    $("#submitAnswer").show();
    $("#newQuestion").hide();
    $("#feedback").text('');
    $("#wholeNumber").focus();
}

function calculateFractions(fraction1, fraction2, operation) {
    const fractionA = simplifyFraction(fraction1);
    const fractionB = simplifyFraction(fraction2);
    // Calculate the resulting fraction based on the operation
    let resultNumerator, resultDenominator;

    if (operation === '+') {
        resultNumerator =
            fractionA.numerator * fractionB.denominator + fractionB.numerator * fractionA.denominator;
    } else if (operation === '-') {
        resultNumerator =
            fractionA.numerator * fractionB.denominator - fractionB.numerator * fractionA.denominator;
    } else {
        throw new Error("Unsupported operation. Use '+' or '-'.");
    }

    resultDenominator = fractionA.denominator * fractionB.denominator;

    // Convert back to mixed fraction
    return improperToMixed(resultNumerator, resultDenominator);
}

$(document).ready(function () {
    // Hide game initially
    $("#game").hide();

    // Start button click handler
    $("#startButton").click(function () {
        const selectedOperations = $(".operation:checked");
        if (selectedOperations.length === 0) {
            alert("Please select at least one operation!");
            return;
        }
        $("#settings").hide();
        $("#game").show();
        generateQuestion();
    });

    // Back link click handler
    $("#game .backLink").click(function (e) {
        e.preventDefault();
        correctAnswers = 0;
        totalQuestions = 0;
        updateScore();
        $("#game").hide();
        $("#settings").show();
    });

    // Submit answer handler
    $("#submitAnswer").click(checkAnswer);

    // New question handler
    $("#newQuestion").click(generateQuestion);

    // Enter key handlers
    $("#wholeNumber, #numerator, #denominator").keypress(function (e) {
        if (e.which === 13) {
            checkAnswer();
        }
    });

    // Add event listener for the new question button
    document.getElementById('newQuestion').addEventListener('click', () => {
        // Clear previous inputs
        document.getElementById('wholeNumber').value = '';
        document.getElementById('numerator').value = '';
        document.getElementById('denominator').value = '';

        // Clear feedback
        document.getElementById('feedback').textContent = '';

        // Generate and display new question
        generateQuestion();
    });
});
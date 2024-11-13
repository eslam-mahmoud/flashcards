let currentAnswer = { whole: 0, numerator: 0, denominator: 1 };
let correctAnswers = 0;
let totalQuestions = 0;
let lastQuestion = null;
// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}
var logs = [];

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
    const whole = Math.floor(numerator / denominator);
    const newNumerator = numerator % denominator;
    return {
        whole,
        numerator: newNumerator,
        denominator
    };
}

// Simplify fraction
function simplifyFraction(whole, numerator, denominator) {
    // Convert to improper fraction
    numerator = numerator + (whole * denominator);
    
    // Find GCD and simplify
    const divisor = gcd(numerator, denominator);
    numerator = numerator / divisor;
    denominator = denominator / divisor;
    
    // Convert back to mixed number
    return improperToMixed(numerator, denominator);
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
        const simplified = simplifyFraction(currentAnswer.whole, currentAnswer.numerator, currentAnswer.denominator);
        if (simplified.whole > 0) {
            correctAnswerText += `${simplified.whole} `;
        }
        if (simplified.numerator > 0) {
            correctAnswerText += `${simplified.numerator}/${simplified.denominator}`;
        }
        $("#feedback").html(`Wrong! The correct answer is ${correctAnswerText}`).css("color", "red");
    }

    // add question and answer and feedback to logs
    const log = {
        time: new Date().toLocaleTimeString(),
        question: $("#question").text(),
        answer: correctAnswerText,
        userAnswer: `${userWhole} ${userNumerator}/${userDenominator}`,
        feedback: $("#feedback").text()
    };
    logs.push(log);
    $('#logsContent').append(`<p>${log.time}: ${log.question} (${log.userAnswer}) ${log.feedback}</p>`);

    totalQuestions++;
    updateScore();
    $("#submitAnswer").hide();
    $("#newQuestion").show();
    $("#newQuestion").focus();
}

function generateQuestion() {
    const allowMixedNumbers = $("#allowMixedNumbers").is(":checked");
    const operations = $(".operation:checked").map(function() { return this.value; }).get();
    const operation = operations[Math.floor(Math.random() * operations.length)];

    // Generate fractions with numerator less than denominator
    let fraction1 = {
        whole: allowMixedNumbers ? Math.floor(Math.random() * 3) : 0,
        denominator: Math.floor(Math.random() * 5) + 2,  // Generate denominator first (minimum 2)
        numerator: 1  // Placeholder, will be set below
    };
    fraction1.numerator = Math.floor(Math.random() * (fraction1.denominator - 1)) + 1; // Ensures numerator < denominator

    let fraction2 = {
        whole: allowMixedNumbers ? Math.floor(Math.random() * 3) : 0,
        denominator: Math.floor(Math.random() * 5) + 2,  // Generate denominator first (minimum 2)
        numerator: 1  // Placeholder, will be set below
    };
    fraction2.numerator = Math.floor(Math.random() * (fraction2.denominator - 1)) + 1; // Ensures numerator < denominator

    // Display question
    let questionText = '';
    if (fraction1.whole > 0) questionText += `${fraction1.whole} `;
    questionText += `${fraction1.numerator}/${fraction1.denominator} ${operation} `;
    if (fraction2.whole > 0) questionText += `${fraction2.whole} `;
    questionText += `${fraction2.numerator}/${fraction2.denominator} = ?`;
    
    $("#question").text(questionText);

    // Calculate answer
    const improper1 = fraction1.numerator + (fraction1.whole * fraction1.denominator);
    const improper2 = fraction2.numerator + (fraction2.whole * fraction2.denominator);
    
    // Find common denominator
    const commonDenom = fraction1.denominator * fraction2.denominator;
    const num1 = improper1 * fraction2.denominator;
    const num2 = improper2 * fraction1.denominator;

    let resultNumerator;
    if (operation === '+') {
        resultNumerator = num1 + num2;
    } else { // subtraction
        resultNumerator = num1 - num2;
    }

    currentAnswer = simplifyFraction(0, resultNumerator, commonDenom);

    // Reset UI
    $("#wholeNumber, #numerator, #denominator").val('');
    $("#submitAnswer").show();
    $("#newQuestion").hide();
    $("#feedback").text('');
    $("#wholeNumber").focus();
}

$(document).ready(function() {
    // Hide game initially
    $("#game").hide();

    // Start button click handler
    $("#startButton").click(function() {
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
    $(".backLink").click(function(e) {
        e.preventDefault();
        $("#game").hide();
        $("#settings").show();
    });

    // Submit answer handler
    $("#submitAnswer").click(checkAnswer);

    // New question handler
    $("#newQuestion").click(generateQuestion);

    // Enter key handlers
    $("#wholeNumber, #numerator, #denominator").keypress(function(e) {
        if (e.which === 13) {
            checkAnswer();
        }
    });

    $('#logs').on('click', function(e) {
        e.preventDefault();
        $('#logsModal').toggle();
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
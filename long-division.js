let currentQuotient;
let currentRemainder;
let correctAnswers = 0;
let totalQuestions = 0;
let logs = [];

function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}

function checkAnswer() {
    const userQuotient = parseInt($("#quotient").val());
    const userRemainder = parseInt($("#remainder").val());
    let isCorrect = false;

    if (userQuotient === currentQuotient && userRemainder === currentRemainder) {
        $("#feedback").text("Correct 👍").css("color", "green");
        $("#submitAnswer").hide();
        correctAnswers++;
        isCorrect = true;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        $("#feedback").text(`Wrong! The correct answer is ${currentQuotient} remainder ${currentRemainder}`).css("color", "red");
    }

    const log = {
        time: new Date().toLocaleTimeString(),
        question: $("#question").text(),
        answer: `${currentQuotient} r ${currentRemainder}`,
        userAnswer: `${userQuotient} r ${userRemainder}`,
        correct: isCorrect
    };
    logs.push(log);
    $('#logsContent').append(`<p>${log.time}: ${log.question} (${log.userAnswer}) ${isCorrect ? '✓' : '✗'}</p>`);

    totalQuestions++;
    updateScore();

    $("#newQuestion").show();
    $("#newQuestion").focus();
    $("#feedback").show();
}

function generateQuestion() {
    $("#quotient, #remainder").val("");
    const difficulty = $("input[name='difficulty']:checked").val();
    
    let dividend, divisor;

    switch(difficulty) {
        case "easy":
            divisor = Math.floor(Math.random() * 8) + 2; // 2-9
            dividend = divisor * (Math.floor(Math.random() * 11) + 2) + Math.floor(Math.random() * divisor); // 2-digit number
            break;
        case "medium":
            divisor = Math.floor(Math.random() * 8) + 2; // 2-9
            dividend = divisor * (Math.floor(Math.random() * 101) + 10) + Math.floor(Math.random() * divisor); // 3-digit number
            break;
        case "hard":
            divisor = Math.floor(Math.random() * 90) + 10; // 10-99
            dividend = divisor * (Math.floor(Math.random() * 11) + 2) + Math.floor(Math.random() * divisor); // 3-digit number
            break;
    }

    currentQuotient = Math.floor(dividend / divisor);
    currentRemainder = dividend % divisor;

    $("#question").text(`${dividend} ÷ ${divisor} = ?`);
    $("#question, #work-area, #submitAnswer").show();
    $("#newQuestion").hide();
    $("#submitAnswer").show();
    $("#feedback").text("");
    $("#quotient").focus();
}

$(document).ready(function() {
    $("#game").hide();

    $("#submitAnswer").on("click", checkAnswer);
    $("#newQuestion").on("click", generateQuestion);

    $("#quotient, #remainder").on("keypress", function(e) {
        if (e.which === 13) {
            e.preventDefault();
            if ($("#quotient").val() && $("#remainder").val()) {
                checkAnswer();
            } else if ($(this).attr('id') === 'quotient') {
                $("#remainder").focus();
            }
        }
    });

    $("#startButton").on("click", function(e) {
        e.preventDefault();
        $("#settings").hide();
        $("#game").show();
        generateQuestion();
    });

    $("#game .backLink").on("click", function(e) {
        e.preventDefault();
        correctAnswers = 0;
        totalQuestions = 0;
        updateScore();
        $("#settings").show();
        $("#game").hide();
        $("#question, #work-area, #submitAnswer, #feedback, #newQuestion").hide();
    });

    $('#logs').on('click', function(e) {
        e.preventDefault();
        $('#logsModal').toggle();
    });
}); 
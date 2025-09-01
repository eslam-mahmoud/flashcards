let currentNumber;
let correctAnswer;
let totalQuestions = 0;
let correctAnswers = 0;

// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}

function checkAnswer() {
    const userAnswer = parseInt($("#answer").val());

    if (userAnswer === correctAnswer) {
        $("#feedback").text("Correct 👍").css("color", "green");
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        correctAnswers++;
    } else {
        $("#feedback").text(`Wrong! The correct answer is ${correctAnswer}.`).css("color", "red");
    }

    // Log the question and answer
    const log = {
        time: new Date().toLocaleTimeString(),
        question:  $("#question").text(),
        userAnswer: userAnswer,
        feedback: $("#feedback").text()
    };
    $('#logsContent').append(`<p>${log.time}: ${log.question} (${log.userAnswer}) ${log.feedback}</p>`);

    $("#newQuestion").show();
    $("#newQuestion").focus();
    $("#feedback").show();
    $("#submitAnswer").hide();
    updateScore();
}

function generateQuestion() {
    totalQuestions++;
    const numberRange = parseInt($("input[name='numberRange']:checked").val());
    beforeOrAfter = "after"
    if (Math.floor(Math.random() * 10) % 2 == 0) {
        beforeOrAfter = "before"
        currentNumber = Math.floor(Math.random() * (numberRange + 1));
        correctAnswer = currentNumber - 1;
    } else {
        currentNumber = Math.floor(Math.random() * (numberRange + 1));
        correctAnswer = currentNumber + 1;
    }

    $("#question").text(`What comes ${beforeOrAfter} ${currentNumber}?`);
    $("#answer").val("");
    $("#question, #answer, #submitAnswer").show();
    $("#newQuestion").hide();
    $("#submitAnswer").show();
    $("#feedback").text("");
    $("#answer").focus();
    updateScore();
}

$(document).ready(function () {
    $("#submitAnswer").on("click", function() {
        checkAnswer();
    });

    $("#newQuestion").on("click", function() {
        generateQuestion();
    });

    $("#startButton").on("click", function(e) {
        e.preventDefault();
        $("#settings").hide();
        $("#game").show();
        generateQuestion();
    });

    // Handle back button click
    $(".backLink").on("click", function(e) {
        if ($(this).attr("href") === "#settings") {
            e.preventDefault();
            $("#game").hide();
            $("#settings").show();
            // clear logs content
            $("#logsContent").empty();
        }
    });
});
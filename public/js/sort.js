let currentNumbers = [];
let currentOrder;
let totalQuestions = 0;
let correctAnswers = 0;

// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}

function checkAnswer() {
    // get user input
    const userAnswer = $("#answer").val().split(',').map(num => parseInt(num));
    // sort the currentNumbers based on the currentOrder
    const correctAnswer = currentNumbers.slice().sort((a, b) => currentOrder === "ascending" ? a - b : b - a);
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);

    if (isCorrect) {
        $("#feedback").text("Correct 👍").css("color", "green");
        correctAnswers++;
    } else {
        $("#feedback").text(`Wrong! The correct order is ${JSON.stringify(correctAnswer)}.`).css("color", "red");
    }

    totalQuestions++;
    updateScore();
    $("#newQuestion").show();
    $("#newQuestion").focus();
    $("#feedback").show();
    $("#submitAnswer").hide()

    const log = {
        time: new Date().toLocaleTimeString(),
        question: $("#question").text(),
        userAnswer: userAnswer.toString(),
        feedback: $("#feedback").text()
    };
    $('#logsContent').append(`<p>${log.time}: ${log.question} (${log.userAnswer}) ${log.feedback}</p>`);
}

function generateQuestion() {
    $("#answer").val("");
    const numberRange = parseInt($("input[name='numberRange']:checked").val());
    const numCount = Math.floor(Math.random() * 2) + 5; // Randomly choose between 5 or 6 numbers
    currentNumbers = Array.from({ length: numCount }, () => Math.floor(Math.random() * (numberRange + 1)));
    currentOrder = Math.random() > 0.5 ? "ascending" : "descending";

    $("#question").html(`Sort these numbers: ${currentNumbers.join(', ')} ${currentOrder === "ascending" ? "<span class='badge badge-success'>Ascending</span>" : "<span class='badge badge-danger'>Descending</span>"}`);
    $("#question, #answer, #submitAnswer").show();
    $("#newQuestion").hide();
    $("#feedback").text("");
    $("#answer").focus();
    $("#submitAnswer").show()
}

function populateMaxNumbers() {
    const ranges = [
        { label: 'Easy (0-10)', value: 10 },
        { label: 'Medium (10-99)', value: 99 },
        { label: 'Hard (100-999)', value: 999 },
        { label: 'Advanced (1000-9999)', value: 9999 }
    ];
    ranges.forEach(range => {
        $('#maxNumber').append(`<option value="${range.value}">${range.label}</option>`);
    });
}

$(document).ready(function() {
    populateMaxNumbers();

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
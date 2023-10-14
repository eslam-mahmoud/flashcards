var correctAnswers = 0;
var totalQuestions = 0;
var number1 = 0;
var number2 = 0;
// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}

function setQuestion() {
    number1 = Math.floor(Math.random() * 100);
    number2;
    do {
        number2 = Math.floor(Math.random() * 100);
    } while (number2 == number1);
    console.log(`Number 1: ${number1}, Number 2: ${number2}`);

    $("#question").text(`${number1} Is _______ than ${number2}?`);

    $("#newQuestion").hide();
    $("#feedback").hide();
    $(".submitAnswer").show();
}

// on load add lisiner on .submitAnswer
$(document).ready(function() {
    $(".submitAnswer").click(function() {
        // read data attr from button
        var userAnswer = $(this).attr("data-answer");
        if ((userAnswer == "less" & number1 < number2) || (userAnswer == "more" & number1 > number2)) {
            $("#feedback").text("Correct 👍").css("color", "green");
            $("#submitAnswer").hide();
            correctAnswers++;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            $(".submitAnswer").hide();
        } else {
            $("#feedback").text(`Wrong! The correct answer is ${number1 > number2 ? " (More than >) " : " (Less than <) "}.`).css("color", "red");
        }
        totalQuestions++;
        updateScore();

        $("#newQuestion").show();
        $("#newQuestion").focus();
        $("#feedback").show();
    });

    $("#newQuestion").click(function() {
        setQuestion();
    });
    setQuestion();
});
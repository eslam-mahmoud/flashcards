const canvas = document.getElementById("shapeCanvas");
const ctx = canvas.getContext("2d");
var correctAnswers = 0;
var totalQuestions = 0;

function updateScore() {
    $("#score").text(`${correctAnswers}/${totalQuestions}`);
}

let currentFraction = 2; // default to 1/2

function drawRectangle(fraction) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let sectionWidth = canvas.width / fraction;

    for (let i = 1; i < fraction; i++) {
        ctx.beginPath();
        ctx.moveTo(sectionWidth * i, 0);
        ctx.lineTo(sectionWidth * i, canvas.height);
        ctx.stroke();
    }

    // Highlight a random section
    let randomSection = Math.floor(Math.random() * fraction);
    ctx.fillStyle = "rgba(255, 165, 0, 0.5)"; // light orange
    ctx.fillRect(sectionWidth * randomSection, 0, sectionWidth, canvas.height);
}

function drawCircle(fraction) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let sectionAngle = (2 * Math.PI) / fraction;

    for (let i = 1; i <= fraction; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, sectionAngle * i, sectionAngle * (i + 1));
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.stroke();
    }

    // Highlight a random section
    let randomSection = Math.floor(Math.random() * fraction);
    ctx.fillStyle = "rgba(255, 165, 0, 0.5)"; // light orange
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, sectionAngle * randomSection, sectionAngle * (randomSection + 1));
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
}

function newQuestion() {
    currentFraction = 2 + Math.floor(Math.random() * 11); // random fraction between 1/2 and 1/12
    console.log(`Current fraction: ${currentFraction}`);

    // Randomly choose between rectangle or circle
    if (Math.random() < 0.5) {
        drawRectangle(currentFraction);
    } else {
        drawCircle(currentFraction);
    }
    $("#newQuestion").hide();
    $("#feedback").hide();
    $("#submitAnswer").show();
    $("#fractionInput").val("");
    $("#fractionInput").focus();
}
$(document).ready(function() {
    $("#submitAnswer").click(function() {
        // read data attr from button
        var userAnswer = $("#fractionInput").val();
        if (userAnswer == `1/${currentFraction}`) {
            $("#feedback").text("Correct 👍").css("color", "green");
            $("#submitAnswer").hide();
            correctAnswers++;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            $("#submitAnswer").hide();
        } else {
            $("#feedback").text(`Wrong! The correct answer is 1/${currentFraction}.`).css("color", "red");
        }
        totalQuestions++;
        updateScore();

        $("#newQuestion").show();
        $("#newQuestion").focus();
        $("#feedback").show();
    });
    $("#newQuestion").click(newQuestion);
    // Load the first question
    newQuestion();
});


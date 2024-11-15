$(document).ready(function() {
    const canvas = document.getElementById("shapeCanvas");
    const ctx = canvas.getContext("2d");
    var correctAnswers = 0;
    var totalQuestions = 0;
    let currentFraction = 2; // default to 1/2

    function updateScore() {
        $("#score").text(`${correctAnswers}/${totalQuestions}`);
    }

    function drawRectangle(fraction) {
        let maxWidth = 250;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let sectionWidth = maxWidth / fraction;

        for (let i = 1; i < fraction; i++) {
            ctx.beginPath();
            ctx.moveTo(25 + (sectionWidth * i), 100);
            ctx.lineTo(25 + (sectionWidth * i), 200);
            ctx.stroke();
        }

        // Highlight a random section
        let randomSection = Math.floor(Math.random() * fraction);
        ctx.fillStyle = "rgba(255, 165, 0, 0.5)"; // light orange
        ctx.fillRect(25 + (sectionWidth * randomSection), 100, sectionWidth, 100);
        roundRect(ctx, 25, 100, maxWidth, 100);
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
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
        $("#answer").val("");
        $("#answer").focus();
    }

    $("#submitAnswer").click(function() {
        var userAnswer = $("#answer").val();
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


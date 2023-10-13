let currentAnswer;
let correctAnswers = 0;
let totalQuestions = 0;
let lastQuestion = {
    operation: null,
    mainNumber: null,
    randomNum: null
};

// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
    console.log(`${lastQuestion.mainNumber} ${lastQuestion.operation} ${lastQuestion.randomNum} = ${parseFloat($("#answer").val())}, Score: ${correctAnswers}/${totalQuestions}`);
}

function checkAnswer() {
    const userAnswer = parseFloat($("#answer").val());

    if (userAnswer === currentAnswer) {
        $("#feedback").text("Correct!").css("color", "green");
        $("#submitAnswer").hide();
        correctAnswers++;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        $("#feedback").text(`Wrong! The correct answer is ${currentAnswer}.`).css("color", "red");
    }
    totalQuestions++;
    updateScore();

    $("#newQuestion").show();
    $("#newQuestion").focus();
    $("#feedback").show();
}

function generateQuestion() {
    $("#answer").val("");

    const operations = $(".operation:checked").map(function() { return this.value; }).get();
    const mainNumbers = $(".main-number:checked").map(function() { return parseInt(this.value); }).get();
    const max = parseInt($("#maxNumber").val());

    let selectedOperation;
    let selectedMainNumber;
    let randomNum;

    do {
        selectedOperation = operations[Math.floor(Math.random() * operations.length)];
        selectedMainNumber = mainNumbers[Math.floor(Math.random() * mainNumbers.length)];

        switch(selectedOperation) {
            case "+":
                randomNum = Math.floor(Math.random() * (max + 1));
                break;
            case "-":
                randomNum = Math.floor(Math.random() * (max + 1));
                break;
            case "*":
                randomNum = Math.floor(Math.random() * (max + 1));
                break;
            case "/":
                do {
                    randomNum = Math.floor(Math.random() * (max + 1));
                } while(randomNum === 0); // Ensure randomNum is not zero
                break;
        }
    } while (
        selectedOperation === lastQuestion.operation &&
        selectedMainNumber === lastQuestion.mainNumber &&
        randomNum === lastQuestion.randomNum
    );

    lastQuestion = {
        operation: selectedOperation,
        mainNumber: selectedMainNumber,
        randomNum: randomNum
    };

    switch(selectedOperation) {
        case "+":
            $("#question").text(`${selectedMainNumber} + ${randomNum} = ?`);
            currentAnswer = selectedMainNumber + randomNum;
            break;
        case "-":
            $("#question").text(`${selectedMainNumber} - ${randomNum} = ?`);
            currentAnswer = selectedMainNumber - randomNum;
            break;
        case "*":
            $("#question").text(`${selectedMainNumber} x ${randomNum} = ?`);
            currentAnswer = selectedMainNumber * randomNum;
            break;
        case "/":
            $("#question").text(`${selectedMainNumber} ÷ ${randomNum} = ?`);
            currentAnswer = selectedMainNumber / randomNum;
            break;
    }

    // Display game elements and hide settings
    $("#question, #answer, #submitAnswer").show();
    $("#newQuestion").hide();
    $("#submitAnswer").show();
    $("#feedback").text("");
    $("#answer").focus();
}

function populateMaxNumbers() {
    for (let i = 1; i <= 100; i++) {
        $('#maxNumber').append(`<option value="${i}" ${i==10?'selected="selected"':''}>${i}</option>`);
    }
}

$(document).ready(function() {
    populateMaxNumbers();

    $("#submitAnswer").on("click", function() {
        checkAnswer();
    });

    $("#newQuestion").on("click", function() {
        generateQuestion();
    });

    $("#answer").on("keypress", function(e) {
        if (e.which === 13) {
            e.preventDefault();
            checkAnswer();
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
        $("#question, #answer, #submitAnswer, #feedback, #newQuestion").hide();

        // Reset last question to ensure variety
        lastQuestion = {
            operation: null,
            mainNumber: null,
            randomNum: null
        };
    });
});

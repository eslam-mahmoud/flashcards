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
}

function checkAnswer() {
    const userAnswer = parseFloat($("#answer").val());

    if (userAnswer === currentAnswer) {
        $("#feedback").text("Correct 👍").css("color", "green");
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
    // add question and answer and feedback to logs
    const log = {
        time: new Date().toLocaleTimeString(),
        question: $("#question").text(),
        answer: currentAnswer,
        userAnswer: userAnswer,
        feedback: $("#feedback").text()
    };
    $('#logsContent').append(`<p>${log.time}: ${log.question} (${log.userAnswer}) ${log.feedback}</p>`);


    totalQuestions++;
    updateScore();

    $("#newQuestion").show();
    $("#newQuestion").focus();
    $("#feedback").show();
}

function generateQuestion() {
    $("#answer").val("");
    // get input radio value where name="numberRange"
    const numberRange = parseInt($("input[name='numberRange']:checked").val());

    const operations = $(".operation:checked").map(function() { return this.value; }).get();

    let selectedOperation;
    let selectedMainNumber;
    let randomNum;

    do {
        selectedOperation = operations[Math.floor(Math.random() * operations.length)];
        selectedMainNumber = Math.floor(Math.random() * (numberRange+1));

        switch(selectedOperation) {
            case "+":
                randomNum = Math.floor(Math.random() * (numberRange + 1));
                break;
            case "-":
                do {
                    randomNum = Math.floor(Math.random() * (numberRange + 1));
                    console.log(selectedMainNumber, randomNum);
                } while(randomNum > selectedMainNumber); // Ensure randomNum is not greater than selectedMainNumber
                break;
            case "*":
                randomNum = Math.floor(Math.random() * (numberRange + 1));
                break;
            case "/":
                do {
                    randomNum = Math.floor(Math.random() * (numberRange + 1));
                } while(randomNum === 0 || (randomNum > selectedMainNumber && selectedMainNumber != 0)); // Ensure randomNum is not zero
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

    $('#logs').on('click', function(e) {
        e.preventDefault();
        $('#logsModal').toggle();
    });
});

var correctAnswers = 0;
var totalQuestions = 0;

// Update the score display
function updateScore() {
    $("#score").text(`Score: ${correctAnswers}/${totalQuestions}`);
}

document.addEventListener("DOMContentLoaded", function() {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const feedback = document.getElementById('feedback');
    const submitAnswer = document.getElementById('submitAnswer');
    const newQuestion = document.getElementById('newQuestion');

    let currentHour, currentMinute;

    function setRandomClock() {
        currentHour = Math.floor(Math.random() * 12); // Random hour from 0 to 11
        currentMinute = Math.floor(Math.random() * 12) * 5;  // Random minute from 0 to 59
        console.log(`Hour: ${currentHour}, Minute: ${currentMinute}`);
        
        const hourRotation = (360/12) * currentHour + (360/12) * (currentMinute/60);
        const minuteRotation = (360/60) * currentMinute;

        currentHour = currentHour === 0 ? 12 : currentHour;

        hourHand.style.transform = `rotate(${hourRotation}deg)`;
        minuteHand.style.transform = `rotate(${minuteRotation}deg)`;

        $("#submitAnswer").show();
        $("#hours").focus();
        $("#newQuestion").hide();
        $("#hours").val("");
        $("#minutes").val("");
        $("#feedback").hide();
    }

    submitAnswer.addEventListener('click', function() {
        const inputHour = parseInt(document.getElementById('hours').value, 10);
        const inputMinute = parseInt(document.getElementById('minutes').value, 10);
        
        if (inputHour === currentHour && inputMinute === currentMinute) {
            feedback.textContent = "Correct 👍";
            feedback.style.color = "green";

            // Confetti effect
            correctAnswers++;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            $("#submitAnswer").hide();
            $("#newQuestion").show();
            $("#newQuestion").focus();
        } else {
            feedback.textContent = `Incorrect. The correct time is ${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}. Try again!`;
            feedback.style.color = "red";
            $("#newQuestion").show();
        }
        $("#feedback").show();
        totalQuestions++;
        updateScore();
        // update logs
        
        $('#logsContent').append(`<p>${new Date().toLocaleTimeString()}: ${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute} (${inputHour}:${inputMinute < 10 ? '0' : ''}${inputMinute}) ${feedback.textContent}</p>`);
    });

    newQuestion.addEventListener('click', setRandomClock);

    // Initialize the clock with a random time
    setRandomClock();
});

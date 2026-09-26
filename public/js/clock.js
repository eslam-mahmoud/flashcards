let currentTime = null;

function formatTime(hour, minute) {
    return `${hour}:${String(minute).padStart(2, '0')}`;
}

function generateQuestion() {
    let hour;
    let minute;
    do {
        hour = App.randInt(1, 12);
        minute = App.randInt(0, 11) * 5;
    } while (currentTime && hour === currentTime.hour && minute === currentTime.minute);
    currentTime = { hour, minute };

    const hourRotation = 30 * (hour % 12) + 30 * (minute / 60);
    const minuteRotation = 6 * minute;
    $('#hourHand').css('transform', `rotate(${hourRotation}deg)`);
    $('#minuteHand').css('transform', `rotate(${minuteRotation}deg)`);
    $('#hours, #minutes').val('');
}

function checkAnswer() {
    const hoursRaw = $('#hours').val().trim();
    const minutesRaw = $('#minutes').val().trim();
    if (hoursRaw === '' || minutesRaw === '') return null;
    const hour = parseInt(hoursRaw, 10);
    const minute = parseInt(minutesRaw, 10);
    // 0 o'clock is accepted as 12 o'clock
    const normalizedHour = hour === 0 ? 12 : hour;
    return {
        correct: normalizedHour === currentTime.hour && minute === currentTime.minute,
        question: 'Clock',
        userAnswer: formatTime(hour, minute),
        correctAnswer: formatTime(currentTime.hour, currentTime.minute)
    };
}

$(function () {
    App.quiz({
        generate: generateQuestion,
        check: checkAnswer,
        inputs: '#hours, #minutes',
        focus: '#hours'
    });
});

let currentQuestion = null;

function generateQuestion() {
    const range = parseInt($("input[name='numberRange']:checked").val(), 10);
    let question;
    do {
        const direction = Math.random() < 0.5 ? 'before' : 'after';
        // keep both the number and the answer inside the chosen range (no negatives)
        const number = direction === 'before' ? App.randInt(1, range) : App.randInt(0, range - 1);
        question = { direction, number, answer: direction === 'before' ? number - 1 : number + 1 };
    } while (currentQuestion && question.direction === currentQuestion.direction && question.number === currentQuestion.number);
    currentQuestion = question;
    question.text = `What comes ${question.direction} ${question.number}?`;
    $('#question').text(question.text);
    $('#answer').val('');
}

function checkAnswer() {
    const raw = $('#answer').val().trim();
    if (raw === '') return null;
    return {
        correct: Number(raw) === currentQuestion.answer,
        question: currentQuestion.text,
        userAnswer: raw,
        correctAnswer: currentQuestion.answer
    };
}

$(function () {
    App.quiz({
        generate: generateQuestion,
        check: checkAnswer,
        inputs: '#answer',
        focus: '#answer'
    });
});

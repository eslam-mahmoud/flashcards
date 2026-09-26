const ANSWER_LABELS = { less: 'less than (<)', more: 'more than (>)' };
let numbers = null;

function generateQuestion() {
    const a = App.randInt(0, 99);
    let b;
    do {
        b = App.randInt(0, 99);
    } while (b === a);
    numbers = { a, b };
    $('#question').text(`${a}  ___  ${b}`);
}

function checkAnswer(userAnswer) {
    const correct = numbers.a < numbers.b ? 'less' : 'more';
    return {
        correct: userAnswer === correct,
        question: `${numbers.a} ? ${numbers.b}`,
        userAnswer: ANSWER_LABELS[userAnswer],
        correctAnswer: `${numbers.a} is ${ANSWER_LABELS[correct]} ${numbers.b}`
    };
}

$(function () {
    const quiz = App.quiz({ generate: generateQuestion, check: checkAnswer });
    $('.submitAnswer').on('click', function () {
        quiz.submit($(this).data('answer'));
    });
});

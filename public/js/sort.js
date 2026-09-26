const RANGES = {
    easy: [0, 10],
    medium: [10, 99],
    hard: [100, 999],
    advanced: [1000, 9999]
};

let currentQuestion = null;

function generateQuestion() {
    const [min, max] = RANGES[$("input[name='numberRange']:checked").val()];
    const count = App.randInt(5, 6);
    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(App.randInt(min, max));
    }
    const shuffled = [...numbers];
    const order = Math.random() < 0.5 ? 'ascending' : 'descending';
    const sorted = shuffled.slice().sort((a, b) => order === 'ascending' ? a - b : b - a);
    // make sure the numbers are not already shown in the answer order
    if (shuffled.join() === sorted.join()) shuffled.reverse();

    currentQuestion = { numbers: shuffled, order, sorted };
    const badge = order === 'ascending'
        ? '<span class="badge badge-success">Smallest → Largest</span>'
        : '<span class="badge badge-danger">Largest → Smallest</span>';
    $('#question').html(`${shuffled.join(', ')}<br>${badge}`);
    $('#answer').val('');
}

function checkAnswer() {
    const raw = $('#answer').val().trim();
    if (raw === '') return null;
    const userNumbers = raw.split(/[\s,]+/).filter(Boolean).map(Number);
    return {
        correct: userNumbers.join() === currentQuestion.sorted.join(),
        question: `${currentQuestion.numbers.join(', ')} (${currentQuestion.order})`,
        userAnswer: userNumbers.join(', '),
        correctAnswer: currentQuestion.sorted.join(', ')
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

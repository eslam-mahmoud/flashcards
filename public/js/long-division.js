// dividend / divisor digit ranges for each difficulty
const DIFFICULTIES = {
    easy: { dividend: [10, 99], divisor: [2, 9] },
    medium: { dividend: [100, 999], divisor: [2, 9] },
    hard: { dividend: [100, 999], divisor: [10, 99] }
};

let currentProblem = null;

function generateQuestion() {
    const level = DIFFICULTIES[$("input[name='difficulty']:checked").val()];
    const divisor = App.randInt(...level.divisor);
    // the quotient is always at least 1
    const dividend = App.randInt(Math.max(level.dividend[0], divisor), level.dividend[1]);
    currentProblem = {
        dividend,
        divisor,
        quotient: Math.floor(dividend / divisor),
        remainder: dividend % divisor
    };
    $('#question').html(
        `<span class="divisor">${divisor}</span><span class="dividend">${dividend}</span>`
    );
    $('#quotient, #remainder').val('');
}

function checkAnswer() {
    const quotientRaw = $('#quotient').val().trim();
    const remainderRaw = $('#remainder').val().trim();
    if (quotientRaw === '') return null;
    const quotient = parseInt(quotientRaw, 10);
    const remainder = remainderRaw === '' ? 0 : parseInt(remainderRaw, 10);
    const p = currentProblem;
    return {
        correct: quotient === p.quotient && remainder === p.remainder,
        question: `${p.dividend} ÷ ${p.divisor}`,
        userAnswer: `${quotient} r ${remainder}`,
        correctAnswer: `${p.quotient} remainder ${p.remainder}`
    };
}

$(function () {
    App.quiz({
        generate: generateQuestion,
        check: checkAnswer,
        inputs: '#quotient, #remainder',
        focus: '#quotient'
    });
});

const OPERATION_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

let currentQuestion = null;

function selectedOperations() {
    return $('.operation:checked').map(function () { return this.value; }).get();
}

// "range" limits every number shown: subtraction never goes negative and
// division always has a whole-number answer with the dividend inside the range.
function buildQuestion(operation, range) {
    switch (operation) {
        case '+': {
            const a = App.randInt(0, range);
            const b = App.randInt(0, range);
            return { a, b, answer: a + b };
        }
        case '-': {
            const a = App.randInt(0, range);
            const b = App.randInt(0, a);
            return { a, b, answer: a - b };
        }
        case '*': {
            const a = App.randInt(0, range);
            const b = App.randInt(0, range);
            return { a, b, answer: a * b };
        }
        case '/': {
            const b = App.randInt(1, range);
            const quotient = App.randInt(0, Math.floor(range / b));
            return { a: b * quotient, b, answer: quotient };
        }
    }
}

function generateQuestion() {
    const range = parseInt($("input[name='numberRange']:checked").val(), 10);
    const operations = selectedOperations();
    let question;
    do {
        const operation = App.pick(operations);
        question = { operation, ...buildQuestion(operation, range) };
    } while (
        currentQuestion &&
        question.operation === currentQuestion.operation &&
        question.a === currentQuestion.a &&
        question.b === currentQuestion.b
    );
    currentQuestion = question;
    question.text = `${question.a} ${OPERATION_SYMBOLS[question.operation]} ${question.b} = ?`;
    $('#question').text(question.text);
    $('#answer').val('');
}

function checkAnswer() {
    const raw = $('#answer').val().trim();
    if (raw === '') return null;
    const userAnswer = Number(raw);
    return {
        correct: userAnswer === currentQuestion.answer,
        question: currentQuestion.text,
        userAnswer: raw,
        correctAnswer: currentQuestion.answer
    };
}

$(function () {
    App.quiz({
        validateSettings: () => selectedOperations().length ? null : 'Please select at least one operation!',
        generate: generateQuestion,
        check: checkAnswer,
        inputs: '#answer',
        focus: '#answer'
    });
});

// Fractions are kept as improper fractions { n, d } with d > 0.
let currentQuestion = null;

function selectedOperations() {
    return $('.operation:checked').map(function () { return this.value; }).get();
}

function randomMixed(allowMixed, denominator) {
    const d = denominator || App.randInt(2, 6);
    return { whole: allowMixed ? App.randInt(0, 2) : 0, n: App.randInt(1, d - 1), d };
}

function toImproper(mixed) {
    return { n: mixed.whole * mixed.d + mixed.n, d: mixed.d };
}

function simplify(fraction) {
    const divisor = App.gcd(fraction.n, fraction.d) || 1;
    return { n: fraction.n / divisor, d: fraction.d / divisor };
}

// "7/6" -> "1 1/6", "-3/6" -> "-1/2", "4/2" -> "2"
function formatFraction(fraction) {
    const { n, d } = simplify(fraction);
    const sign = n < 0 ? '-' : '';
    const whole = Math.floor(Math.abs(n) / d);
    const remainder = Math.abs(n) % d;
    if (remainder === 0) return `${sign}${whole}`;
    if (whole === 0) return `${sign}${remainder}/${d}`;
    return `${sign}${whole} ${remainder}/${d}`;
}

function mixedText(mixed) {
    return mixed.whole > 0 ? `${mixed.whole} ${mixed.n}/${mixed.d}` : `${mixed.n}/${mixed.d}`;
}

function mixedHtml(mixed) {
    let html = '<div class="fraction-number">';
    if (mixed.whole > 0) html += `<span class="whole">${mixed.whole}</span>`;
    html += `<div class="fraction-part"><span class="numerator">${mixed.n}</span><span class="denominator">${mixed.d}</span></div>`;
    return html + '</div>';
}

function generateQuestion() {
    const allowMixed = $('#allowMixedNumbers').is(':checked');
    const sameDenominator = $('#sameDenominator').is(':checked');
    const allowNegative = $('#allowNegativeResults').is(':checked');
    const operation = App.pick(selectedOperations());

    let first = randomMixed(allowMixed);
    let second = randomMixed(allowMixed, sameDenominator ? first.d : null);
    const a = toImproper(first);
    const b = toImproper(second);

    // Without negative results the bigger number goes first.
    if (operation === '-' && !allowNegative && a.n * b.d < b.n * a.d) {
        [first, second] = [second, first];
    }

    const x = toImproper(first);
    const y = toImproper(second);
    const numerator = operation === '+' ? x.n * y.d + y.n * x.d : x.n * y.d - y.n * x.d;
    const symbol = operation === '+' ? '+' : '−';

    currentQuestion = {
        text: `${mixedText(first)} ${symbol} ${mixedText(second)}`,
        answer: simplify({ n: numerator, d: x.d * y.d })
    };

    $('#question').html(
        `<div class="fraction-display">${mixedHtml(first)}<span class="operation">${symbol}</span>${mixedHtml(second)}<span class="operation">=</span></div>`
    );
    $('#wholeNumber, #numerator, #denominator').val('');
}

function checkAnswer() {
    const wholeRaw = $('#wholeNumber').val().trim();
    const numRaw = $('#numerator').val().trim();
    const denRaw = $('#denominator').val().trim();
    if (wholeRaw === '' && numRaw === '') return null;
    if (numRaw !== '' && (denRaw === '' || Number(denRaw) === 0)) return null;

    const whole = wholeRaw === '' ? 0 : parseInt(wholeRaw, 10);
    const num = numRaw === '' ? 0 : parseInt(numRaw, 10);
    const den = numRaw === '' ? 1 : Math.abs(parseInt(denRaw, 10));
    // "-1 1/6" means -(1 + 1/6)
    const user = { n: whole < 0 ? whole * den - num : whole * den + num, d: den };

    const answer = currentQuestion.answer;
    const improperNote = Math.abs(answer.n) > answer.d && answer.n % answer.d !== 0 ? ` (= ${answer.n}/${answer.d})` : '';
    return {
        correct: user.n * answer.d === answer.n * user.d,
        question: `${currentQuestion.text} =`,
        userAnswer: numRaw === '' ? `${whole}` : `${wholeRaw ? whole + ' ' : ''}${num}/${den}`,
        correctAnswer: formatFraction(answer) + improperNote
    };
}

$(function () {
    App.quiz({
        validateSettings: () => selectedOperations().length ? null : 'Please select at least one operation!',
        generate: generateQuestion,
        check: checkAnswer,
        inputs: '#wholeNumber, #numerator, #denominator',
        focus: () => $('#allowMixedNumbers').is(':checked') ? '#wholeNumber' : '#numerator'
    });
});

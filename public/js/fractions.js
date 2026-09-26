const SHADE_COLOR = 'rgba(255, 165, 0, 0.5)';
let currentParts = 2;

function drawRectangle(ctx, parts) {
    const x = 25;
    const y = 100;
    const width = 250;
    const height = 100;
    const sectionWidth = width / parts;
    const shaded = App.randInt(0, parts - 1);

    ctx.fillStyle = SHADE_COLOR;
    ctx.fillRect(x + sectionWidth * shaded, y, sectionWidth, height);

    ctx.beginPath();
    for (let i = 1; i < parts; i++) {
        ctx.moveTo(x + sectionWidth * i, y);
        ctx.lineTo(x + sectionWidth * i, y + height);
    }
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

function drawCircle(ctx, parts) {
    const center = 150;
    const radius = 140;
    const sectionAngle = (2 * Math.PI) / parts;
    const shaded = App.randInt(0, parts - 1);

    ctx.fillStyle = SHADE_COLOR;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, sectionAngle * shaded, sectionAngle * (shaded + 1));
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    for (let i = 0; i < parts; i++) {
        ctx.moveTo(center, center);
        ctx.lineTo(center + radius * Math.cos(sectionAngle * i), center + radius * Math.sin(sectionAngle * i));
    }
    ctx.stroke();
}

function generateQuestion() {
    const canvas = document.getElementById('shapeCanvas');
    const ctx = canvas.getContext('2d');
    currentParts = App.pickDifferent([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], currentParts);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2C3E50';
    if (Math.random() < 0.5) {
        drawRectangle(ctx, currentParts);
    } else {
        drawCircle(ctx, currentParts);
    }
    $('#answer').val('');
}

function checkAnswer() {
    const raw = $('#answer').val().trim();
    if (raw === '') return null;
    const correctAnswer = `1/${currentParts}`;
    return {
        correct: raw.replace(/\s+/g, '') === correctAnswer,
        question: `Shape split into ${currentParts} parts`,
        userAnswer: raw,
        correctAnswer
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

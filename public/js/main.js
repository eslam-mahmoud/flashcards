// Shared helpers used by every activity page.
const App = {
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    pick(items) {
        return items[Math.floor(Math.random() * items.length)];
    },

    // Pick a random item that differs from the previous one (when there is a choice).
    pickDifferent(items, previous) {
        if (items.length < 2) return items[0];
        let item;
        do {
            item = App.pick(items);
        } while (item === previous);
        return item;
    },

    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    },

    escapeHtml(value) {
        return $('<div>').text(String(value)).html();
    },

    celebrate() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    },

    showFeedback(message, type) {
        $('#feedback')
            .removeClass('correct wrong info')
            .addClass(type)
            .text(message)
            .show();
    },

    clearFeedback() {
        $('#feedback').removeClass('correct wrong info').text('').hide();
    },

    log(question, userAnswer, isCorrect, correctAnswer) {
        const time = new Date().toLocaleTimeString();
        const result = isCorrect ? '✓' : `✗ (correct: ${correctAnswer})`;
        $('#logsContent').prepend(
            `<p>${App.escapeHtml(time)}: ${App.escapeHtml(question)} → ${App.escapeHtml(userAnswer)} ${App.escapeHtml(result)}</p>`
        );
    },

    clearLogs() {
        $('#logsContent').empty();
    },

    // Standard question/answer flow shared by all scored activities.
    //
    // options:
    //   validateSettings() -> error message or null (only used when the page has #settings)
    //   generate()         -> render a new question and reset the answer inputs
    //   check(arg)         -> null when the answer is incomplete, otherwise
    //                         { correct, question, userAnswer, correctAnswer }
    //   inputs             -> selector of answer inputs (Enter submits)
    //   focus              -> selector (or function returning one) focused on each new question
    quiz(options) {
        const state = { correct: 0, total: 0, answered: false };
        const hasSettings = $('#settings').length > 0;

        function updateScore() {
            $('#score').text(`Score: ${state.correct}/${state.total}`);
        }

        function next() {
            state.answered = false;
            options.generate();
            App.clearFeedback();
            $('#submitAnswer, .submitAnswer').show();
            $('#newQuestion').hide();
            const focus = typeof options.focus === 'function' ? options.focus() : options.focus;
            if (focus) $(focus).first().trigger('focus');
        }

        function submit(arg) {
            if (state.answered) return;
            const result = options.check(arg);
            if (!result) {
                App.showFeedback('Please enter your answer first ✏️', 'info');
                return;
            }
            state.answered = true;
            state.total++;
            if (result.correct) {
                state.correct++;
                App.showFeedback('Correct 👍', 'correct');
                App.celebrate();
            } else {
                App.showFeedback(`Not quite! The correct answer is ${result.correctAnswer}.`, 'wrong');
            }
            updateScore();
            App.log(result.question, result.userAnswer, result.correct, result.correctAnswer);
            $('#submitAnswer, .submitAnswer').hide();
            $('#newQuestion').show().trigger('focus');
        }

        function start() {
            if (hasSettings && options.validateSettings) {
                const error = options.validateSettings();
                $('#settingsError').text(error || '').toggle(Boolean(error));
                if (error) return;
            }
            state.correct = 0;
            state.total = 0;
            updateScore();
            App.clearLogs();
            $('#settings').hide();
            $('#game').show();
            next();
        }

        $('#submitAnswer').on('click', () => submit());
        $('#newQuestion').on('click', next);
        if (options.inputs) {
            $(document).on('keydown', options.inputs, e => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                if (state.answered) {
                    next();
                } else {
                    submit();
                }
            });
        }

        if (hasSettings) {
            $('#startButton').on('click', e => {
                e.preventDefault();
                start();
            });
            $('#game .backLink').on('click', e => {
                e.preventDefault();
                App.clearFeedback();
                $('#game').hide();
                $('#settings').show();
            });
        } else {
            start();
        }

        return { submit, next, state };
    }
};

$(function () {
    $('#logs').on('click', function (e) {
        e.preventDefault();
        $('#logsModal').toggle();
    });
});

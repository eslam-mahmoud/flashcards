// Letters that never join to the following letter (أ د ذ ر ز و) have no
// connecting stroke after them in the beginning and middle forms.
const ar_alphabet = [
    {
        "letter": "أ",
        "beginning": "أ",
        "middle": "ـأ",
        "end": "ـأ"
    },
    {
        "letter": "ب",
        "beginning": "بـ",
        "middle": "ـبـ",
        "end": "ـب"
    },
    {
        "letter": "ت",
        "beginning": "تـ",
        "middle": "ـتـ",
        "end": "ـت"
    },
    {
        "letter": "ث",
        "beginning": "ثـ",
        "middle": "ـثـ",
        "end": "ـث"
    },
    {
        "letter": "ج",
        "beginning": "جـ",
        "middle": "ـجـ",
        "end": "ـج"
    },
    {
        "letter": "ح",
        "beginning": "حـ",
        "middle": "ـحـ",
        "end": "ـح"
    },
    {
        "letter": "خ",
        "beginning": "خـ",
        "middle": "ـخـ",
        "end": "ـخ"
    },
    {
        "letter": "د",
        "beginning": "د",
        "middle": "ـد",
        "end": "ـد"
    },
    {
        "letter": "ذ",
        "beginning": "ذ",
        "middle": "ـذ",
        "end": "ـذ"
    },
    {
        "letter": "ر",
        "beginning": "ر",
        "middle": "ـر",
        "end": "ـر"
    },
    {
        "letter": "ز",
        "beginning": "ز",
        "middle": "ـز",
        "end": "ـز"
    },
    {
        "letter": "س",
        "beginning": "سـ",
        "middle": "ـسـ",
        "end": "ـس"
    },
    {
        "letter": "ش",
        "beginning": "شـ",
        "middle": "ـشـ",
        "end": "ـش"
    },
    {
        "letter": "ص",
        "beginning": "صـ",
        "middle": "ـصـ",
        "end": "ـص"
    },
    {
        "letter": "ض",
        "beginning": "ضـ",
        "middle": "ـضـ",
        "end": "ـض"
    },
    {
        "letter": "ط",
        "beginning": "طـ",
        "middle": "ـطـ",
        "end": "ـط"
    },
    {
        "letter": "ظ",
        "beginning": "ظـ",
        "middle": "ـظـ",
        "end": "ـظ"
    },
    {
        "letter": "ع",
        "beginning": "عـ",
        "middle": "ـعـ",
        "end": "ـع"
    },
    {
        "letter": "غ",
        "beginning": "غـ",
        "middle": "ـغـ",
        "end": "ـغ"
    },
    {
        "letter": "ف",
        "beginning": "فـ",
        "middle": "ـفـ",
        "end": "ـف"
    },
    {
        "letter": "ق",
        "beginning": "قـ",
        "middle": "ـقـ",
        "end": "ـق"
    },
    {
        "letter": "ك",
        "beginning": "كـ",
        "middle": "ـكـ",
        "end": "ـك"
    },
    {
        "letter": "ل",
        "beginning": "لـ",
        "middle": "ـلـ",
        "end": "ـل"
    },
    {
        "letter": "م",
        "beginning": "مـ",
        "middle": "ـمـ",
        "end": "ـم"
    },
    {
        "letter": "ن",
        "beginning": "نـ",
        "middle": "ـنـ",
        "end": "ـن"
    },
    {
        "letter": "ه",
        "beginning": "هـ",
        "middle": "ـهـ",
        "end": "ـه"
    },
    {
        "letter": "و",
        "beginning": "و",
        "middle": "ـو",
        "end": "ـو"
    },
    {
        "letter": "ي",
        "beginning": "يـ",
        "middle": "ـيـ",
        "end": "ـي"
    }
];

const LETTER_FORMS = ['beginning', 'middle', 'end'];
let letterIndex = -1;

function showLetter() {
    const letter = ar_alphabet[letterIndex];
    const text = $('#singleLetter').is(':checked') ? letter.letter : letter[App.pick(LETTER_FORMS)];
    $('#question').text(text);
}

function nextLetter() {
    if ($("input[name='letterType']:checked").val() === 'random') {
        letterIndex = App.pickDifferent([...ar_alphabet.keys()], letterIndex);
    } else {
        letterIndex = (letterIndex + 1) % ar_alphabet.length;
    }
    showLetter();
}

$(function () {
    $('#newQuestion').on('click', function () {
        App.celebrate();
        nextLetter();
    });
    $('#singleLetter').on('change', showLetter);
    nextLetter();
});

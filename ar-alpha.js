const ar_alphabet = [
    {
        "letter": "أ",
        "beginning": "أـ",
        "middle": "ـأـ",
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
        "beginning": "دـ",
        "middle": "ـدـ",
        "end": "ـد"
    },
    {
        "letter": "ذ",
        "beginning": "ذـ",
        "middle": "ـذـ",
        "end": "ـذ"
    },
    {
        "letter": "ر",
        "beginning": "رـ",
        "middle": "ـرـ",
        "end": "ـر"
    },
    {
        "letter": "ز",
        "beginning": "زـ",
        "middle": "ـزـ",
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
        "beginning": "وـ",
        "middle": "ـوـ",
        "end": "ـو"
    },
    {
        "letter": "ي",
        "beginning": "يـ",
        "middle": "ـيـ",
        "end": "ـي"
    }
]

// on load select random word from words.grade_1, display it and add event listener on .submitAnswer
$(document).ready(function() {
    $("#newQuestion").click(function() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setQuestion();
    });
    setQuestion();
});
var letter_index = -1;
function setQuestion() {
    // if letterType value == random select random letter else select letter by index and increment index
    if ($("input[name='letterType']:checked").val() == "random") {
        letter_index = Math.floor(Math.random() * ar_alphabet.length);
    } else {
        letter_index = (letter_index + 1) % ar_alphabet.length;
    }
    var letter = ar_alphabet[letter_index];
    // if singleLetter checkbox checked dispaly letter.letter else display beginning, middle, end randomly
    if ($("#singleLetter").is(":checked")) {
        $("#question").text(`${letter.letter}`);
    } else {
        var random = Math.floor(Math.random() * 4);
        if (random == 0) {
            $("#question").text(`${letter.beginning}`);
        } else if (random == 1) {
            $("#question").text(`${letter.middle}`);
        } else if (random == 2) {
            $("#question").text(`${letter.end}`);
        } else {
            $("#question").text(`${letter.middle}`);
        }
    }
    $("#newQuestion").show();
}
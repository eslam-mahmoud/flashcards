const ar_alphabet = [
    {
        "letter": "ا",
        "asFirst": "اـ",
        "inMiddle": "ـاـ",
        "asLast": "ـا"
    },
    {
        "letter": "ب",
        "asFirst": "بـ",
        "inMiddle": "ـبـ",
        "asLast": "ـب"
    },
    {
        "letter": "ت",
        "asFirst": "تـ",
        "inMiddle": "ـتـ",
        "asLast": "ـت"
    },
    {
        "letter": "ث",
        "asFirst": "ثـ",
        "inMiddle": "ـثـ",
        "asLast": "ـث"
    },
    {
        "letter": "ج",
        "asFirst": "جـ",
        "inMiddle": "ـجـ",
        "asLast": "ـج"
    },
    {
        "letter": "ح",
        "asFirst": "حـ",
        "inMiddle": "ـحـ",
        "asLast": "ـح"
    },
    {
        "letter": "خ",
        "asFirst": "خـ",
        "inMiddle": "ـخـ",
        "asLast": "ـخ"
    },
    {
        "letter": "د",
        "asFirst": "دـ",
        "inMiddle": "ـدـ",
        "asLast": "ـد"
    },
    {
        "letter": "ذ",
        "asFirst": "ذـ",
        "inMiddle": "ـذـ",
        "asLast": "ـذ"
    },
    {
        "letter": "ر",
        "asFirst": "رـ",
        "inMiddle": "ـرـ",
        "asLast": "ـر"
    },
    {
        "letter": "ز",
        "asFirst": "زـ",
        "inMiddle": "ـزـ",
        "asLast": "ـز"
    },
    {
        "letter": "س",
        "asFirst": "سـ",
        "inMiddle": "ـسـ",
        "asLast": "ـس"
    },
    {
        "letter": "ش",
        "asFirst": "شـ",
        "inMiddle": "ـشـ",
        "asLast": "ـش"
    },
    {
        "letter": "ص",
        "asFirst": "صـ",
        "inMiddle": "ـصـ",
        "asLast": "ـص"
    },
    {
        "letter": "ض",
        "asFirst": "ضـ",
        "inMiddle": "ـضـ",
        "asLast": "ـض"
    },
    {
        "letter": "ط",
        "asFirst": "طـ",
        "inMiddle": "ـطـ",
        "asLast": "ـط"
    },
    {
        "letter": "ظ",
        "asFirst": "ظـ",
        "inMiddle": "ـظـ",
        "asLast": "ـظ"
    },
    {
        "letter": "ع",
        "asFirst": "عـ",
        "inMiddle": "ـعـ",
        "asLast": "ـع"
    },
    {
        "letter": "غ",
        "asFirst": "غـ",
        "inMiddle": "ـغـ",
        "asLast": "ـغ"
    },
    {
        "letter": "ف",
        "asFirst": "فـ",
        "inMiddle": "ـفـ",
        "asLast": "ـف"
    },
    {
        "letter": "ق",
        "asFirst": "قـ",
        "inMiddle": "ـقـ",
        "asLast": "ـق"
    },
    {
        "letter": "ك",
        "asFirst": "كـ",
        "inMiddle": "ـكـ",
        "asLast": "ـك"
    },
    {
        "letter": "ل",
        "asFirst": "لـ",
        "inMiddle": "ـلـ",
        "asLast": "ـل"
    },
    {
        "letter": "م",
        "asFirst": "مـ",
        "inMiddle": "ـمـ",
        "asLast": "ـم"
    },
    {
        "letter": "ن",
        "asFirst": "نـ",
        "inMiddle": "ـنـ",
        "asLast": "ـن"
    },
    {
        "letter": "ه",
        "asFirst": "هـ",
        "inMiddle": "ـهـ",
        "asLast": "ـه"
    },
    {
        "letter": "و",
        "asFirst": "وـ",
        "inMiddle": "ـوـ",
        "asLast": "ـو"
    },
    {
        "letter": "ي",
        "asFirst": "يـ",
        "inMiddle": "ـيـ",
        "asLast": "ـي"
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
    // if singleLetter checkbox checked dispaly letter.letter else display asFirst, inMiddle, asLast randomly
    if ($("#singleLetter").is(":checked")) {
        $("#question").text(`${letter.letter}`);
    } else {
        var random = Math.floor(Math.random() * 4);
        if (random == 0) {
            $("#question").text(`${letter.asFirst}`);
        } else if (random == 1) {
            $("#question").text(`${letter.inMiddle}`);
        } else if (random == 2) {
            $("#question").text(`${letter.asLast}`);
        } else {
            $("#question").text(`${letter.inMiddle}`);
        }
    }
    $("#newQuestion").show();
}
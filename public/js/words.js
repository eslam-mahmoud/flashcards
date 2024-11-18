const words = {
    "grade_1": {
        "Numbers": ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"],
        "Prepositions": ["after", "again", "an", "any", "as", "ask", "by", "could", "every", "fly", "from", "give", "going", "had", "has", "her", "him", "his", "how", "just", "know", "let", "live", "may", "of", "old", "once", "open", "over", "put", "round", "some", "stop", "take", "thank", "them", "then", "think", "walk", "were", "when"],
        "Pronouns": ["all", "another", "any", "anybody", "anyone", "anything", "both", "each", "either", "everybody", "everyone", "everything", "few", "he", "her", "hers", "herself", "him", "himself", "his", "I", "it", "its", "itself", "many", "me", "mine", "more", "most", "much", "my", "myself", "neither", "no one", "nobody", "none", "nothing", "one", "other", "others", "our", "ours", "ourselves", "several", "she", "some", "somebody", "someone", "something", "that", "their", "theirs", "them", "themselves", "these", "they", "this", "those", "us", "we", "what", "whatever", "which", "whichever", "who", "whoever", "whom", "whomever", "whose", "you", "your", "yours", "yourself", "yourselves"],
        "Verbs": ["Accept", "Allow", "Ask", "Believe", "Borrow", "Break", "Bring", "Buy", "Can/be able", "Cancel", "Change", "Clean", "Comb", "Complain", "Cough", "Count", "Cut", "Dance", "Draw", "Drink", "Drive", "Eat", "Explain", "Fall", "Fill", "Find", "Finish", "Fit", "Fix", "Fly", "Forget", "Give", "Go", "Grow", "Hear", "Hurt", "Keep", "Know", "Learn", "Leave", "Lend", "Like", "Listen", "Live", "Look", "Lose", "Make/do", "Need", "Open", "Close", "Organize", "Pay", "Play", "Put", "Rain", "Read", "Reply", "Run", "Say", "See", "Sell", "Send", "Sign", "Sing", "Sit", "Sleep", "Speak", "Spend", "Stand", "Start/begin", "Stop", "Study", "Succeed", "Swim", "Take", "Talk", "Teach", "Tell", "Think", "Throw", "Touch", "Try", "Turn off", "Turn on", "Type", "Understand", "Use", "Wait", "Wake up", "Walk", "Want", "Watch", "Work", "Worry", "Write"],
        "Nouns": ["Time", "Person", "Year", "Way", "Day", "Thing", "Man", "World", "Life", "Hand", "Part", "Child", "Eye", "Woman", "Place", "Work", "Week", "Case", "Point", "Government", "Company", "Number", "Group", "Problem", "Fact"],
        "Body": ["Hand", "Arm", "Leg", "Foot", "Mouth", "Nose", "Head", "Hair", "Face", "Eye", "Ear", "Body", "Back", "Shoulder", "Chest", "Stomach", "Heart", "Liver", "Lung", "Kidney", "Blood", "Bone", "Muscle", "Skin", "Nail", "Finger", "Thumb", "Wrist", "Elbow", "Knee", "Ankle", "Toe"],
        "Animal": ["Dog", "Cat", "Bird", "Fish", "Lion", "Tiger", "Elephant", "Monkey", "Giraffe", "Zebra", "Horse", "Cow", "Pig", "Sheep", "Goat", "Chicken", "Duck", "Goose", "Rabbit", "Turtle", "Snake", "Frog", "Crocodile", "Shark", "Whale", "Dolphin"]
    }
};

function setQuestion() {
    var word = words.grade_1[$("input[name='wordType']:checked").val()][Math.floor(Math.random() * words.grade_1[$("input[name='wordType']:checked").val()].length)];
    $("#question").text(`${word}`);
    $("#newQuestion").show();
}

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

//This script interfaces with different types of question sets
//it works with multiple choice (".multiple-choice"), by using the same class it can become a true/false if using a set of 2 questions,
//  multiple answer (".multiple-answer"), and fill in the blank (".dropdown").

//If you see any opportunities to refactor code, please share.

//if the button clicked is part of a multiple choice question
$(".multiple-choice .submit-btn").click(function () {

    //find the div that contains all of the elements for this question
    var $question = $(this).closest(".question");

    //find the div that contains the answers
    var $answers = $question.find(".answers");

    //get the value of the attribute that has the id of the correct answer
    var $rightAnswer = $answers.data("correct-answer-id");

    //find the selected answer inside the div containing the answers
    var $selectedAnswer = $answers.find("input:checked");

    //get the id of the selected answer
    var selectedAnswerID = $selectedAnswer.attr("id");

    //find the container for the feedback
    var $feedback = $question.find(".feedback");

    //we make sure to hide both the correct and incorrect feedback so that we can
    //  display the correct feedback later
    HideFeedback($feedback);

    //if there are no answers selected and they try to submit we show them an error message
    if (!$selectedAnswer.length) {
        AlertError();
    }
    //if they have selected an answer check if it is correct/incorrect and
    // show the correct feedback
    else {
        var isCorrect = false;

        if (selectedAnswerID == $rightAnswer) {
            isCorrect = true;
        }

        DisplayFeedback($feedback, isCorrect);
    }
});


//this question set compares 2 arrays that are converted to strings to see if they match, if they do then the answer is correct.
/*If someone knows a better solution of comparing 2 lists, please share!*/
/*this question set is not programed to know which of the selected answers are incorrect, if you have a solution please share.*/
//if the button clicked is part of a multiple answer question that uses checkboxes
$(".multiple-answer .submit-btn").click(function () {

    //find the div that contains all of the elements for this question
    var $questionContainer = $(this).closest(".question");

    //find the div that contains the answers
    var $answerContainer = $questionContainer.find(".answers");

    //get the value of the attribute that has the ids of the correct answers
    var $rightAnswerIDs = $answerContainer.data("correct-answer-id");

    //convert the string into an array
    $rightAnswerIDs = $rightAnswerIDs.split(" ");

    //sort the array so that we can compare it later
    $rightAnswerIDs.sort();

    //find the selected answers inside the div containing the answers
    var $selectedAnswers = $answerContainer.find("input:checked");

    //create an empty array that will contain all of the ids of the selected answers
    var selectedAnswerIDs = [];

    //for each of the selected answers get the id attribute values and add them into
    //  our array
    $selectedAnswers.each(function (index) {
        selectedAnswerIDs.push($(this).attr("id"));
    });

    //sort the array of ids
    selectedAnswerIDs = selectedAnswerIDs.sort();

    //get the element that contains all feedback
    var $feedback = $questionContainer.find(".feedback");

    //we make sure to hide both the correct and incorrect feedback so that we can
    //  display the correct feedback later
    HideFeedback($feedback);

    //if there are no answers selected and they try to submit we show them an error message
    if (!$selectedAnswers.length) {
        AlertError();
    }
    //if they have selected an answer check if it is correct/incorrect and
    // show the correct feedback
    else {
        var isCorrect = false;

        if (selectedAnswerIDs.toString() == $rightAnswerIDs.toString()) {
            isCorrect = true;
        }

        DisplayFeedback($feedback, isCorrect);
    }
});

//if the button clicked is part of a fill in the blanks question
$(".dropdown .submit-btn").click(function () {

    //find the div that contains all of the elements for this question
    var $question = $(this).closest(".question");

    //find the div that contains the answers
    var $answers = $question.find(".answers");

    //get the value of the attribute that has the id of the correct answer
    var $rightAnswerValues = String($answers.data("correct-answer-value")).split(" ");

    //find the selected answer inside the div containing the answers
    var $selectedAnswers = $answers.find("option:selected");

    //get the value of the selected answer
    var selectedAnswerValues = [];
    $selectedAnswers.each(function () {
        selectedAnswerValues.push($(this).val());
    });

    //find the element containing the feedback
    var $feedback = $question.find(".feedback");

    //we make sure to hide both the correct and incorrect feedback so that we can
    //  display the correct feedback later
    HideFeedback($feedback);

    //if there are no answers selected and they try to submit we show them an error message
    if (selectedAnswerValues.length < $rightAnswerValues.length || selectedAnswerValues.indexOf("0") >= 0) {
        AlertError();
    }
    //if they have selected an answer check if it is correct/incorrect and
    // show the correct feedback
    else {
        var isCorrect = arraysEqual(selectedAnswerValues, $rightAnswerValues);
        DisplayFeedback($feedback, isCorrect);
    }
});

//if the button clicked is part of a custom feedback question
$(".custom-feedback .submit-btn").click(function () {

    //find the div that contains all of the elements for this question
    var $question = $(this).closest(".question");

    //find the div that contains the answers
    var $answers = $question.find(".answers");

    //find the selected answer inside the div containing the answers
    var $selectedAnswer = $answers.find("input:checked");

    //get the id of the selected answer
    var selectedAnswerID = $selectedAnswer.attr("id");

    //find the container for the feedback
    var $feedback = $question.find(".feedback");

    //we make sure to hide both the correct and incorrect feedback so that we can
    //  display the correct feedback later
    $feedback.find("> div").hide();

    //if there are no answers selected and they try to submit we show them an error message
    if (!$selectedAnswer.length) {
        AlertError();
    }
    //if they have selected an answer check if it is correct/incorrect and
    // show the correct feedback
    else {
        $feedback.find('[data-for="' + selectedAnswerID + '"]').show();
        DisplayFeedback($feedback, true);
    }
});


//---Functions---//
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function HideFeedback(feedback) {
    feedback.hide();
    feedback.find(".right").hide();
    feedback.find(".wrong").hide();

    //need to check if the element is not null in cases where the generic feedback element is not present
    generic = feedback.find(".generic");

    //javascript statements are 'truthy' or 'falsy' so this counts as true / false
    if (generic) {
        generic.hide();
    }
}

function DisplayFeedback(feedback, isCorrect) {
    feedback.show();

    if (isCorrect) {
        feedback.find(".right").show();
        feedback.addClass("correct");
        feedback.removeClass("incorrect");

        let funct_btn = feedback.find(".right").find("button[style='display: none;']");
        if (funct_btn) {
            funct_btn.click();
        }
    } else {
        feedback.find(".wrong").show();
        feedback.addClass("incorrect");
        feedback.removeClass("correct");

        let funct_btn = feedback.find(".wrong").find("button[style='display: none;']");
        if (funct_btn) {
            funct_btn.click();
        }
    }

    //need to check if the element is not null in cases where the generic feedback element is not present
    generic = feedback.find(".generic");

    //javascript statements are 'truthy' or 'falsy' so this counts as true / false
    if (generic) {
        generic.show();
    }
}

function AlertError() {
    //get the lang setting for the page
    var $lang = $("html").attr("lang");
    //check for lang settings
    if ($lang == "en") {
        alert("Please choose an answer.");
    } else if ($lang == "fr") {
        alert("Veuillez choisir une réponse.");
    }
}

console.log("question-set.js script loaded...");
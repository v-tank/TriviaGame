// declares global variables
var questionCounter = 0;
var quiz = $('#quiz');
var score = 0;
var unanswered = 0;
var timerRunning = false;
var questionTimer;
var answerTimer;
var questionInterval;
var answerInterval = 6;
var recordedAnswer = false;

// defines the questions object with all required info for each question
var questions = [
{
  question: "What is Michael Scott's middle name?",
  choices: ["Cary", "Garnett", "Gary", "Garrett"],
  correctAnswer: 2,
  imgSrc: "assets/images/q1.jpg",
  imgCaption: "It's Michael Gary Scott.",
  right: "Yup! You are true a fan. Hope you purchased his book!",
  wrong: "This is just sad...You're not a true Michael fan.",
  unansweredComment: "Time's up! Step up yo game!"
},
{
  question: "Michael Scott briefly dated his realtor. What was her name?",
  choices: ["Carol", "Erin", "Karen", "Holly"],
  correctAnswer: 0,
  imgSrc: "assets/images/q2.jpg",
  imgCaption: "Her name was Carol Stills. Fun fact: They're married in real life.",
  right: "Correct! Although, it didn't last very long like most of Michael's relationships.",
  wrong: "WROOOOOONG!",
  unansweredComment: "Time's up!"
},
{
  question: "Into what substance does Jim put Dwight's office supplies?",
  choices: ["Yogurt", "Jello", "Beets", "Peanut Butter"],
  correctAnswer: 1,
  imgSrc: "assets/images/q3.gif",
  imgCaption: "Yellow jello!",
  right: "Bravo! 'twas jello!",
  wrong: "False.",
  unansweredComment: "Time's up! Better luck next time."
},
{
  question: "Who does Michael hate the most?",
  choices: ["Dwight", "Meredith", "Jan", "Toby"],
  correctAnswer: 3,
  imgSrc: "assets/images/q4.jpg",
  imgCaption: "The picture above says it all...",
  right: "Precisely!",
  wrong: "How do you not know this...?",
  unansweredComment: "Time's up! How do you not know this...?"
},
{
  question: "What was the name of Angela's sick cat that Dwight killed?",
  choices: ["Angel Tail", "Mr. Longwhiskers", "Sprinkles", "Princess Puss"],
  correctAnswer: 2,
  imgSrc: "assets/images/q5.gif",
  imgCaption: "Her name was Sprinkles but at least Dwight got her a new cat...",
  right: "Right on!",
  wrong: "Uh-oh.",
  unansweredComment: "Time's up! Why's it taking you so long?!"
},
{
  question: "What does Todd Packer's vanity plate say?",
  choices: ["WLHUNG", "BGDADY", "LUVMKR", "URMOM!"],
  correctAnswer: 0,
  imgSrc: "assets/images/q6.gif",
  imgCaption: "You read that right!",
  right: "That's right!",
  wrong: "NOPE.",
  unansweredComment: "Oh come on...Time's up!"
},
{
  question: "What is Jan's baby's name?",
  choices: ["Astird", "Astrid", "Cece", "Sofia"],
  correctAnswer: 1,
  imgSrc: "assets/images/q7.gif",
  imgCaption: "Interesting choice for a name...",
  right: "Fabulous!",
  wrong: "Very disappointing...",
  unansweredComment: "Fine...this one's a little hard to remember"
},
{
  question: "Who is Dwight's cousin?",
  choices: ["Andy", "Jeb", "Dwide", "Mose"],
  correctAnswer: 3,
  imgSrc: "assets/images/q8.gif",
  imgCaption: "Fun fact: Mose is also the Producer and Writer for 'The Office'.",
  right: "Fantastic!",
  wrong: "How do you not know Mose?",
  unansweredComment: "Wow...hurry up next time!"
},
{
  question: "Which clothing item transforms Michael into Date Mike?",
  choices: ["A bandana", "A sumo suit", "A backwards golf cap", "A sequined glove"],
  correctAnswer: 2,
  imgSrc: "assets/images/q9.gif",
  imgCaption: "",
  right: "Bingo!",
  wrong: "Such a bummer.",
  unansweredComment: "You're kinda slow, aren't you?"
},
{
  question: "At Jim and Pam's wedding, what was Kevin wearing on his feet?",
  choices: ["Slippers", "Skiis", "Tissue boxes", "Nothing"],
  correctAnswer: 2,
  imgSrc: "assets/images/q10.gif",
  imgCaption: "Tissue boxes are a great idea!",
  right: "Hooray!",
  wrong: "Better luck next time.",
  unansweredComment: "That's a wrap!"
}];

// function to start the game
function startGame() {
  // unhides the score, time, and progress bar that are hidden at the beginning
  $("#score-box").removeClass("hideAtEnd");
  $("#time-box").removeClass("hideAtEnd");
  $("#bar").removeClass("hiddenAtStart");

  // calls function to display the next question
  displayNextQuestion();
}

// timer for questions screen that is 20s long
function decrementQuestionTimer() {
	questionInterval--;

	var currentTime = timeConverter(questionInterval);

	if (currentTime == "00:00"){
    // once end of the timer is reached, increment the number of unanswered questions
		clearInterval(questionTimer);

    // sets variable to use the 'unanswered' string on the answer screen
    correctOrNot = questions[questionCounter].unansweredComment;
    unanswered++;
    recordedAnswer = false;

    // calls function to display the answer screen
    displayAnswerScreen(questionCounter, correctOrNot);
	}

  // update the time label on the screen using the value of the currentTime
  $("#time-label").html(currentTime);

	 // console.log(currentTime);
}

// timer for answers screen that is 5s long
function decrementAnswerTimer() {
  answerInterval--;

  var currentTime = timeConverter(answerInterval);

  // once end of the timer is reached, move to the next question
  if (currentTime == "00:00"){
    clearInterval(answerTimer);
    timerRunning = false;
    // manually increment the question if no answer was recorded; otherwise it'll keep looping on the same question
    if (!recordedAnswer) {
      questionCounter++;
    }
    // console.log("Moving on to the next question..." + questionCounter);

    // reset the answer timer to 5s
    answerInterval = 5;
    if (questionCounter == questions.length) {
      // calls function to show the last screen of the game if the last question is reached
      gameOver();
    }
    else {
      // if end of quiz hasn't been reached, display the next question in the array
      displayNextQuestion();
    }
  }

  // update the time label on the screen using the value of the currentTime
  $("#time-label").text(currentTime);
}

function displayNextQuestion() {
	// console.log("Displaying next question");
  // empty out the quiz container on the main screen to make room for the next question
	quiz.empty();

  // restart the timer when new question is displayed and if it's not already running
	if (!timerRunning){
		// console.log("Resetting the timer");
		questionInterval = 20;
		questionTimer = setInterval(decrementQuestionTimer, 1000);
		timerRunning = true;
	}

  // if end of the quiz hasn't been reached, create a div to hold the question and progress bar
	if(questionCounter < questions.length){

    // variable to hold the question div
    var nextQuestion = createQuestionElement(questionCounter);

    // variable is appended to empty quiz div on page
    quiz.append(nextQuestion);
    // console.log("Questioncounter is : " + (questionCounter+1) + " and questions.length is " + questions.length);

    // creates a progress bar depending on the question number
    var bar = $('<div class="progress"><div class="progress-bar bg-success" role="progressbar" style="width: ' + ((questionCounter+1) / questions.length * 100) + '%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' + Math.floor((questionCounter+1) / questions.length * 100) + '%</div></div>');

    // appends the div to the page
    $("#bar").html(bar);

    // console.log("We're on question number " + questionCounter);

    // calls the checkAnswer function once the user clicks on a response
  	$(".btn-primary").on("click", checkAnswer);
  }
}

// function to create the question element that takes the current question number as a parameter
function createQuestionElement(index) {
  // creates an empty div and assigns the class card
  var questionDiv = $('<div>', {
    class: 'card'
  });
  
  // creates the header for the question and appends to the questionDiv
  var header = $('<h4 class="card-header text-center" id="question-number">Question '+(questionCounter+1)+':</h4>');
  questionDiv.append(header);

  // console.log("index value is " + index);

  // creates the actual question by accessing the questions object and using the index 
  var question = $('<div class="card-body text-center"> <h5 class="card-title" id="question">'+questions[index].question+'</h5></div>');
  questionDiv.append(question);

  // creates the 4 buttons in a for-loop using the questions object with the answers and the index
  for (var i = 0; i < 4; i++) {
    var answerChoices = $('<center><button id="hover-sound" type="button" class="btn btn-primary btn-lg buttonWidth" value='+i+'>'+questions[index].choices[i]+'</button></center><br>');
    questionDiv.append(answerChoices);
	}

  // returns the completed question div to display on the quiz screen
  return questionDiv;
}

// function to make the timers look pretty 
function timeConverter(t) {

    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    }

    else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

// function to check whether the user selected the correct answer
function checkAnswer(){
  // saves the value of the button clicked into a variable so that we can check it against the correct answer
	var buttonValue = $(this).attr("value");
	// console.log(questionCounter);
	// console.log(questions[questionCounter].correctAnswer);

  // checks whether the user's selection matches the correct answer defined in the questions array
	if (buttonValue == questions[questionCounter].correctAnswer){
    // increment the score if the answer is correct and update the label on the screen
		score++;
    $("#score-label").text(score);
    // picks out the string to display when the answer is correct
    correctOrNot = questions[questionCounter].right;
		//alert("CORRECT! Your current score is " + score + " out of " + questions.length + ".");
	}
	else {
		//alert("WRONG!");

    // picks out the string to display when the answer is incorrect
    correctOrNot = questions[questionCounter].wrong;
	}

  // reset the time
	timerRunning = false;

  // set recordedAnswer to true because the timer did not run out
  recordedAnswer = true;

  // clears the interval timer
	clearInterval(questionTimer);

  // calls a function to display the answer screen
	displayAnswerScreen(questionCounter, correctOrNot);

  // increments the question counter to move to the next one
	questionCounter++;
  // console.log(questionCounter);
}

// function to display the answer screen; it takes in the current index and the text to display depending on the user's answer (correct or incorrect)
function displayAnswerScreen(index, boolean) {

  // empties out the div on the page before appending the answer content
	quiz.empty();
	// console.log("Displaying answer Screen");

  // start the timer for the answer screen
  answerTimer = setInterval(decrementAnswerTimer, 1000);

  // creates an empty div and assigns the class card
  var answerScreen = $('<div>', {
    class: 'card'
  });
  
  // creates the header for the answer screen and appends it to the div
  var header = $('<h4 class="card-header text-center" id="answer-number">Answer</h4>');
  answerScreen.append(header);

  // creates the answer label for the answer screen and appends it to the div
  var answerLabel = $('<div class="card-body text-center"> <h5 class="card-title" id="boolean">'+boolean+'</h5></div>')
  answerScreen.append(answerLabel);

  // creates the picture for the answer screen and appends it to the div
  var picture = $('<div class="text-center"><img src="'+questions[index].imgSrc+'" alt="picture"></div>');
  answerScreen.append(picture);
  
  // creates the image caption for the answer screen and appends it to the div
  var caption = $('<div class="card-body text-center"> <h5 class="card-title" id="caption">'+questions[index].imgCaption+'</h5></div>');
  answerScreen.append(caption);

  // appends the entire answerScreen div to the quiz on the page
  quiz.append(answerScreen);
}

function gameOver() {
  // empties the quiz div to show the final screen screen
  quiz.empty();
  // console.log("Displaying the final screen");
  // answerTimer = setInterval(decrementAnswerTimer, 1000);

  // creates an empty div and assigns the class card
  var lastScreen = $('<div>', {
    class: 'card'
  });

  // hides the score and time boxes at the end by applying a created class to the divs
  $("#score-box").addClass("hideAtEnd");
  $("#time-box").addClass("hideAtEnd");
  
  // creates the header for the final screen and appends it to the div
  var header = $('<h4 class="card-header text-center" id="answer-number">Results</h4>');
  lastScreen.append(header);

  // creates the total score div for the final screen and appends it to the div
  var totalScore = $('<div class="card-body text-center"> <h2 class="card-title" id="boolean">Your total score was '+score+' out of 10.</h2></div>');
  lastScreen.append(totalScore);

  // 'if' conditions to determine what final words to display depending on the final score
  if (score === 10){
    var finalWords = $('<div class="card-body text-center"> <h4 class="card-title" id="boolean">Excellent job! You are a true fan of the show!</h4></div>');
    lastScreen.append(finalWords);

    var finalImage = $('<center><img src="assets/images/excellent.jpg"/></center>');

    lastScreen.append(finalImage);
    lastScreen.append(finalWords);
  }
  else if (score >= 8){
    var finalWords = $('<div class="card-body text-center"> <h4 class="card-title" id="boolean">Almost a perfect score. Good job :)</h4></div>');
    lastScreen.append(finalWords);
  }
  else if (score >= 5){
    var finalWords = $('<div class="card-body text-center"> <h4 class="card-title" id="boolean">Not bad but you can do better :)</h4></div>');
    lastScreen.append(finalWords);
  }
  else if (score < 5){
    var finalWords = $('<div class="card-body text-center"> <h4 class="card-title" id="boolean">That was a pretty big fail. Keep watching the show and try again later.</h4></div>');
    lastScreen.append(finalWords);
  }

  // creates the restart button for the final screen and appends it to the div
  var restartButton = $('<center><button type="button" class="btn btn-primary btn-lg buttonWidth" id="restart">Restart</button></center><br>');
  lastScreen.append(restartButton);

  // appends the div to the quiz container on the page
  quiz.append(lastScreen);

  // click function to restart the game if user taps the button. 
  $("#restart").on("click", function() {
    // console.log("click is being recorded");

    // resets the variables to start the game over
    score = 0;
    questionCounter = 0;
    unanswered = 0;
    timerRunning = false;
    questionTimer;
    answerTimer;
    questionInterval = 20;
    answerInterval = 5;
    ecordedAnswer = false;

    // resets the score on the page
    $("#score-label").text(score);

    // calls the function to start the game again
    startGame();
  });
}

// function to fetch the audio from the html page and play it
function playClip() {
  var audio = $("audio")[0];
  audio.play();
}

// use a document 'mouseenter' event for dynamically created buttons to play the audio file upon hover
$(document).on("mouseenter", "#hover-sound", function() {
  playClip();
});

// main function that waits for the user to click the 'start' button
$("#startButton").on("click", function() {
  // hides the start screen by adding the appropriate class
  $("#startTitle").addClass("hideUponStart");
  $("#startSection").addClass("hideUponStart");

  // shows the score panel when the game starts
  $("#scorePanel").removeClass("hiddenAtStart");

  // calls the function to start the game
  startGame();
});

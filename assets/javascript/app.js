var questionCounter = 0;
var quiz = $('#quiz');
var score = 0;
var unanswered = 0;
var timerRunning = false;
var questionTimer;
var answerTimer;
var questionInterval;
var answerInterval = 5;
var recordedAnswer = false;

var questions = [
{
  question: "What is Michael Scott's middle name?",
  choices: ["Cary", "Garnett", "Gary", "Garrett"],
  correctAnswer: 2,
  imgSrc: "assets/images/q1.jpg",
  imgCaption: "It's Michael Gary Scott.",
  right: "Yup! You are true a fan. Hope you purchased his book!",
  wrong: "This is just sad...You're not a true Michael fan."
},
{
  question: "Michael Scott briefly dated his realtor. What was her name?",
  choices: ["Carol", "Erin", "Karen", "Holly"],
  correctAnswer: 0,
  imgSrc: "assets/images/q2.jpg",
  imgCaption: "Her name was Carol Stills. Fun fact: They're married in real life.",
  right: "Correct! Although, it didn't last very long like most of Michael's relationships.",
  wrong: "WROOOOOONG!"
},
{
  question: "Into what substance does Jim put Dwight's office supplies?",
  choices: ["Yogurt", "Jello", "Beets", "Peanut Butter"],
  correctAnswer: 1,
  imgSrc: "assets/images/q3.gif",
  imgCaption: "Yellow jello!",
  right: "Bravo! 'twas jello!",
  wrong: "False."
},
{
  question: "Who does Michael hate the most?",
  choices: ["Dwight", "Meredith", "Jan", "Toby"],
  correctAnswer: 3,
  imgSrc: "assets/images/q4.jpg",
  imgCaption: "The picture above says it all...",
  right: "Precisely!",
  wrong: "How do you not know this...?"
},
{
  question: "What was the name of Angela's sick cat that Dwight killed?",
  choices: ["Angel Tail", "Mr. Longwhiskers", "Sprinkles", "Princess Puss"],
  correctAnswer: 2,
  imgSrc: "assets/images/q5.gif",
  imgCaption: "Her name was Sprinkles but at least Dwight got her a new cat...",
  right: "Right on!",
  wrong: "Uh-oh."
},
{
  question: "What does Todd Packer's vanity plate say?",
  choices: ["WLHUNG", "BGDADY", "LUVMKR", "URMOM!"],
  correctAnswer: 0,
  imgSrc: "assets/images/q6.gif",
  imgCaption: "You read that right!",
  right: "That's right!",
  wrong: "NOPE."
},
{
  question: "What is Jan's baby's name?",
  choices: ["Astird", "Astrid", "Cece", "Sofia"],
  correctAnswer: 1,
  imgSrc: "assets/images/q7.gif",
  imgCaption: "Interesting choice for a name...",
  right: "Fabulous!",
  wrong: "Very disappointing..."
},
{
  question: "Who is Dwight's cousin?",
  choices: ["Andy", "Jeb", "Dwide", "Mose"],
  correctAnswer: 3,
  imgSrc: "assets/images/q8.gif",
  imgCaption: "Fun fact: Mose is also the Producer and Writer for 'The Office'.",
  right: "Fantastic!",
  wrong: "How do you not know Mose?"
},
{
  question: "Who clothing item transforms Michael into Date Mike?",
  choices: ["A bandana", "A sumo suit", "A backwards golf cap", "A sequined glove"],
  correctAnswer: 2,
  imgSrc: "assets/images/q9.gif",
  imgCaption: "",
  right: "Bingo!",
  wrong: "Such a bummer."
},
{
  question: "At Jim and Pam's wedding, what was Kevin wearing on his feet?",
  choices: ["Slippers", "Skiis", "Tissue boxes", "Nothing"],
  correctAnswer: 2,
  imgSrc: "assets/images/q10.gif",
  imgCaption: "Tissue boxes are a great idea!",
  right: "Hooray!",
  wrong: "Better luck next time."
}];

function decrementQuestionTimer() {
	questionInterval--;

	var currentTime = timeConverter(questionInterval);

	if (currentTime == "00:00"){
		clearTimeout(questionTimer);
    correctOrNot = questions[questionCounter].wrong;
		// alert("Timer's Up!");
    unanswered++;
    recordedAnswer = false;
    displayAnswerScreen(questionCounter, correctOrNot);
	}

  $("#time-label").html(currentTime);

	 // console.log(currentTime);
}

function decrementAnswerTimer() {
  answerInterval--;

  var currentTime = timeConverter(answerInterval);

  if (currentTime == "00:00"){
    clearTimeout(answerTimer);
    timerRunning = false;
    if (!recordedAnswer) {
      questionCounter++;
    }
    console.log("Moving on to the next question..." + questionCounter);
    answerInterval = 5;
    if (questionCounter == 10) {
      gameOver();
    }
    else {
      displayNextQuestion();
    }
  }

  $("#time-label").html(currentTime);
}

function startGame() {
  $("#score-box").removeClass("hideAtEnd");
  $("#time-box").removeClass("hideAtEnd");
  $("#bar").removeClass("hiddenAtStart");
	displayNextQuestion();
}

function displayNextQuestion() {
	console.log("Displaying next question");
	quiz.empty();

	if (!timerRunning){
		console.log("Resetting the timer");
		questionInterval = 20;
		questionTimer = setInterval(decrementQuestionTimer, 1000);
		timerRunning = true;
	}

	if(questionCounter < questions.length){

    var nextQuestion = createQuestionElement(questionCounter);
    quiz.append(nextQuestion);
    console.log("Quetioncounter is : " + (questionCounter+1) + " and questions.length is " + questions.length);

    var bar = $('<div class="progress"><div class="progress-bar bg-success" role="progressbar" style="width: ' + Math.floor((questionCounter+1) / questions.length * 100) + '%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' + Math.floor((questionCounter+1) / questions.length * 100) + '%</div></div>');

    $("#bar").html(bar);

    console.log("We're on question number " + questionCounter);
  	$(".btn-primary").on("click", checkAnswer);
  }
}

function createQuestionElement(index) {
    var questionDiv = $('<div>', {
      class: 'card'
    });
    
    var header = $('<h4 class="card-header text-center" id="question-number">Question '+(questionCounter+1)+':</h4>');
    questionDiv.append(header);

    console.log("index value is " + index);

    var question = $('<div class="card-body text-center"> <h5 class="card-title" id="question">'+questions[index].question+'</h5></div>');
    questionDiv.append(question);

    for (var i = 0; i < 4; i++) {
	    var answerChoices = $('<center><button type="button" class="btn btn-primary btn-lg buttonWidth" value='+i+'>'+questions[index].choices[i]+'</button></center><br>');
	    questionDiv.append(answerChoices);
  	}

    return questionDiv;
}

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

function checkAnswer(){
	var buttonValue = $(this).attr("value");
	// console.log(questionCounter);
	// console.log(questions[questionCounter].correctAnswer);
	if (buttonValue == questions[questionCounter].correctAnswer){
		score++;
    $("#score-label").text(score);
    correctOrNot = questions[questionCounter].right;
		//alert("CORRECT! Your current score is " + score + " out of " + questions.length + ".");
	}
	else {
		//alert("WRONG!");
    correctOrNot = questions[questionCounter].wrong;
	}

	timerRunning = false;
  recordedAnswer = true;
	clearTimeout(questionTimer);
	displayAnswerScreen(questionCounter, correctOrNot);
	questionCounter++;
  console.log(questionCounter);
}

function displayAnswerScreen(index, boolean) {
	quiz.empty();
	console.log("Displaying answer Screen");

  answerTimer = setInterval(decrementAnswerTimer, 1000);

  var answerScreen = $('<div>', {
    class: 'card'
  });
  
  var header = $('<h4 class="card-header text-center" id="answer-number">Answer</h4>');
  answerScreen.append(header);

  var answerLabel = $('<div class="card-body text-center"> <h5 class="card-title" id="boolean">'+boolean+'</h5></div>')
  answerScreen.append(answerLabel);

  var picture = $('<div class="text-center"><img src="'+questions[index].imgSrc+'" alt="picture"></div>');
  answerScreen.append(picture);
  
  var caption = $('<div class="card-body text-center"> <h5 class="card-title" id="caption">'+questions[index].imgCaption+'</h5></div>');
  answerScreen.append(caption);

  quiz.append(answerScreen);
}

function gameOver() {
  quiz.empty();
  console.log("Displaying the final screen");
  // answerTimer = setInterval(decrementAnswerTimer, 1000);

  var lastScreen = $('<div>', {
    class: 'card'
  });

  $("#score-box").addClass("hideAtEnd");
  $("#time-box").addClass("hideAtEnd");
  
  var header = $('<h4 class="card-header text-center" id="answer-number">Results</h4>');
  lastScreen.append(header);

  var totalScore = $('<div class="card-body text-center"> <h2 class="card-title" id="boolean">Your total score was '+score+' out of 10.</h2></div>');
  lastScreen.append(totalScore);

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

  var restartButton = $('<center><button type="button" class="btn btn-primary btn-lg buttonWidth" id="restart">Restart</button></center><br>');
  lastScreen.append(restartButton);

  quiz.append(lastScreen);


  $("#restart").on("click", function() {
    console.log("click is being recorded");
    score = 0;
    questionCounter = 0;
    unanswered = 0;
    timerRunning = false;
    questionTimer;
    answerTimer;
    questionInterval = 20;
    answerInterval = 5;
    ecordedAnswer = false;
    $("#score-label").text(score);
    startGame();
  });
}

$("#startButton").on("click", function() {
  $("#startTitle").addClass("hideUponStart");
  $("#startSection").addClass("hideUponStart");
  $("#scorePanel").removeClass("hiddenAtStart");

  startGame();
});
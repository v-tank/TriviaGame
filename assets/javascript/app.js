var questionCounter = 0;
var quiz = $('#quiz');
var score = 0;
var unanswered = 0;
var timerRunning = false;
var questionTimer;
var answerTimer;
var questionInterval = 20;
var answerInterval = 5;

function decrementQuestionTimer() {
	questionInterval--;

	var currentTime = timeConverter(questionInterval);

	if (currentTime == "00:00"){
		clearTimeout(questionTimer);
    correctOrNot = questions[questionCounter].wrong;
		// alert("Timer's Up!");
    unanswered++;
    displayAnswerScreen(questionCounter, correctOrNot);
	}

  $("#time-label").html(currentTime);

	 console.log(currentTime);
}

function decrementAnswerTimer() {
  answerInterval--;

  var currentTime = timeConverter(answerInterval);

  if (currentTime == "00:00"){
    clearTimeout(answerTimer);

    console.log("Moving on to the next question...");
    answerInterval = 5;
    displayNextQuestion();
  }

  $("#time-label").html(currentTime);
}

function startGame() {
	$("#startButton").on("click", function() {
		$("#startSection").addClass("hideUponStart");
		$("#scorePanel").removeClass("hiddenAtStart");

		displayNextQuestion();
	});
}

var questions = [
{
	question: "What is Michael Scott's middle name?",
  choices: ["Cary", "Garnett", "Gary", "Garrett"],
  correctAnswer: 2,
  imgSrc: "assets/images/q1.jpg",
  imgCaption: "It's Michael Gary Scott.",
  right: "Correct! You are true a fan. Hope you purchased his book!",
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
  wrong: "This is just sad...You're not a true Michael fan."
},
{
	question: "Who does Michael hate the most?",
  choices: ["Dwight", "Meredith", "Jan", "Toby"],
  correctAnswer: 3,
  imgSrc: "",
  imgCaption: "It's Michael Gary Scott.",
  right: "Correct! You are true a fan. Hope you purchased his book!",
  wrong: "This is just sad...You're not a true Michael fan."
}];


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

  	$(".btn-primary").on("click", checkAnswer);
  }
}

function createQuestionElement(index) {
    var questionDiv = $('<div>', {
      class: 'card'
    });
    
    var header = $('<h4 class="card-header text-center" id="question-number">Question '+(questionCounter+1)+':</h4>');
    questionDiv.append(header);
    
    var question = $('<div class="card-body text-center"> <h5 class="card-title" id="question">'+questions[index].question+'</h5></div>');
    questionDiv.append(question);

    for (var i = 0; i < 4; i++) {
	    var answerChoices = $('<button type="button" class="btn btn-primary btn-lg " value='+i+'>'+questions[index].choices[i]+'</button><br>');
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
	clearTimeout(questionTimer);
	displayAnswerScreen(questionCounter, correctOrNot);
	questionCounter++;
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

  var picture = $('<div class="card-body text-center"><img src="'+questions[index].imgSrc+'" alt="test"></div>');
  answerScreen.append(picture);
  
  var caption = $('<div class="card-body text-center"> <h5 class="card-title" id="caption">'+questions[index].imgCaption+'</h5></div>');
  answerScreen.append(caption);

  quiz.append(answerScreen);
}

startGame();
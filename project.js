// Select elements from HTML
let questionNum = document.querySelector(".quiz .quest-num span");
let allQuests = document.querySelector(".all-quest .quests");
let testBody = document.querySelector(".test-body");
let answerBody = document.querySelector(".answers-body");
let submitBtn = document.querySelector(".submit-btn");
let nextBtn = document.querySelector(".next-btn");
let bullest = document.querySelector(".quests");
let resultConttainer = document.querySelector(".results");
let timerCount = document.querySelector(".timer");

let nowIndex = 0;
let correctAnswer = 0;
let countTimer;

function getQuestion() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            let questionsCount = questions.length;

            createQuestion(questionsCount);

            // Add question data
            addQuestionData(questions[nowIndex], questionsCount);

            // Start timer
            timer(1800, questionsCount);

            submitBtn.onclick = function () {
                let correctAnswerKey = questions[nowIndex].correct_answer;

                checkAnswer(correctAnswerKey, questionsCount);
                nowIndex++;

                // Check if all questions are answered
                if (nowIndex === questions.length) {
                    clearInterval(countTimer); // Stop the timer
                    resultShow(questionsCount); // Show results
                } else {
                    // Load the next question
                    testBody.innerHTML = "";
                    answerBody.innerHTML = "";
                    addQuestionData(questions[nowIndex], questionsCount);
                    coloredCircle();
                }
            };
        }
    };

    myRequest.open("GET", "question.json", true);
    myRequest.send();
}

getQuestion();

function createQuestion(num) {
    questionNum.innerHTML = num;

    for (let i = 0; i < num; i++) {
        // Create span for each question
        let circle = document.createElement("span");
        if (i === 0) {
            circle.className = "on";
        }
        allQuests.appendChild(circle);
    }
}

function addQuestionData(obj, count) {
    if (nowIndex < count) {
        // Create question title
        let qestTitle = document.createElement("h3");
        let qestText = document.createTextNode(obj.title);
        qestTitle.appendChild(qestText);
        testBody.appendChild(qestTitle);

        // Collect answers in an array
        let answers = [];
        for (let i = 1; i <= 4; i++) {
            answers.push({
                text: obj[`answer_${i}`],
                correct: obj[`answer_${i}`] === obj.correct_answer
            });
        }

        // Shuffle answers once
        answers = shuffleArray(answers);

        // Display the shuffled answers
        answers.forEach((answer, index) => {
            // Create main answer div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            // Create radio input
            let radioInput = document.createElement("input");
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${index + 1}`;
            radioInput.dataset.answer = answer.text;

            // Create label
            let answerLabel = document.createElement("label");
            answerLabel.htmlFor = `answer_${index + 1}`;
            answerLabel.appendChild(document.createTextNode(answer.text));

            // Add input and label to the main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(answerLabel);

            // Append the answer to the answers body
            answerBody.appendChild(mainDiv);
        });
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function checkAnswer(cAnswer, count) {
    let answers = document.getElementsByName("question");
    let answerSelected;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            answerSelected = answers[i].dataset.answer;
        }
    }

    if (cAnswer === answerSelected) {
        correctAnswer++;
    }
}

function coloredCircle() {
    let circleSpans = document.querySelectorAll(".all-quest .quests span");
    let spansArray = Array.from(circleSpans);
    spansArray.forEach((span, index) => {
        if (nowIndex === index) {
            span.className = "on";
        }
    });
}

function resultShow(count) {
    // Clear the UI and display results
    testBody.remove();
    answerBody.remove();
    submitBtn.remove();
    bullest.remove();

    let results;
    if (correctAnswer > count / 2 && correctAnswer < count) {
        results = `<span class="good">Very Good</span>, Your correct answer is ${correctAnswer} out of ${count}`;
    } else if (correctAnswer === count) {
        results = `<span class="perfect">Excellent</span>, Your score is 100% (${correctAnswer} out of ${count})`;
    } else {
        results = `<span class="fail">You need to study again</span>, Your correct answer is ${correctAnswer} out of ${count}`;
    }

    resultConttainer.innerHTML = results;
    resultConttainer.style.padding = "10px";
    resultConttainer.style.backgroundColor = "#C3F8AE";
    resultConttainer.style.marginTop = "10px";
}

function timer(duration, count) {
    let minutes, seconds;
    countTimer = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        timerCount.innerHTML = `${minutes}:${seconds}`;

        if (--duration < 0) {
            clearInterval(countTimer); // Stop the timer
            resultShow(count); // Show results when time is up
        }
    }, 1000);
}



// // select elements from html to deal with js
// let questionNum = document.querySelector(".quiz .quest-num span");
// let allQuests = document.querySelector(".all-quest .quests");
// let testBody = document.querySelector(".test-body");
// let answerBody = document.querySelector(".answers-body");
// let submitBtn = document.querySelector(".submit-btn");
// let nextBtn = document.querySelector(".next-btn");
// let bullest = document.querySelector(".quests");
// let resultConttainer = document.querySelector(".results");
// let timerCount = document.querySelector(".timer");

// let nowIndex = 0;
// let correctAnswer = 0;
// let countTimer;
// function getQuestion(){
//     let myRequest = new XMLHttpRequest();

//     myRequest.onreadystatechange = function(){
//         if(this.readyState === 4 && this.status ===200){
            

//             let questions = JSON.parse(this.responseText);
//             let questionsCount = questions.length;
            
//             createQuestion(questionsCount)

//             // add question data
//             addQuestionData(questions[nowIndex], questionsCount);


//             // start timer
//             timer(120,questionsCount);

//             submitBtn.onclick = function (){
//                 let correctAnswer = questions[nowIndex].correct_answer;

//                 checkAnswer(correctAnswer, questionsCount);
//                 nowIndex++;
//                 if (nowIndex === questions.length) {
//                     // Stop the timer and show results if all questions are answered
//                     clearInterval(countTimer);
//                     resultShow(questions.length);
//                 } else {
//                     // Clear the previous question and display the next one
//                     testBody.innerHTML = "";
//                     answerBody.innerHTML = "";
//                     addQuestionData(questions[nowIndex], questions.length);
//                     coloredCircle();
//                 }

//                 //delete previous question
//                 testBody.innerHTML="";
//                 answerBody.innerHTML="";

//                 // add next Question
//                 addQuestionData(questions[nowIndex], questionsCount);
    

//                 // make the circles colored when question show

//                 coloredCircle();

//                 // show result

//                 resultShow(questionsCount);

//             };
            

            
//         }
//     };

//     myRequest.open("GET", "question.json", true);
//     myRequest.send();
// }

// getQuestion();

// function createQuestion(num){
//     questionNum.innerHTML = num;

//     for (let i = 0; i < num; i++){
//         //creat span
//         let circle = document.createElement("span");
//         if( i === 0){
//             circle.className = "on";
//         }
//         // show span
//     allQuests.appendChild(circle);
//     }
    
// }
// function addQuestionData(obj, count){
//    if (nowIndex < count){
//     //create h3 
//    let qestTitle = document.createElement("h3");
//    //create qestion text
//    let qestText = document.createTextNode(obj.title);
//    //show question to h3
//    qestTitle.appendChild(qestText);
//    // add h3 to test body
//    testBody.appendChild(qestTitle);
//    //create answers
//   for (let i = 1; i <= 4; i++){
//     // create main answer
//     let mainDiv = document.createElement("div");
//     // add class to the previous div
//     mainDiv.className = "answer";

//     //create radio input
//     let radioInput = document.createElement("input");
//     // add 
//     radioInput.name = "question";
//     radioInput.type = "radio";
//     radioInput.id = `answer_${i}`;
//     radioInput.dataset.answer = obj[`answer_${i}`];

//     // create label
//     let answerLabel = document.createElement("label");
//     //add for to label tag
//     answerLabel.htmlFor = `answer_${i}`;

//     // create text
//     let textLabel = document.createTextNode(obj[`answer_${i}`]);

//     // add text to label
//     answerLabel.appendChild(textLabel);

//     // add radio to main div
//     mainDiv.appendChild(radioInput);
//     // add label to main div
//     mainDiv.appendChild(answerLabel);

//     answerBody.appendChild(mainDiv); 
//    }
//    }
// }

// function checkAnswer(cAnswer, count){
//    let answers = document.getElementsByName("question");
//    let answerSlected;
//    for ( let i = 0; i < answers.length; i++){
//     if (answers[i].checked){
//         answerSlected = answers[i].dataset.answer;
//     }
//    }
  

//    if (cAnswer === answerSlected){
//     correctAnswer++;
  
//    }
// }

// function coloredCircle() {
//     let circleSpans = document.querySelectorAll(".all-quest .quests span");
//     let spansArray = Array.from(circleSpans);
//     spansArray.forEach((span, index) => {
//         if (nowIndex === index) {
//             span.className = "on";
//         } 
//     });
// }
// function resultShow(count) {
//     // Avoid duplicate calls to this function
   
//         let results;
//         testBody.remove();
//         answerBody.remove();
//         submitBtn.remove();
//         bullest.remove();
    
//         if (correctAnswer > (count / 2) && correctAnswer < count) {
//             results = `<span class="good">Very Good</span>, Your correct Answer is ${correctAnswer} out of ${count}`;
//         } else if (correctAnswer === count) {
//             results =` <span class="perfect">Excellent</span>, Your Score is 100% (${correctAnswer} out of ${count})`;
//         } else {
//             results = `<span class="fail">You need to study again</span>, Your correct Answer is ${correctAnswer} out of ${count}`;
//         }
    
//         resultConttainer.innerHTML = results;
//         resultConttainer.style.padding = "10px";
//         resultConttainer.style.backgroundColor = "#C3F8AE";
//         resultConttainer.style.marginTop = "10px";
//     }




// function timer(duration, count) {
//     let minutes, seconds;
//     countTimer = setInterval(function () {
//         minutes = parseInt(duration / 60);
//         seconds = parseInt(duration % 60);

//         minutes = minutes < 10 ? `0${minutes}` : minutes;
//         seconds = seconds < 10 ? `0${seconds}` : seconds;

//         timerCount.innerHTML = `${minutes}:${seconds}`;

//         if (--duration < 0) {
//             clearInterval(countTimer); // Stop the timer
//             if (nowIndex < count) {
//                 resultShow(count); // Show the results only if there are unanswered questions
//             }
//         }
//     }, 1000);
// }


 
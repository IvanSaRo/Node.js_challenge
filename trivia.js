"use strict";
// Axios to manage GET petition to triviaAPI
const axios = require("axios");

// Readline is the perfect tool for this task, I can read inputs from the powershell without reload the script and lose all the info
let readline = require("readline");
let rl = readline.createInterface(process.stdin, process.stdout);

let response, questionsAnswers;
let questions = [];
let answers = [];
let correctAnswer = [];
let incorrectAnswers = [];
let randomAnswers = [];
let questionPlusAnswers = [];
let selectedAnswers = [];

rl.question(
  "Hi, welcome to the Powershell trivia, if you want to play enter p, if you want to see the scores enter s, enter something else to exit\n",
  (answer) => {
    // The user has entered p to play
    if (answer === "p") {
      // We check how many answers does the user wants and run a validation over the input
      rl.question("How many questions do you want?(max 20)\n", (answer) => {
        // We validate the input to prevent any failure geting the info from triviaApi
        if (isNaN(answer) || answer > 20 || answer <= 0) {
          rl.write(
            "Wrong answer, you have to enter a number between 1 and 20, please start again"
          );
          process.exit();
        }
        //  If the validation goes ok we pass the number of questions through parameter
        getTriviaQuestions(answer);
      });
    } else if (answer === "s") {
      console.log("scores");
    } else {
      process.exit();
    }
  }
);

// We get the number of answers by parameter
const getTriviaQuestions = async (numberOfQuestions) => {
  try {
    const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}`;

    response = await axios.get(url);
    questionsAnswers = response.data.results;
    // Once we got all the cuestions we have tosend it to be processed in order to show it correctly to the user
    manageAndPresentQuestions(questionsAnswers);
  } catch (error) {
    console.log(`getTrivialQuestions Failed. Error: ${error}`);
  }
};

// Here we are going to deconstruct the object and prepare it to show it to the user
const manageAndPresentQuestions = (questionsAnswers) => {
  questionsAnswers.forEach((element) => {
    correctAnswer.push(element.correct_answer);

    answers = [...element.incorrect_answers, element.correct_answer];

    randomAnswers = answers.sort(function () {
      return Math.random() - 0.5;
    });

    questionPlusAnswers.push({
      question: element.question,
      A: randomAnswers[0],
      B: randomAnswers[1],
      C: randomAnswers[2],
      D: randomAnswers[3],
    });

    // Now we have the question and the answers and the correct answer to check if the user has answered correctly, we are ready to send this information and show it to the user
  });

  showCuestions(questionPlusAnswers, correctAnswer);
};

// this function receives the questions and shows it to the user, also recives te correct answers to validate user´s answers
const showCuestions = (questions, correctAnswer) => {
  let respuestas = [];

  function pregunta(i) {
    process.stdout.write(JSON.stringify(questions[i]));
  }

  process.stdin.on("data", function (data) {
    respuestas.push(data.toString().trim().toUpperCase());

    if (respuestas.length < questions.length) {
      pregunta(respuestas.length);
    } else {
      console.log(respuestas);
      process.exit();
    }
  });

  pregunta(0);

  /*  let questionsLength = questions.length;

  for (let i = 0; i < questionsLength; i++) {

   
    
      ask(i);

  }
  function ask(i) {
    let pregunta = questions[i].toString(); 
    rl.question("holi", function () {
      rl.on("data", function (data) {
        selectedAnswers.push(data);

        if (selectedAnswers.length < questions.length) {
          ask(selectedAnswers.length);
        } else {
          process.exit();
        }
      });
    }); 
  } */
};

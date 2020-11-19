"use strict";
// Axios to manage GET petition to triviaAPI
const axios = require("axios");
const { type } = require("os");

// Readline is the perfect tool for this task, I can read inputs from the powershell without reload the script and lose all the info
let readline = require("readline");
let rl = readline.createInterface(process.stdin, process.stdout);

// Requiring fs module in which writeFile function is defined.
const fs = require("fs");

let response, questionsAnswers;
let answers = [];
let correctAnswer = [];
let randomAnswers = [];
let questionPlusAnswers = [];

// Here is where we start the cycle
rl.question(
  "Hi, welcome to the Powershell trivia, if you want to play enter p, if you want to see the scores enter s, enter something else to exit\n",
  (answer) => {
    // The user has entered p to play
    if (answer === "p" || answer === "P") {
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
    } else if (answer === "s" || answer === "S") {
      // We read the plain text document
      fs.readFile("Scores.txt", (err, data) => {
        if (err) {
          process.stdout.write("\nThere was a problem\n");
        } else {
          process.stdout.write(data);
          process.exit();
        }
      });
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
    answers = [...element.incorrect_answers, element.correct_answer];

    randomAnswers = answers.sort(function () {
      return Math.random() - 0.5;
    });
    // After getting the answers and randomize it we create the object with the question and the answers
    questionPlusAnswers.push({
      question: element.question,
      A: randomAnswers[0],
      B: randomAnswers[1],
      C: randomAnswers[2],
      D: randomAnswers[3],
    });

    // with this function we send the correct answer in a way that can be compared with the user selection, we send the key, not the value
    function getKeyByValue(object, value) {
      object.map((object) => {
        const correctKey = Object.keys(object).find(
          (key) => object[key] === value
        );
        correctAnswer.push(correctKey);
        correctAnswer = correctAnswer.filter(function (value) {
          return value != undefined;
        });
      });
    }

    getKeyByValue(questionPlusAnswers, element.correct_answer);

    // Now we have the question and the answers and the correct answer to check if the user has answered correctly, we are ready to send this information and show it to the user
  });

  showCuestions(questionPlusAnswers, correctAnswer);
};

// this function receives the questions and shows it to the user, also recives te correct answers to validate user´s answers
const showCuestions = (questions, correctAnswer) => {
  let userAnswers = [];

  function ask(i) {
    let processedQuestion = giveFormatToQuestionObject(questions[i]);
    process.stdout.write(processedQuestion);
  }

  process.stdin.on("data", function (data) {
    // Here we validate if user´s answer has the correct format

    data = data.toString().toUpperCase();

    if (data === "A" || data === "B" || data === "C" || data === "D") {
      userAnswers.push(data);

      if (userAnswers.length < questions.length) {
        ask(userAnswers.length);
      } else {
        let score = calculateScore(userAnswers, correctAnswer);
        process.stdout.write(
          "\nYour score is " + score + "% correct questions\n"
        );
        saveScore(score);
        process.exit();
      }
    } else {
      process.stdout.write(
        "\nYou have to enter a valid answer using a, b, c or d, please try again\n"
      );

      ask(userAnswers.length);
    }
  });

  ask(0);
};

// Here we take care of the way the user see the questions, in order, 1) we transform the object to string, the terminal can´t show an object 2) we delete symbols like "" or {} 3) because of step 2 we have to delete the blank space at the begining of the string 4) The first letter of the string (the q of question) must be in uppercase 5) we add lineBreaks to let the text breathe
const giveFormatToQuestionObject = (questionObject) => {
  let questionString = JSON.stringify(questionObject);

  questionString = questionString.replace(
    /[-!$%^*()_+|~=`{}\[\]";'<>?,.\/&]/g,
    " "
  );
  questionString = questionString.slice(2);
  questionString =
    questionString.charAt(0).toUpperCase() + questionString.slice(1);

  let lineBreak = "\n";
  questionString = questionString.concat(lineBreak);
  questionString = lineBreak + questionString;

  return questionString;
};

// here we are going to calculate the score
const calculateScore = (userAnswers, correctAnswer) => {
  let iterations = userAnswers.length;
  let points = 0;

  for (let i = 0; i < iterations; i++) {
    if (userAnswers[i] === correctAnswer[i]) {
      points++;
    }
  }
  // now we are returning the score in an appropriate format to show it and to store it
  return Math.trunc((points / userAnswers.length) * 100);
};

// Here is where we are going to save the score
const saveScore = (score) => {
  // Data which will write in a file.
  let date = new Date().toISOString();
  let data = "\n" + date + " " + score + "%";

  // Write data in 'Scores.txt' .
  fs.writeFileSync("Scores.txt", data, { flag: "a" });
};

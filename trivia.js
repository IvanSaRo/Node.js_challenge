"use strict";
// Axios to manage GET petition to triviaAPI
const axios = require("axios");

// Readline is the perfect tool for this task, I can read inputs from the powershell without reload the script and lose all the info
let readline = require("readline");
let rl = readline.createInterface(process.stdin, process.stdout);

let response, questionsAnswers;

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
    manageAndPresentQuestions(questionsAnswers);
    
  } catch (error) {
    console.log(`getTrivialQuestions Failed. Error: ${error}`);
  }
};


const manageAndPresentQuestions = (questionsAnswers) => {

    console.log(questionsAnswers);

}

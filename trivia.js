"use strict";

// Axios to manage GET petition to triviaAPI
const axios = require("axios");

// Readline is the perfect tool for this task, I can read inputs from the powershell without reload the script and lose all the info
let readline = require("readline");

let rl = readline.createInterface(process.stdin, process.stdout);


// We check how many answers does the user wants and run a validation over the input
rl.question("How many questions do you want?(max 20) ", (answer) => {
  if (isNaN(answer) || answer > 20 || answer <= 0) {
    rl.write(
      "Wrong answer, you have to enter a number between 1 and 20, please start again"
    );
    process.exit();
  }
});



const config = require("./config.js");

const url = "https://opentdb.com/api.php?amount=10";

const getTriviaQuestions = async () => {
  try {
    response = await axios.get(url);
    questionsAnswers = response.data.results;
    return questionsAnswers;
  } catch (error) {
    console.log(`getTrivialQuestions Failed. Error: ${error}`);
  }
};

// getTriviaQuestions();

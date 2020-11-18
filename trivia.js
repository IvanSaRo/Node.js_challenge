"use strict";

// Adding minimist to manage command line inputs
const argv = require("minimist")(process.argv.slice(2));
// Axios to manage GET petition to triviaAPI
const axios = require('axios');



const config = require("./config.js");

const url = config.triviaApiUrl;

const getTrivialQuestions = async () => {
    try {
      return await axios.get(url);
    } catch (error) {
      console.log(`getTrivialQuestions Failed. Error: ${error}`)
    }
  }

if (argv.o) {
    console.log(
      "Write node trivia -p to play, write node trivia -s to see scores"
    );
  }

  if(argv.p) {
    const showQuestions = async () => {
      const response = await getTrivialQuestions();
      console.log(response.data.results); 
    }
    showQuestions();
}
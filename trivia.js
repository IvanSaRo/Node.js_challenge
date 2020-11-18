"use strict";

const argv = require("minimist")(process.argv.slice(2));

const config = require("./config.js");

const url = config.triviaApiUrl;



if (argv.o) {
    console.log(
      "Write node trivia -p to play, write node trivia -s to see the scores"
    );
  }
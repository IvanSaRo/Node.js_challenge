"use strict";

const argv = require("minimist")(process.argv.slice(2));


if (argv.o) {
    console.log(
      "Write node trivia -p to play, write node trivia -s to see the scores"
    );
  }
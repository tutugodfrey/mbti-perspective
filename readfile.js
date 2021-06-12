const fs  = require('fs').promises;

async function readdata () {
  try {
    let data = await fs.readFile(__dirname + '/question.json')
    let questions = await JSON.parse(data);
    
    console.log(questions[0])
    console.log(questions)
  } catch(err) {
    console.log(err)
  }

}

readdata()

// node readfile.js // run the code
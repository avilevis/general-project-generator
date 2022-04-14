const chalk = require('chalk')
const inquirer = require('inquirer')

function questionList(questions) {
  return inquirer.prompt(questions).catch(error => {
    if (error.isTtyError) {
      console.log(chalk.red("Prompt couldn't be rendered in the current environment"))
    }

    return error
  })
}

module.exports = questionList

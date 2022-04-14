const chalk = require('chalk')
const { spawn } = require('child_process')

function runBashCommand(commandArr) {
  return new Promise(res => {
    const execCommand = spawn(...commandArr)

    execCommand.stdout.on('data', data => {
      //console.log(data.toString())
    })

    execCommand.stderr.on('data', data => {
      console.log(chalk.red(`stderr: ${data}`))
    })

    execCommand.on('error', error => {
      console.log(chalk.red(`error: ${error.message}`))
      res()
    })

    execCommand.on('close', code => {
      // console.log(`child process exited with code ${code}`)
      res()
    })
  })
}

module.exports = runBashCommand

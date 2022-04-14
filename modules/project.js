const chalk = require('chalk')
const { createDirectory } = require('./filesHandle')
const confirmQuestions = require('./question')
const { directoryExist } = require('./questionList.json')

async function createProjectDirectory(directoryName) {
  process.stdout.write(chalk.cyan('\nCreating Folder...'))
  const folderStatus = await createDirectory(directoryName)
  process.stdout.write(chalk.bgCyan(` ${folderStatus} \n`))
  if (folderStatus === 'Exist') {
    const answer = await confirmQuestions(directoryExist)

    if (!answer.directory) {
      console.log(chalk.bgYellow(' Create Project Canceled '))
      process.exit(0)
    }
  }
}

module.exports = {
  createProjectDirectory,
}

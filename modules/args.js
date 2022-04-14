const yargs = require('yargs')

const optionsArgs = yargs
  .usage('Usage: -n <project-name> -p <port>')
  .option('n', { alias: 'name', describe: 'Project name', type: 'string', demandOption: true })
  .option('p', { alias: 'port', describe: 'Project port', type: 'number', demandOption: false }).argv

module.exports = optionsArgs

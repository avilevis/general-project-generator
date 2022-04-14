const inquirer = require('inquirer')

function packageCheckBoxes(options) {
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'reptiles',
      message: 'Choose Packages to install:',
      choices: options,
    },
  ])
}

async function PackageListUI(packageInstallOptions) {
  const packageList = await packageCheckBoxes(packageInstallOptions)

  return packageList.reptiles
}

module.exports = PackageListUI

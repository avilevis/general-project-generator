#!/usr/bin/env node
const chalk = require('chalk')
const optionsArgs = require('../modules/args')
const PackageListUI = require('../modules/checkbox')
const { createProjectDirectory } = require('../modules/project')
const { packageInstallOptions, uniqueList, getPackagesFromNames, copyPackagesModule } = require('../modules/packages')
const { createPackageJson } = require('../modules/npm')
const dockerFileCreate = require('../modules/docker')

const { name: projectName, port: projectExposePort } = optionsArgs

async function createProject() {
  await createProjectDirectory(projectName)
  process.chdir(projectName)

  const packageNameList = await PackageListUI(packageInstallOptions)
  const packageNamesToAdd = await dockerFileCreate(process.cwd(), {
    name: projectName,
    projectExposePort: projectExposePort | 3000,
  })
  const packagesUniqueList = uniqueList(['default', ...packageNameList, ...packageNamesToAdd])
  const packagesToInstall = getPackagesFromNames(packagesUniqueList)
  const uniquePackagesToInstall = uniqueList(packagesToInstall)
  console.log(chalk.cyan(`Those packages will added: ${uniquePackagesToInstall.join(', ')}`))

  await createPackageJson(projectName, process.cwd(), packagesUniqueList)
  console.log(chalk.cyan.bold('package.json Created!'))

  process.stdout.write(chalk.cyan('Copy files...'))
  await copyPackagesModule(packagesUniqueList)
  process.stdout.write(chalk.bgCyan(' Done \n'))
}

createProject()
  .then(() => {
    console.log(chalk.green.bold('Done Creating Project!'))
  })
  .catch(err => {
    console.log(chalk.red.bold(err))
  })

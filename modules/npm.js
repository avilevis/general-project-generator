const path = require('path')
const _ = require('lodash')

const { readFile, writeFile } = require('./filesHandle')

const serviceDependencies = require('./serviceDependencies.json')

async function createPackageJson(projectName, projectPath, packageNameList) {
  const packageJsonContentBase = (
    await readFile(path.join(__dirname, '../basic_files/const/npm/package.json'))
  ).toString()

  const packageJsonContent = packageNameList.reduce((acc, packageName) => {
    return _.merge(acc, serviceDependencies[packageName].npm)
  }, JSON.parse(packageJsonContentBase))
  console.log(packageJsonContent)
  return writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify({ ...packageJsonContent, name: projectName }, null, 2)
  )
}

module.exports = {
  createPackageJson,
}

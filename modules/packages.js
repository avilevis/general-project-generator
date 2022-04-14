const path = require('path')

const serviceDependencies = require('./serviceDependencies.json')
const { directoryCopy } = require('./filesHandle')

function uniqueList(list) {
  return Array.from(new Set(list))
}

function getPackagesFromNames(packageNameList) {
  return packageNameList.map(packageObjName => serviceDependencies[packageObjName].packages).flat()
}

function getPackageModulePaths(packageName) {
  return serviceDependencies[packageName].modulePath
}

function copyPackageModulesFiles(packageName) {
  const modulePath = getPackageModulePaths(packageName)

  if (!modulePath) return Promise.resolve()

  const sourceModulePath = path.join(__dirname, '../basic_files', modulePath)
  const destinationModulePath = process.cwd()

  return directoryCopy(sourceModulePath, destinationModulePath)
}

async function copyPackagesModule(packageNameList) {
  for (const packageName of packageNameList) {
    await copyPackageModulesFiles(packageName)
  }
}

module.exports = {
  packageInstallOptions: Object.keys(serviceDependencies).filter(packageName => packageName !== 'default'),
  uniqueList,
  getPackagesFromNames,
  copyPackagesModule,
}

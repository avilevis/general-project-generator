const fs = require('fs').promises
const { existsSync } = require('fs')
const path = require('path')

function readFile(filePath) {
  return fs.readFile(filePath, { encoding: 'utf8' })
}

function writeFile(filePath, fileContent) {
  return fs.writeFile(filePath, fileContent, { encoding: 'utf8' })
}

function directoryFiles(directoryPath) {
  console.log('directoryFiles', directoryPath)
  return fs.readdir(directoryPath)
}

async function mergeTwoFiles(sourcePath, destinationPath) {
  const sourceFileContent = (await fs.readFile(sourcePath, { encoding: 'utf8' })).toString()
  const destinationFileContent = (await fs.readFile(destinationPath, { encoding: 'utf8' })).toString()

  await fs.writeFile(destinationPath, destinationFileContent + sourceFileContent, {
    encoding: 'utf8',
    mode: 0o666,
    flag: 'w',
  })
}

async function copyFile(sourcePath, destinationPath) {
  const fileExist = isExist(destinationPath)

  if (fileExist) {
    return mergeTwoFiles(sourcePath, destinationPath)
  }
  return fs.copyFile(sourcePath, destinationPath)
}

async function isDirectory(directoryPath) {
  return (await fs.stat(directoryPath)).isDirectory()
}

function isExist(elementPath) {
  return existsSync(elementPath)
}

function createDirectory(destinationPath) {
  const directoryExist = isExist(destinationPath)

  if (directoryExist) return 'Exist'

  return fs
    .mkdir(destinationPath)
    .then(() => 'Created')
    .catch(e => {
      if (e.errno === -17) return 'Exist'
      throw new Error(e)
    })
}

async function directoryCopy(sourceDirectoryPath, destinationDirectoryPath) {
  const fileList = (await directoryFiles(sourceDirectoryPath)).filter(file => !['.DS_Store'].includes(file))

  for (const fileName of fileList) {
    const sourceFilePath = path.join(sourceDirectoryPath, fileName)
    const destinationFilePath = path.join(destinationDirectoryPath, fileName)
    const directory = await isDirectory(sourceFilePath)
    if (directory) {
      await createDirectory(destinationFilePath)
      await directoryCopy(sourceFilePath, destinationFilePath)
      continue
    }

    await copyFile(sourceFilePath, destinationFilePath)
  }
}

async function replaceStringInFile(filePath, replaceString, newString) {
  const fileContent = (await readFile(filePath)).toString()
  const fileUpdateContent = fileContent.replaceAll(replaceString, newString)

  return writeFile(filePath, fileUpdateContent)
}

module.exports = {
  readFile,
  writeFile,
  createDirectory,
  directoryFiles,
  copyFile,
  directoryCopy,
  replaceStringInFile,
}

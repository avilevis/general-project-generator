const path = require('path')

const { directoryFiles, copyFile } = require('./filesHandle')
const basicFilePath = path.join(__dirname, '../', '/basic_files/const')

function copyFilesFromDirectory(projectPath, fileList) {
  const filePathList = fileList.map(fileName => [path.join(basicFilePath, fileName), path.join(projectPath, fileName)])
  return Promise.all(filePathList.map(filePaths => copyFile(...filePaths))).then(copyStatusList =>
    copyStatusList.every(Boolean)
  )
}

async function copyBasicFiles(projectPath) {
  const fileList = await directoryFiles(basicFilePath)

  return copyFilesFromDirectory(projectPath, fileList)
}

module.exports = {
  copyBasicFiles,
}

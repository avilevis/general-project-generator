const path = require('path')

const { readFile, writeFile, directoryCopy, replaceStringInFile } = require('./filesHandle')
const confirmQuestions = require('../modules/question')
const { dockerYml, dockerQuestionTemplate } = require('../modules/questionList.json')
const serviceDependencies = require('./serviceDependencies.json')

function dockerContainers() {
  return Object.entries(serviceDependencies)
    .map(([service, serviceObj]) => (serviceObj['dockerServiceFile'] ? service : null))
    .filter(Boolean)
}

function composeDockerQuestionList() {
  const containerNameList = dockerContainers()

  return containerNameList.map(name => {
    return {
      ...dockerQuestionTemplate,
      name,
      message: dockerQuestionTemplate.message.replace('${name}', name.toUpperCase()),
    }
  })
}

function concatServices(containerNameList) {
  const dockerServicesPath = path.join(__dirname, '../', '/basic_files/editing/docker-services')

  return Promise.all(
    containerNameList.map(serviceName => {
      return readFile(path.join(dockerServicesPath, serviceName))
    })
  )
}

async function placeServicesInFile(servicesList, projectObj) {
  const dockerFilePath = path.join(__dirname, '../', '/basic_files/editing', 'docker-compose.yml')
  const dockerFileContent = await readFile(dockerFilePath)

  return dockerFileContent
    .replace('${services}', servicesList.join('\n'))
    .replace(/\${projectName}/g, projectObj.name)
    .replace(/\${exposePort}/g, projectObj.projectExposePort)
}

function saveContentToFile(content, saveDirectoryPath, fileName) {
  const filePath = path.join(saveDirectoryPath, fileName)

  return writeFile(filePath, content)
}

function getServiceNameAndDockerYmlList(questionsRes) {
  return Object.entries(questionsRes).reduce(
    (acc, [containerObjName, installIt]) => {
      if (!installIt) return acc
      return {
        packageObjNames: [...acc.packageObjNames, containerObjName],
        dockerFiles: [...acc.dockerFiles, serviceDependencies[containerObjName].dockerServiceFile],
      }
    },
    {
      packageObjNames: [],
      dockerFiles: [],
    }
  )
}

async function addDockerBasicFiles(projectPath, projectObj) {
  const sourcePath = path.join(__dirname, '../basic_files/const/docker')

  await directoryCopy(sourcePath, projectPath)
  const dockerfilePath = path.join(projectPath, 'Dockerfile')

  return replaceStringInFile(dockerfilePath, '${exposePort}', projectObj.projectExposePort)
}

async function dockerYmlCreate(projectPath, projectObj) {
  const installDocker = await confirmQuestions([dockerYml])
  if (!installDocker.docker) return []

  const questionsRes = await confirmQuestions(composeDockerQuestionList())
  await addDockerBasicFiles(projectPath, projectObj)
  const { packageObjNames, dockerFiles } = getServiceNameAndDockerYmlList(questionsRes)
  const servicesString = await concatServices(dockerFiles)
  const dockerYmlContent = await placeServicesInFile(servicesString, projectObj)

  await saveContentToFile(dockerYmlContent, projectPath, 'docker-compose.yml')

  return packageObjNames
}

module.exports = dockerYmlCreate

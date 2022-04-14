## Generat Progect Generator

A node-cli app to generate project

#### Installation

After cloning the project, change directory to the project, install the project in npm global
```
sudo npm install -g .
```

#### creating project
```
projectInstaller --name <project name> --port <project expose port>
```
* please notice that your __expose port__ will be change if it reserved (by docker)
follow the instructions 

#### Docker build
```
cd <project name>
docker-compose build
```
#### Docker Run
```
npm install
```
#### Docker Run
```
docker-compose up
```

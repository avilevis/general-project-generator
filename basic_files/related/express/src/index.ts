require('dotenv').config()
import app from './app'

const { SERVER_PORT: serverPort } = process.env

app.listen(serverPort, () => {
  console.log(`Listen on port ${serverPort}...`)
})

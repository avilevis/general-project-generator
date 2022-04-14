const { createPublisher, qMessages } = require('deep-rabbit-handler')
const { Q_HOST: qHost, Q_name: qName, Q_user: qUser, Q_password: qPassword } = process.env

const publisher = createPublisher(qHost, qName, qUser, qPassword)

export const messages = qMessages
export default publisher

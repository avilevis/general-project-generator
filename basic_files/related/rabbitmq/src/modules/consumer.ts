const { createConsumer, qMessages } = require('deep-rabbit-handler')
const { MESSAGE_CALLBACK_VALIDATION_ERROR } = qMessages
const { Q_HOST: qHost, Q_name: qName, Q_user: qUser, Q_password: qPassword } = process.env

import { queueMessage, ISubscriber } from '../Interfaces/queue.interface'
import { messageSchema } from './validation'

class messageProcessor {
  constructor(private sub: ISubscriber, private actionOnMessage: any) {
    sub.subscribe(qName as string, this.receiveMessage.bind(this))
  }

  async parseMessage(msg: string) {
    try {
      const msgParse: queueMessage = JSON.parse(msg)

      return msgParse
    } catch (err) {
      throw new Error(`message parse error: ${err}`)
    }
  }

  async receiveMessage(message: string) {
    try {
      const parseMsg = await this.parseMessage(message)
      const messageValidation = messageSchema.validate(parseMsg)

      if (messageValidation.error?.details) {
        console.log(`${MESSAGE_CALLBACK_VALIDATION_ERROR}, ${messageValidation.error.details[0].message}`)
      } else {
        this.actionOnMessage(parseMsg)
      }

      return true
    } catch (err) {
      console.error('messageHandler', err)
      return true
    }
  }
}

function consumerInit(messageHandler: (message: object) => Promise<object>) {
  createConsumer(qHost, qName, qUser, qPassword).then((consumer: ISubscriber) => {
    new messageProcessor(consumer, messageHandler)
  })
}

export default consumerInit

const builder = require('../node_modules/botbuilder')
const formBuilder = require('../index.js')

let connector = new builder.ConsoleConnector().listen()
let bot = new builder.UniversalBot(connector)
let recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/263d4112-9ec8-4e89-baa7-f5bcdeb9f578?subscription-key=d79ce59b112e4f28b520818f69d74a20&timezoneOffset=0&verbose=true&q=')

// Try saying 'My phone number is 07888453254'.
// LUIS will identify this as a 'Phone' intent
// and recognise the number as a 'Number' entity.
let intents = new builder.IntentDialog({recognizers: [recognizer]})
  .matches('Phone', 'EntityExample')
  .onDefault((session) => {
    session.send('Sorry, I don\'t recognise what you\'re saying. Please try again.')
  })

bot.library(formBuilder.createLibrary())

bot.dialog('/', intents)

bot.dialog('EntityExample', [
  function (session, args, next) {
    formBuilder.entityCheck(args.entities, ['Number'], 0.7, function (data) {
      session.dialogData.entities = data
    })
    builder.Prompts.confirm(session, 'Do you want to proceed?')
  },
  function (session, results) {
    session.beginDialog('FormBuilder:/', {questions: questions, entities: session.dialogData.entities})
  },
  function (session, results) {
    console.info(results)
    session.endDialog('Thank you for completing the form.')
  }
])

let questions = [
  {
    field: 'Number',
    question: 'What is your mobile number?',
    prompt: 'Is this your phone number: {Number}?',
    validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
    repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
  },
  {
    field: 'Postcode',
    question: 'What is your postcode?'
  }
]

const builder = require('botbuilder')
const formBuilder = require('botbuilder-forms')

let connector = new builder.ConsoleConnector().listen()
let bot = new builder.UniversalBot(connector)
let recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4f6cd737-a487-4ea6-9db6-c2eb930ece6d?subscription-key=a8f65ef57fb44a4ab1dadbd61e0e4e66&staging=true&verbose=true&timezoneOffset=0&q=')

let intents = new builder.IntentDialog({recognizers: [recognizer]})
  .matches('Number', 'EntityExample')

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
    console.log(results)
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

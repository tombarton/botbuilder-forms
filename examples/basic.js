const builder = require('../node_modules/botbuilder')
const formBuilder = require('../index.js')

let connector = new builder.ConsoleConnector().listen()
var bot = new builder.UniversalBot(connector, [
  function (session) {
    session.beginDialog('FormBuilder:/', {questions: questions})
  },
  function (session, results) {
    console.log(results)
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

bot.library(formBuilder.createLibrary())

const assert = require('assert')
const builder = require('botbuilder')
const common = require('./common')
const formBuilder = require('../index')

describe('Bot Tests', () => {
  it('Local testing setup', (done) => {
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    bot.dialog('/', [
      function (session) {
        session.send('Testing')
      }
    ])
    bot.on('send', function (message) {
      assert(message.text === 'Testing')
      done()
    })
    connector.processMessage('start')
  })
  it('Form throws error if args are not supplied', (done) => {
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, function (session) {
        session.beginDialog('FormBuilder:/')
      })
    bot.on('error', function (err) {
      assert(err && err.message === 'Arguments were not supplied or were undefined')
      done()
    })
    connector.processMessage('start')
  })
  it('Form throws error if questions object is missing', (done) => {
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, function (session) {
        session.beginDialog('FormBuilder:/', {args: 'testing'})
      })
    bot.on('error', function (err) {
      assert(err && err.message === 'Missing questions array')
      done()
    })
    connector.processMessage('start')
  })
  it('First question of the array is asked', (done) => {
    var questions = [
      {
        field: 'Number',
        question: 'What is your mobile number?',
        prompt: 'Is this your phone number: {Number}?',
        validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
        repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      },
      {
        field: 'Name',
        question: 'What is your name?'
      }
    ]
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, function (session) {
        session.beginDialog('FormBuilder:/', {questions: questions})
      })
    bot.on('send', function (message) {
      assert(message.text === 'What is your mobile number?')
      done()
    })
    connector.processMessage('start')
  })
  it('Validation property is converted to a RegExp', (done) => {
    var questions = [
      {
        field: 'Number',
        question: 'What is your mobile number?',
        prompt: 'Is this your phone number: {Number}?',
        validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
        repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      }
    ]
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, function (session) {
        session.beginDialog('FormBuilder:/', {questions: questions})
      })
    common.testBot(bot, [
      {
        out: 'start'
      },
      {
        in: 'What is your mobile number?',
        out: '123'
      },
      {
        in: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      }
    ], done)
  })
  it('Multiple questions loop', (done) => {
    var questions = [
      {
        field: 'Number',
        question: 'What is your mobile number?',
        prompt: 'Is this your phone number: {Number}?',
        validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
        repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      },
      {
        field: 'Name',
        question: 'What is your name?'
      },
      {
        field: 'Postcode',
        question: 'What is your postcode?'
      }
    ]
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, function (session) {
        session.beginDialog('FormBuilder:/', {questions: questions})
      })
    common.testBot(bot, [
      {
        out: 'start'
      },
      {
        in: 'What is your mobile number?',
        out: '123'
      },
      {
        in: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447',
        out: '07775584261'
      },
      {
        in: 'What is your name?',
        out: 'Testing'
      },
      {
        in: 'What is your postcode?',
        out: 'Testing'
      }
    ], done)
  })
  it('Entity data', (done) => {
    var questions = [
      {
        field: 'Number',
        question: 'What is your mobile number?',
        prompt: 'Is this your phone number: {Number}?',
        validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
        repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      },
      {
        field: 'Name',
        question: 'What is your name?'
      }
    ]
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, [
        function (session) {
          session.beginDialog('FormBuilder:/', {questions: questions, entities: { 'Number': '07777777777' }})
        },
        function (session, results) {
          session.send('Complete')
        }
      ])
    common.testBot(bot, [
      {
        out: 'start'
      },
      {
        in: 'Is this your phone number: 07777777777?',
        out: 'Yes'
      },
      {
        in: 'What is your name?',
        out: 'Testing'
      },
      {
        in: 'Complete'
      }
    ], done)
  })
  it('Entity data reprompt', (done) => {
    var questions = [
      {
        field: 'Number',
        question: 'What is your mobile number?',
        prompt: 'Is this your phone number: {Number}?',
        validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
        repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      },
      {
        field: 'Name',
        question: 'What is your name?'
      }
    ]
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, [
        function (session) {
          session.beginDialog('FormBuilder:/', {questions: questions, entities: { 'Number': '07777777777' }})
        },
        function (session, results) {
          session.send('Complete')
        }
      ])
    common.testBot(bot, [
      {
        out: 'start'
      },
      {
        in: 'Is this your phone number: 07777777777?',
        out: 'No'
      },
      {
        in: 'What is your mobile number?',
        out: '07777777777'
      },
      {
        in: 'What is your name?',
        out: 'Testing'
      },
      {
        in: 'Complete'
      }
    ], done)
  })
  it('Multiple Entities', (done) => {
    var questions = [
      {
        field: 'Number',
        question: 'What is your mobile number?',
        prompt: 'Is this your phone number: {Number}?',
        validation: '^(07[0-9]{8,12}|447[0-9]{7,11})$',
        repromptText: 'Sorry, that doesn\'t look right. Please enter a valid mobile number beginning with 07 or +447'
      },
      {
        field: 'Postcode',
        question: 'What is your postcode?',
        prompt: 'Is this your postcode: {Postcode}?',
        repromptText: 'Sorry, that doesn\'t look right. Please try again.'
      }
    ]
    var connector = new builder.ConsoleConnector()
    var bot = new builder.UniversalBot(connector)
    bot.library(formBuilder.createLibrary())
    var dialog = new builder.IntentDialog()
    bot.dialog('/', dialog)
      .matches(/start/i, [
        function (session) {
          session.beginDialog('FormBuilder:/', {questions: questions, entities: { 'Number': '07777777777', 'Postcode': 'CB1 1PT' }})
        },
        function (session, results) {
          session.send('Complete')
        }
      ])
    common.testBot(bot, [
      {
        out: 'start'
      },
      {
        in: 'Is this your phone number: 07777777777?',
        out: 'Yes'
      },
      {
        in: 'Is this your postcode: CB1 1PT?',
        out: 'Yes'
      },
      {
        in: 'Complete'
      }
    ], done)
  })
})

# Form Builder

A simple module that allows you to easily add form flows to the Node Bot Builder SDK.

## Installation

  `npm install botbuilder-forms`

## Usage

  ```
  const builder = require('botbuilder')
  const formBuilder = require('botbuilder-forms')

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

  bot.library(formBuilder.createLibrary())```

### Questions

The questions object is passed into the dialog through the dialog arguments parameter. The questions object can consist of the following parameters:

  * field
  * question
  * prompt
  * validation
  * repromptText

The only mandatory properties are `field` and `question`, unless you are planning on passing entities as well, in which case the `prompt` and `repromptText` fields also become mandatory. The `validation` property consists of a regex string, which is later converted to a RegExp.

### Entities

Entities are passed in the dialog arguments parameter, in the exact same fashion as the question object:

```
  let entities = {
    Number: '07777777777'
  }
  var bot = new builder.UniversalBot(connector, [
    function (session) {
      session.beginDialog('FormBuilder:/', {questions: questions, entityData: entities})
    },
    function (session, results) {
      console.log(results)
    }
  ])
```

Ensure that the `field` properties of the questions matches the entities you are attempting to process.

### Tests

  `npm test`

### Contributing

Pull requests are more than welcome. Please ensure you abide by [Standard JS](https://standardjs.com/) coding standards.

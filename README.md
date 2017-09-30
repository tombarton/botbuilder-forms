# Form Builder

[![Build Status](https://travis-ci.org/tombarton/botbuilder-forms.svg?branch=master)](https://travis-ci.org/tombarton/botbuilder-forms)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm version](https://badge.fury.io/js/botbuilder-forms.svg)](https://badge.fury.io/js/botbuilder-forms)

A simple module that allows you to  add form flows to the Node [Bot Builder SDK](https://github.com/Microsoft/BotBuilder).

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

  bot.library(formBuilder.createLibrary())
  ```

### Questions

The questions object is passed into the dialog through the dialog arguments parameter. The questions object can consist of the following properties:

  * field
  * question
  * prompt
  * validation
  * repromptText

The only mandatory properties are `field` and `question`, unless you are planning on passing entities as well, in which case the `prompt` and `repromptText` fields also become mandatory. The `validation` property consists of a regex string, which is later converted to a RegExp.

### Entities

Entities can be passed to the form builder via the arguments parameter. In order to format them correctly, the `entityCheck` helper has been included. It takes the following arguments:

* {array} entities - An array of entity data that been returned from LUIS.
* {array} requirements - An array of entity titles that you want to detect.
* {integer} threshold - The minimum LUIS confidence threshold that you want each entity to meet.
* {function} callback - A callback to return the results.

 It can be used as following:

```
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
```

A working example can be found in `examples/entities.js`. Simple run `npm install` and `node examples/entities`.

### Examples

The following examples are available:

#### Basic

Basic form flow without LUIS entities. Run with `node examples/basic`.

#### Entities

Similar form flow to 'Basic' example, however, it makes use of the `entityCheck` helper to process any entities LUIS has identified. Run with `node examples/entities`.

### Tests

  `npm test`

### Contributing

Pull requests are more than welcome. Please ensure you abide by [Standard JS](https://standardjs.com/) coding standards.

const builder = require('botbuilder')
let lib = new builder.Library('FormBuilder')

lib.dialog('/', [
    (session, args) => {
        if (args !== null && typeof args !== 'undefined') {
            if (!args.questions) {
                return session.error('Missing questions array')
            } else {
                session.dialogData.questions = args.questions
            }
            session.dialogData.entities = args.entities ? args.entities : false
            session.dialogData.index = args.index ? args.index : 0
            session.dialogData.form = args.form ? args.form : {}
            session.dialogData.reprompt = args.reprompt ? args.reprompt : false
        } else {
            return session.error('Arguments were not supplied or were undefined')
        }

        let index = session.dialogData.index
        let questions = session.dialogData.questions

        // Check if entities exists
        if (session.dialogData.entities) {
            // If the entities exists and it possesses the property for this question, send a confirm prompt
            if (session.dialogData.entities.hasOwnProperty(questions[index].field)) {
                var prompt = questions[session.dialogData.index].prompt
                // Replace placeholder text with user data
                prompt = session.localizer.gettext(session.preferredLocale(), prompt)
                prompt = prompt.replace('{' + questions[index].field + '}', session.dialogData.entities[questions[index].field])
                builder.Prompts.confirm(session, prompt)
            } else {
                if (!session.dialogData.reprompt) {
                    builder.Prompts.text(session, session.localizer.gettext(session.preferredLocale(), questions[index].question))
                } else {
                    // If reset boolean is true, send reprompt text
                    delete session.dialogData.reprompt
                    builder.Prompts.text(session, session.localizer.gettext(session.preferredLocale(), questions[index].repromptText))
                }
            }
        } else {
            if (!session.dialogData.reprompt) {
                builder.Prompts.text(session, session.localizer.gettext(session.preferredLocale(), questions[index].question))
            } else {
                // If reset boolean is true, send reprompt text
                delete session.dialogData.reprompt
                builder.Prompts.text(session, session.localizer.gettext(session.preferredLocale(), questions[index].repromptText))
            }
        }
    },
    (session, results) => {
        let questions = session.dialogData.questions
        let currentQuestion = questions[session.dialogData.index]
        if (typeof results.response !== 'string') {
            if (!results.response) {
                var field = questions[session.dialogData.index].field
                delete session.dialogData.entities[field]
            } else if (currentQuestion.hasOwnProperty('validation')) {
                let validation = new RegExp(currentQuestion.validation)
                if (validation.test(session.dialogData.entities[currentQuestion.field])) {
                    field = questions[session.dialogData.index++].field
                    session.dialogData.form[field] = session.dialogData.entities[field]
                } else {
                    field = questions[session.dialogData.index].field
                    session.dialogData.reprompt = true
                    delete session.dialogData.entities[field]
                }
            } else {
                field = questions[session.dialogData.index++].field
                session.dialogData.form[field] = session.dialogData.entities[field]
            }
        } else {
            if (currentQuestion.hasOwnProperty('validation')) {
                let validation = new RegExp(currentQuestion.validation)
                if (validation.test(results.response)) {
                    field = questions[session.dialogData.index++].field
                    session.dialogData.form[field] = results.response
                } else {
                    field = questions[session.dialogData.index].field
                    session.dialogData.reprompt = true
                }
            } else {
                field = questions[session.dialogData.index++].field
                session.dialogData.form[field] = results.response
            }
        }

        // Check for end of form
        if (session.dialogData.index >= questions.length) {
            // Return to original dialog
            session.endDialogWithResult({ formData: session.dialogData.form })
        } else {
            // Next field
            session.replaceDialog('/', session.dialogData)
        }
    }
])

module.exports.createLibrary = () => {
    return lib.clone()
}

module.exports.entityCheck = (entities, requirements, entityThreshold, callback) => {
    var result = {}
    for (var entity in entities) {
        if (entities[entity].score >= entityThreshold) {
            for (var requirement in requirements) {
                if (entities[entity].type === requirements[requirement]) {
                    result[requirements[requirement]] = entities[entity].entity
                }
            }
        }
    }
    callback(result)
}

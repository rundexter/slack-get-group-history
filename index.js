var util = require('./util.js'),
    _ = require('lodash'),
    SlackClient = require('slack-node');

var pickInputs = {
        'name': 'name'
    },
    pickOutputs = {
        'ok': 'ok',
        'latest': 'latest',
        'has_more': 'has_more',
        'messages_user': 'messages.user',
        'messages_text': 'messages.text'
    };

module.exports = {
    /**
     * Allows the authenticating users to follow the user specified in the ID parameter.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            token = dexter.provider('slack').credentials('access_token'),
            slack = new SlackClient(token);

        if (validateErrors)
            return this.fail(validateErrors);

        slack.api.groups.history(inputs, function (error, data) {
            if (error)
                this.fail(error);
            else
                this.complete(util.pickOutputs(data, pickOutputs));
        }.bind(this));
    }
};

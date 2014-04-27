(function () {
    'use strict';

    var _ = require('lodash');
    var Promise = require('bluebird');
    var Entity = require('../lib/entity');
    var ValidationError = require('../lib/validationError');

    var schema = {
        title: 'Script',
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1
            },
            type: {
                type: 'string',
                minLength: 1
            },
            startPageId: {
                type: 'string',
                minLength: 1
            }
        },
        required: ['name', 'type', 'startPageId']
    };

    function Script (name, provider, properties) {
        properties = _.extend({
            name: name,
            type: 'myType',
            startPageId: '1'
        }, properties);

        Entity.call(this, provider, properties, schema);
    }

    Script.prototype = Object.create(Entity.prototype);
    Script.prototype.constructor = Script;

    Script.prototype.print = function Script_print () {
        console.log('Script ' + this.name + ':');
        console.log('\tid: ' + this.id);
        console.log('\tcreatedDate: ' + this.createdDate);
        console.log('\tmodifiedDate: ' + this.modifiedDate);
        console.log('\ttype: ' + this.type);
        console.log('\tstartPageId: ' + this.startPageId);
    };

    Script.prototype._additionalValidation = function Script_additionalValidation () {
        if (this.name === 'argh') {
            return Promise.resolve(new ValidationError('Calm down!', 'name'));
        }

        return Promise.resolve();
    };

    module.exports = Script;
}());

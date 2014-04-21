(function () {
    'use strict';

    var _ = require('lodash');
    var Entity = require('../lib/entity');

    function Script (name, provider, properties) {
       properties = _.extend({
            name: name,
            type: 'myType',
            startPageId: '1'
        }, properties);

        Entity.call(this, provider, properties);
    }

    Script.prototype = Object.create(Entity.prototype);
    Script.prototype.constructor = Script;

    Script.prototype.print = function Script_print () {
        console.log('Script ' + this.name + ':');
        console.log('\tid: ' + this.id);
        console.log('\ttype: ' + this.type);
        console.log('\tstartPageId: ' + this.startPageId);
    };

    var superValidate = Script.prototype.validate;
    Script.prototype.validate = function Script_validate () {
        var self = this;

        return superValidate.call(this).then(function (results) {
            if (!self.name) {
                results.push({ prop: 'name', message: 'name must be set' });
            }

            return results;
        });
    };

    module.exports = Script;
}());

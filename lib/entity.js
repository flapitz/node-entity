(function () {

    'use strict';

    var uuid = require('node-uuid');
    var	_ = require('lodash');
    var	Promise = require('bluebird');

    /**
     * Base constructor for objects needing to be saved to a data-store.
     * @constructor
     * @param provider {object} The data-store provider to use.
     * @param properties {object} The default properties to use for this entity.
     */
    function Entity (provider, properties) {
        // Use default properties, where necessary
        properties = _.extend({
            id: uuid.v4()
        }, properties);

        this.provider = provider;

        _.extend(this, properties);
    }

    /**
     * Saves this entity, if valid.
     * @returns {object} A promise that will indicate success, as well as hold validation errors, if any.
     */
    Entity.prototype.save = function Entity_save () {
        var self = this;

        // Validate the entity first
        return self.validate().then(function (results) {
            if (results.length > 0) {
                return results;
            }

            return self.provider.save(self);
        });
    };

    /**
     * Destroys this entity.
     * @returns {object} A promise that will indicate success.
     */
    Entity.prototype.destroy = function Entity_destroy () {
        return this.provider.destroy(this.id);
    };

    /**
     * Validates this entity.
     * @returns {object} A promise that will indicate success, as well as hold validation errors, if any.
     */
    Entity.prototype.validate = function Entity_validate () {
        var results = [];

        if (!this.id) {
            results.push({ prop: 'id', message: 'id must be set' });
        }

        return Promise.resolve(results);
    };

    /**
     * Determines whether or not this entity is valid.
     * @returns {object} A promise that will indicate success, as well as whether or not this entity is valid.
     */
    Entity.prototype.isValid = function Entity_isValid (cb) {
        var self = this;

        return self.validate().then(function (results) {
            if (results.length > 0) {
                return false;
            }

            return true;
        });
    };

    module.exports = Entity;
}());

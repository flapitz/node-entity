(function () {

    'use strict';

    var uuid = require('node-uuid');
    var	_ = require('lodash');
    var	Promise = require('bluebird');
    var tv4 = require('tv4');
    var ValidationError = require('./validationError');

    /**
     * Base constructor for objects needing to be saved to a data-store.
     * @constructor
     * @param provider {object} The data-store provider to use.
     * @param properties {object} The default properties to use for this entity.
     * @param schema {object} (optional) The JSON schema to use for validating this entity.
     */
    function Entity (provider, properties, schema) {
        // Use default properties, where necessary
        properties = _.extend({
            id: uuid.v4(),
            createdDate: null,
            modifiedDate: null
        }, properties);

        this.provider = provider;
        this.schema = schema || {};

        // Add id validation, if not already present (allowing overrides)
        this.schema.properties = this.schema.properties || {};
        this.schema.properties.id = this.schema.properties.id || {
            type: 'string',
            minLength: 1
        };

        // Add id as a required property, if not already present
        this.schema.required = this.schema.required || [];
        if (!_.contains(this.schema.required, 'id')) {
            this.schema.required.push('id');
        }

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

            // Update our modified and created dates, if necessary
            var curDate = Date.now();

            if (self.isNew()) {
                self.createdDate = new Date(curDate);
            }

            self.modifiedDate = new Date(curDate);

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

        if (this.schema) {
            results = _.map(tv4.validateMultiple(this, this.schema).errors, function (curError) {
                return new ValidationError(curError.message, curError.dataPath);
            });
        }

        return this._additionalValidation().then(function (additionalResults) {
            results = results.concat(additionalResults || []);
            return results;
        });
    };

    /**
     * Override this function to provide additional validation, if necessary, during a validate call.
     * @returns {object} A promise that will indicate success, as well as hold validation errors, if any.
     */
    Entity.prototype._additionalValidation = function Entity__additionalValidation() {
        return Promise.resolve();
    };

    /**
     * Determines whether or not this entity is valid.
     * @returns {object} A promise that will indicate success, as well as whether or not this entity is valid.
     */
    Entity.prototype.isValid = function Entity_isValid () {
        var self = this;

        return self.validate().then(function (results) {
            if (results.length > 0) {
                return false;
            }

            return true;
        });
    };

    /**
     * Determines whether or not this entity has been saved.
     * @returns {boolean} True, if this entity has not been saved; false otherwise.
     */
    Entity.prototype.isNew = function Entity_isNew () {
        return !this.createdDate;
    };

    module.exports = Entity;
}());

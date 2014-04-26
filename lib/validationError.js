(function () {
    'use strict';

    /**
     * Constructor for validation errors.
     * @constructor
     * @param message {string} A message representing the validation error.
     * @param property {string} (optional) The property that the validation error occured on, if possible.
     */
    function ValidationError (message, property) {
        this.message = message;
        this.property = property;
    }

    module.exports = ValidationError;
}());
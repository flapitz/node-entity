(function () {
    var uuid = require('node-uuid'),
    	_ = require('lodash');
    
    function Entity (provider, properties) {
        properties = _.extend({
            id: uuid.v4()
        }, properties);

        this.provider = provider;

        _.extend(this, properties);
    }

    Entity.prototype.save = function Entity_save (cb) {
        var self = this;

        // Validate the entity first
        self.validate(function (err, results) {
            if (err) { return cb(err); }

            if (results.length > 0) {
                return cb && cb(null, results);
            }

            self.provider.save(self, cb);
        });
    };

    Entity.prototype.destroy = function Entity_destroy (cb) {
        this.provider.destroy(this.id, cb);
    };

    Entity.prototype.validate = function Entity_validate (cb) {
        var results = [];

        if (!this.id) {
            results.push({ prop: 'id', message: 'id must be set' });
        }

        return cb(null, results);
    };

    Entity.prototype.isValid = function Entity_isValid (cb) {
        var self = this;

        self.validate(function (err, results) {
            if (err) { return cb(err); }

            if (results.length > 0) {
                return cb(null, false);
            }

            return cb(null, true);
        });
    };

    module.exports = Entity;
}());

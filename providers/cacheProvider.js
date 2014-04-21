(function () {
    var entities = {};

    exports.save = function cacheProvider_save (entity, cb) {
        entities[entity.id] = entity;
        cb();
    };

    exports.destroy = function cacheProvider_destroy (entityId, cb) {
        delete entities[entityId];
        cb();
    };

    exports.getAll = function cacheProvider_getAll (cb) {
        var results = [];
        for (var entityId in entities) {
            results.push(entities[entityId]);
        }
        return cb(null, results);
    };

    exports.getById = function cacheProvider_getById (id, cb) {
        return cb(null, entities[id]);
    };

    exports.getByFilter = function cacheProvider_getByFilter (filter, cb) {
        var results = [];
        for (var entityId in entities) {
            if (filter(entities[entityId])) {
                results.push(entities[entityId]);
            }
        }
        return cb(null, results);
    };
}());

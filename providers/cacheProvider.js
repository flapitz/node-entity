(function () {
    var Promise = require('bluebird');

    // Memory database
    var entities = {};

    /**
     * Saves the given entity to the memory database.
     * @params entity {object} The entity to save.
     * @returns {object} A promise that will indicate success.
     */
    exports.save = function cacheProvider_save (entity) {
        entities[entity.id] = entity;
        return Promise.resolve();
    };

    /**
     * Destroys the given entity from the memory database.
     * @params entityId {string} The id of the entity to destroy.
     * @returns {object} A promise that will indicate success.
     */
    exports.destroy = function cacheProvider_destroy (entityId) {
        delete entities[entityId];
        return Promise.resolve();
    };

    /**
     * Gets all of the entities from the memory database.
     * @returns {object} A promise that will indicate success, as well as hold the list of entities.
     */
    exports.getAll = function cacheProvider_getAll () {
        var results = [];
        for (var entityId in entities) {
            results.push(entities[entityId]);
        }
        return Promise.resolve(results);
    };

    /**
     * Gets an entity from the memory database by its id.
     * @params id {string} The id of the entity to get.
     * @returns {object} A promise that will indicate success, as well as hold the entity.
     */
    exports.getById = function cacheProvider_getById (id) {
        return Promise.resolve(entities[id]);
    };

    /**
     * Gets all entities from the memory database that match the given filter.
     * @params filter {function} The filter to run on each entity, which should take the entity in as a parameter, and return true, if it should be include, or false otherwise.
     * @returns {object} A promise that will indicate success, as well as hold the list of entities that match the filter.
     */
    exports.getByFilter = function cacheProvider_getByFilter (filter) {
        var results = [];
        for (var entityId in entities) {
            if (filter(entities[entityId])) {
                results.push(entities[entityId]);
            }
        }
        return Promise.resolve(results);
    };
}());

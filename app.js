var Promise = require('bluebird');
var cacheProvider = require('./providers/cacheProvider');
var Script = require('./models/script');

// Create some new scripts
var script1 = new Script('tester', cacheProvider, {
    type: 'foo',
    startPageId: 'bar'
});
var script2 = new Script('foobar', cacheProvider, {
    type: 'baz',
    startPageId: 'bazinga'
});
var script3 = new Script('barbaz', cacheProvider);

// Save the first script
script1.save().then(function (results) {
    if (results && results.length > 0) {
        console.log('Validation errors while saving script ' + script1.name + ':');
        console.log(results);
        return;
    }

    console.log('Successfully saved ' + script1.name);
}).then(function () {
    // Save the second script
	return script2.save().then(function (results) {
        if (results && results.length > 0) {
            console.log('Validation errors while saving script ' + script2.name + ':');
            console.log(results);
        }

        console.log('Successfully saved ' + script2.name);
	});
}).then(function () {
    // Get all scripts created so far
    return cacheProvider.getAll().then(function (scripts) {
        console.log('Getting all scripts:');
        scripts.forEach(function (curScript) {
            curScript.print();
        });
    });
}).then(function () {
    // Update the 3rd script, and save it
    script3.type = 'hello world';

    return script3.save().then(function (results) {
        if (results && results.length > 0) {
            console.log('Validation errors while saving script ' + script3.name + ':');
            console.log(results);
            return;
        }

        console.log('Successfully saved ' + script3.name);
    });
}).then(function () {
    // Get all scripts by a filter
    return cacheProvider.getByFilter(function (curScript) {
        return curScript.name.indexOf('bar') >= 0;
    }).then(function (scripts) {
        console.log('Getting all scripts that contain the word "bar":');
        scripts.forEach(function (curScript) {
            curScript.print();
        });
    });
}).then(function () {
    // Try to save an invalid script
    delete script3.id;
    script3.name = 'argh';
    script3.type = null;
    script3.startPageId = null;

    return script3.save().then(function (results) {
        if (results && results.length > 0) {
            console.log('Validation errors while saving script ' + script3.name + ':');
            console.log(results);
            return;
        }

        console.log('Successfully saved ' + script3.name);
    });
});

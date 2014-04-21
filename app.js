var cacheProvider = require('./providers/cacheProvider');
var Script = require('./models/script');

var script1 = new Script('tester', cacheProvider, {
    type: 'foo',
    startPageId: 'bar'
});
var script2 = new Script('foobar', cacheProvider, {
    type: 'baz',
    startPageId: 'bazinga'
});

script1.save(function (err, results) {
    if (err) { return console.log('Error: ' + err); }

    if (results && results.length > 0) {
        console.log('Validation errors while saving script ' + script1.name + ':');
        console.log(results);
        return;
    }

    console.log('Successfully saved ' + script1.name);
});

script2.save(function (err, results) {
    if (err) { return console.log('Error: ' + err); }

    if (results && results.length > 0) {
        console.log('Validation errors while saving script ' + script2.name + ':');
        console.log(results);
        return;
    }

    console.log('Successfully saved ' + script2.name);
});

console.log('Getting all scripts:');
cacheProvider.getAll(function (err, scripts) {
    scripts.forEach(function (curScript) {
        curScript.print();
    });
});

var script3 = new Script('barbaz', cacheProvider);

script3.type = 'hello world';

script3.save(function (err, results) {
    if (err) { return console.log('Error: ' + err); }

    if (results && results.length > 0) {
        console.log('Validation errors while saving script ' + script3.name + ':');
        console.log(results);
        return;
    }

    console.log('Successfully saved ' + script3.name);
});

console.log('Getting all scripts that contain the word "bar":');
cacheProvider.getByFilter(function (curScript) {
    return curScript.name.indexOf('bar') >= 0;
}, function (err, scripts) {
    scripts.forEach(function (curScript) {
        curScript.print();
    });
});

script3.id = null;
script3.name = '';

var results;

script3.save(function (err, results) {
    if (err) { return console.log('Error: ' + err); }

    if (results && results.length > 0) {
        console.log('Validation errors while saving script ' + script3.name + ':');
        console.log(results);
        return;
    }

    console.log('Successfully saved ' + script3.name);
});

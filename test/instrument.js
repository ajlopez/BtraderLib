
var btlib = require('..');
var sl = require('simplelists');

exports['get aluar with historical data'] = function (test) {
    var toDate = new Date();
    var fromDate = new Date(toDate.getFullYear() - 3, toDate.getMonth(), toDate.getDate());
    
    test.async();
    
    btlib.getInstrument('ALUA', fromDate, toDate, function (err, data) {
        test.ok(!err);
        test.ok(data);
        
        test.done();
    });
};

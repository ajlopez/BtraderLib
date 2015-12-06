
var btlib = require('..');
var sl = require('simplelists');

exports['get MERVAL instruments'] = function (test) {
    test.async();
    
    btlib.getInstruments('index/MERV', function (err, data) {
        test.ok(!err);
        console.dir(data);
        test.ok(data);
        test.equal(data.code, "BCBA");
        test.equal(data.name, "Bolsa de Valores de Buenos Aires");
        
        test.equal(data.openTime, "11:00");
        test.equal(data.closeTime, "17:00");
        
        test.ok(data.openDays);
        test.ok(Array.isArray(data.openDays));
        test.equal(data.openDays.length, 5);
        test.ok(data.openDays.indexOf('Monday') >= 0);
        test.ok(data.openDays.indexOf('Tuesday') >= 0);
        test.ok(data.openDays.indexOf('Wednesday') >= 0);
        test.ok(data.openDays.indexOf('Thursday') >= 0);
        test.ok(data.openDays.indexOf('Friday') >= 0);
        
        test.ok(data.instruments);
        test.ok(Array.isArray(data.instruments));
        test.ok(data.instruments.length);
        
        test.ok(sl.exist(data.instruments, { symbolCode: "ALUA", name: "Aluar Aluminio Argentino SAIC", type: "equity" }));
        test.ok(sl.all(data.instruments, function (item) { return item.data; }));
        
        test.done();
    });
};

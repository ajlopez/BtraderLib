
var btlib = require('..');
var sl = require('simplelists');

exports['get merval instruments'] = function (test) {
    test.async();
    
    btlib.getInstruments('index/MERV', function (err, data) {
        test.ok(!err);
        test.ok(data);
        
        testData(test, data, 'equity');

        test.ok(sl.exist(data.instruments, { symbolCode: "ALUA", name: "Aluar Aluminio Argentino SAIC", type: "equity" }));
        
        test.done();
    });
};

exports['get equity instruments'] = function (test) {
    test.async();
    
    btlib.getInstruments('equity', function (err, data) {
        test.ok(!err);
        test.ok(data);
        
        testData(test, data, 'equity');
        
        test.ok(sl.exist(data.instruments, { symbolCode: "ALUA", name: "Aluar Aluminio Argentino SAIC", type: "equity" }));
        
        test.done();
    });
};

exports['get certificate instruments'] = function (test) {
    test.async();
    
    btlib.getInstruments('certificate', function (err, data) {
        test.ok(!err);
        test.ok(data);
        
        testData(test, data, 'certificate');
        
        test.ok(sl.exist(data.instruments, { symbolCode: "AA", name: "Alcoa Inc", type: "certificate" }));

        test.done();
    });
};

function testData(test, data, type) {
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
    
    test.ok(sl.all(data.instruments, function (item) { return item.data; }));
    
    data.instruments.forEach(function (instrument) {
        test.equal(instrument.type, type);
        
        test.ok(instrument.data);
        test.strictEqual(typeof instrument.data, 'object');
        test.ok(instrument.data.nowPrice);
        test.ok(instrument.data.lastTradeDate);
        test.ok(instrument.data.updateTime);
    });
}

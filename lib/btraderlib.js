'use strict';

var http = require('http');
var url = require('url');

// From liqueed project (no post data, cookies)
// From MeliLib project

function doRequest(method, pageurl, cb) {
    var urldata = url.parse(pageurl);

    if (!cb) {
        cb = data;
        data = null;
    }

    var options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        method: method
    };

    var req = http.request(options, function(res) {
        var buffer = '';

        res.on('data', function(d) {
            var text = d.toString();
            buffer += text;
        });

        res.on('err', function(err) {
            cb(err);
        });

        res.on('end', function(d) {
            if (d) {
                var text = d.toString();
                buffer += text;
            }
            
            cb(null, buffer);
        });
    });

    req.end();
}

function doJsonRequest(method, pageurl, cb) {
    doRequest(method, pageurl, function (err, data) {
        if (err) return cb(err, null);
        
        try {
            cb(null, JSON.parse(data));
        }
        catch (ex) {
            cb(ex, null);
        }
    });
}

function capitalize(text) {
    return text[0].toUpperCase() + text.substring(1).toLowerCase();
}

function transformName(name) {
    name = name.toLowerCase();
    
    for (var p = name.indexOf('_'); p >= 0; p = name.indexOf('_')) {
        name = name.substring(0, p) + name.substring(p + 1, p + 2).toUpperCase() + name.substring(p + 2);
    }
    
    return name;
}

function transformMap(map) {
    var newmap = { };
    
    for (var n in map)
        newmap[transformName(n)] = map[n];
        
    return newmap;
}

function transformData(data) {
    var result = [];
    
    data.forEach(function (datum) {
        var newdatum = { };
        
        for (var n in datum)
            newdatum[n] = datum[n];
            
        if (newdatum.type)
            newdatum.type = newdatum.type.toLowerCase();
            
        if (newdatum.dataMap) {
            newdatum.data = transformMap(newdatum.dataMap);
            delete newdatum.dataMap;
        }   
        
        result.push(newdatum);
    });
    
    return result;
}

function getInstruments(code, cb) {
    doJsonRequest('GET', 'http://www.btrader.com.ar/v1/instrument/getAllByType/' + code, function (err, data) {
        if (err)
            return cb(err, null);
            
        var result = { };
        
        for (var n in data)
            if (n == 'instrumentDtoList')
                result.instruments = transformData(data[n]);
            else
                result[n] = data[n];
                
        if (result.openDays)
            for (var k in result.openDays)
                result.openDays[k] = capitalize(result.openDays[k]);
                
        cb(null, result);
    });
}

module.exports = {
    getInstruments: getInstruments
}


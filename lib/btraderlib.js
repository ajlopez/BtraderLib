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

function getInstruments(code, cb) {
    doJsonRequest('GET', 'http://www.btrader.com.ar/v1/instrument/getAllByType/' + code, cb);
}

module.exports = {
    getInstruments: getInstruments
}


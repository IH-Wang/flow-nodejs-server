process.env.TMPDIR = "upload";

var express = require('express');
var multipart = require('connect-multiparty');
var flow = require('./flow-node.js')('upload');
var app = express();
const PORT = 3000;

var ACCESS_CONTROL_ALLOW_ORIGIN = false;

app.use(express.static(__dirname + '/public'));

app.post('/upload', multipart(), function (req, res) {

});

app.get('/upload', function (req, res) {

});

app.listen(PORT, function () {
    console.log(`Listen to http://localhost:${PORT}`);
});
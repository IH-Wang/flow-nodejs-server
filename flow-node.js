var fs = require('fs'),
    path = require('path'),
    util = require('util');

module.export = flow = function (temporaryFolder) {
    var $ = this;
    $.temporaryFolder = temporaryFolder;
    $.maxFileSize = null;
    $.fileParameterName = 'file';
    $.chunks = [];
    
    fs.exist($.temporaryFolder,function(exist){
        if(!exist){
            fs.mkdirSync($.temporaryFolder);
        }
    });
};
$(function() {
    Init();
});

function Init() {

    var flow = new Flow({
        target: '/upload',
        singleFile: true,
        chunkSize: 20 * 1024 * 1024,
        testChunks: false,
        simultaneousUploads: 5,
        prioritizeFirstAndLastChunk: true
    });
    var results = $('#results'),
        draggable = $('#dragHere'),
        uploadButton = $('#uploadButton'),
        pauseButton = $('#pauseButton'),
        resumeButton = $('#resumeButton'),
        clearButton = $('#clearButton'),
        downloadButton = $('#downloadButton'),
        addButton = $('#addButton'),
        flowResult = $('#flowResult'),
        nothingToUpload = $('[data-nothingToUpload]');
    if (!flow.support) {
        $('.resumable-error').show();
    } else {
        pauseButton.hide();
        resumeButton.hide();
        downloadButton.hide();
        flowResult.hide();
        flow.assignBrowse(addButton, false, true);
        flow.assignDrop(draggable);
        flow.on('fileAdded', function(file, event) {
            flowResult.show();
            var template = `<div id="flow-file-${file.uniqueIdentifier}">
            <div class="fileName">${file.name} (${readablizeBytes(file.size)})
            </div></div>`;
            results.append(template);
            var $self = $('#flow-file-' + file.uniqueIdentifier);
            clearButton.on('click', function() {
                file.cancel();
                $self.remove();
                $('#file-status').text('');
                $('#file-progress').text('');
                $('#file-averageSpeed').text('');
                $('#file-timeRemaining').text('');
                flowResult.hide();
                resumeButton.hide();
                pauseButton.hide();
                uploadButton.show();
            });
            pauseButton.on('click', function() {
                file.pause();
                pauseButton.hide();
                resumeButton.show();
            });
            resumeButton.on('click', function() {
                file.resume();
                resumeButton.hide();
                pauseButton.show();
            });
            downloadButton.on('click', function() {
                location.href = `/download/${file.uniqueIdentifier}&${file.name}`;
            });
        });
        uploadButton.on('click', function() {
            if (results.children().length > 0) {
                $('#file-status').text('Uploading...');
                flow.upload();
                uploadButton.hide();
                pauseButton.show();
            } else {
                nothingToUpload.fadeIn();
                setTimeout(function() {
                    nothingToUpload.fadeOut();
                }, 3000);
            }
        });

        flow.on('chunkingStart', function(file) {
            console.log(file);
        });
        flow.on('chunkingProgress', function(file, ratio) {

        });
        flow.on('chunkingComplete', function(file) {

        });
        flow.on('fileProgress', function(file) {
            //console.log(file);
            var progress = Math.floor(file.progress() * 100);
            var averageSpeed = readablizeBytes(file.averageSpeed);
            var timeRemaining = secondsToStr(file.timeRemaining());
            $('#progress').val(progress);
            $('#file-progress').text(`${(file.progress()*100).toFixed(2)}%`);
            $('#file-averageSpeed').text(`${averageSpeed}/s`);
            $('#file-timeRemaining').text(`${timeRemaining} remaining`);
        });
        flow.on('fileSuccess', function(file, message) {
            $('#file-status').text('Complete!');
            uploadButton.show();
            downloadButton.show();
            resumeButton.hide();
            pauseButton.hide();
        });

        flow.on('fileError', function(file, message) {
            console.log(message);
        });

        flow.on('uploadStart', function() {
            $('.alert-box').text('Uploading....');
        });

        flow.on('complete', function() {
            $('.alert-box').text('Done Uploading');
        });
    }
}

function readablizeBytes(bytes) {
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
}

function secondsToStr(temp) {
    function numberEnding(number) {
        return (number > 1) ? 's' : '';
    }
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    return seconds + ' second' + numberEnding(seconds);
}

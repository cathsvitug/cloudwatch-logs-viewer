module.exports = {

  get: function(req, res) {
    async.auto({
      getLogStreams: function(callback) {
        CloudWatchLogs.describeLogStreams(sails.config.logs.logGroupName, callback);
      },
      getLogEvents: ['getLogStreams', function(callback, results) {
        var logs = [];
        if (results.getLogStreams.logStreams && results.getLogStreams.logStreams.length) {
          var logStreams = results.getLogStreams.logStreams;
          async.eachSeries(logStreams, function(logStream, cb) {
            CloudWatchLogs.getLogEvents(sails.config.logs.logGroupName, logStream.logStreamName, function(err, data) {
              logs.push(data);
              cb(err);
            });
          }, function(err, result) {
            callback(err, logs);
          });
        } else {
          callback();
        }
      }]
    }, function(err, results) {
      if (err) {
        console.log('err', err);
        res.serverError(err);
      } else {
        res.json(results.getLogEvents);
      }
    });
  }

};

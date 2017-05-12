var AWS = require('aws-sdk');
var proxy = require('proxy-agent');

module.exports = {

  configure: function() {
    AWS.config.update({
      apiVersion: sails.config.cloudWatchLogs.apiVersion,
      region: sails.config.cloudWatchLogs.region
    });

    if (sails.config.cloudWatchLogs.http_proxy) {
      AWS.config.update({
        httpOptions: { agent: proxy(sails.config.cloudWatchLogs.http_proxy) }
      });
    }

    if (sails.config.cloudWatchLogs.accessKeyId && sails.config.cloudWatchLogs.secretAccessKey) {
      AWS.config.update({
        accessKeyId: sails.config.cloudWatchLogs.accessKeyId,
        secretAccessKey: sails.config.cloudWatchLogs.secretAccessKey
      });
    }
  },

  getCloudWatchLogs: function() {
    return new AWS.CloudWatchLogs();
  },

  describeLogStreams: function(logGroupName, callback) {
    this.getCloudWatchLogs().describeLogStreams({
      logGroupName: logGroupName
    }, function(err, data) {
      if (err) {
        return callback(err);
      }

      return callback(null, data);
    });
  },

  getLogEvents: function(logGroupName, logStreamName, callback) {
    this.getCloudWatchLogs().getLogEvents({
      logGroupName: logGroupName,
      logStreamName: logStreamName
    }, function(err, data) {
      if (err) {
        return callback(err);
      }

      return callback(null, data);
    });
  }

};

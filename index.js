var riakpbc = require('riakpbc')
var defaults = require('./lib/defaults')

function Client(opts) {
  opts = opts || {}
  this.host = getValue(opts, 'host')
  this.port = getValue(opts, 'port')
  this.protocol = getValue(opts, 'protocol')
  this.baseURL = getBaseURL(opts)
  var createOpts = {
    host: this.host,
    port: this.port
  }
  var client = riakpbc.createClient(createOpts)
  this.client = client
}

function getValue(opts, key) {
  return opts[key] || defaults[key]
}

function getBaseURL(opts) {
  var protocol = opts.protocol || defaults.protocol
  var host = opts.host || defaults.host
  var port = opts.port || defaults.port
  var baseURL = protocol + '://' + host + ':' + port
  return baseURL
}

Client.prototype.purgeDB = require('./lib/purge-db')
Client.prototype.bucketKeys = require('./lib/bucket-keys')
Client.prototype.bucketKeysStream = require('./lib/bucket-keys-stream')
Client.prototype.buckets = require('./lib/buckets')
Client.prototype.bucketsStream = require('./lib/buckets-stream')
Client.prototype.bucketDeleteAll = require('./lib/bucket-delete-all')
Client.prototype.getWithKey = require('./lib/get-with-key')
Client.prototype.saveWithKey = require('./lib/save-with-key')
Client.prototype.deleteWithKey = require('./lib/delete-with-key')
Client.prototype.keyStreamWithQueryRange = require('./lib/key-stream-with-query-range')
Client.prototype.valueStreamWithQueryRange = require('./lib/value-stream-with-query-range')
Client.prototype.mapReduceStream = require('./lib/map-reduce-stream')
Client.prototype.queryRangeStream = require('./lib/query-range-stream')


module.exports = Client



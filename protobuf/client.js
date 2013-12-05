var riakpbc = require('riakpbc')

function Client(opts) {
  this.protocol = opts.protocol
  this.port = opts.port
  this.host = opts.host
  this.client = riakpbc.createClient(opts)
  return this
}

Client.prototype.bucketKeys = require('./bucket-keys')
Client.prototype.bucketKeysStream = require('./bucket-keys-stream')
Client.prototype.buckets = require('./buckets')
Client.prototype.bucketsStream = require('./buckets-stream')
Client.prototype.getWithKey = require('./get-with-key')
Client.prototype.saveWithKey = require('./save-with-key')
Client.prototype.deleteWithKey = require('./delete-with-key')
Client.prototype.mapReduceStream = require('./map-reduce-stream')
Client.prototype.queryRangeStream = require('./query-range-stream')

// common
Client.prototype.bucketDeleteAll = require('../lib/bucket-delete-all')
Client.prototype.purgeDB = require('../lib/purge-db')

module.exports = Client


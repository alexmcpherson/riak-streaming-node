var _ = require('lodash-node')
var expect = require('chai').expect
var sinon = require('sinon')
var q = require('q')
var moment = require('moment')

var time = moment()
var help = require('./test-helper')
var inspect = help.inspect

var Client = require('../')
var client = new Client({})
var indexKey = 'value_stream_index'
var bucket = 'value_stream_test'
var rowKeys = []

var numRows = 20
describe('valueStreamWithQueryRange', function() {
  before(setupFixtures)
  after(function(done) {
    removeRows(rowKeys, done)
  })
  it('should get value stream in order', function(done) {
    this.slow('.5s')
    var queryOpts = {
      bucket: bucket,
      start: '!',
      end: '~',
      indexKey: indexKey
    }
    var valueStream = client.valueStreamWithQueryRange(queryOpts)
    var prevID
    var dataSpy = sinon.spy(validateDataEvent)
    valueStream.on('data', dataSpy)
    valueStream.on('end', function() {
      expect(dataSpy.callCount).to.equal(numRows)
      done()
    })

    function validateDataEvent(value) {
      expect(value).to.be.an('object')
      expect(value).to.have.ownProperty('id')
      expect(value).to.have.ownProperty('timestamp')
      var id = value.id
      if (!prevID) {
        prevID = id
        return
      }
      expect(id).to.be.above(prevID)
      prevID = id
    }
  })


})

function removeRows(keys, cb) {
  q.all(keys.map(deleteKey)).nodeify(cb)
}

function deleteKey(key) {
  var opts = {
    key: key,
    bucket: bucket
  }
  return client.deleteWithKey(opts)
}

function setupFixtures(cb) {
  var startID = 20
  var endID = startID + numRows
  var rows = _.range(startID, endID).map(createRow)
  var promises = rows.map(saveRow)
  q.all(promises).fail(failHandler).nodeify(cb)
}

function failHandler(err) {
  inspect(err, 'error')
  throw err
}

function saveRow(row) {
  var key = row.id
  var saveOpts = {
    bucket: bucket,
    key: key,
    value: row,
    indices: {}
  }
  saveOpts.indices[indexKey] = row.id
  return client.saveWithKey(saveOpts)
  .then(function() {
    rowKeys.push(key)
  })
}

function createRow(id) {
  var row = {
    id: id.toString(),
    timestamp: time.add('seconds', id).toString('YYYY-MM-DD HH:mm:ss.sss')
  }
  return row
}
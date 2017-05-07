const chai = require('chai')
const expect = chai.expect
const formBuilder = require('../index.js')

describe('Entitiy Check', () => {
  it('Single Entitiy', (done) => {
    var args = [
      {
        entity: '07777777777',
        type: 'Number',
        startIndex: 46,
        endIndex: 56,
        score: 0.9993663
      }
    ]
    formBuilder.entityCheck(args, ['Number'], 0.7, function (data) {
      expect(data).to.eql({ Number: '07777777777' })
      done()
    })
  })
  it('Multiple Entities', (done) => {
    var args = [
      {
        entity: '07777777777',
        type: 'Number',
        score: 0.9993663
      },
      {
        entity: 'SL6 6DY',
        type: 'Postcode',
        score: 0.9994632
      }
    ]
    formBuilder.entityCheck(args, ['Number', 'Postcode'], 0.7, function (data) {
      expect(data).to.eql({ Number: '07777777777', Postcode: 'SL6 6DY' })
      done()
    })
  })
  it('Entity Threshold', (done) => {
    var args = [
      {
        entity: '07777777777',
        type: 'Number',
        score: 0.6
      },
      {
        entity: 'SL6 6DY',
        type: 'Postcode',
        score: 0.6
      }
    ]
    formBuilder.entityCheck(args, ['Number', 'Postcode'], 0.7, function (data) {
      expect(data).to.eql({})
      done()
    })
  })
})

import { expect } from 'chai'
import { binarySearchNumber } from '../../src/lib/utils'

const number = 1000
const testNumber = n => n > number

const tests = [
  [[testNumber, number + 1], number + 1],
  [[testNumber, number * 2], number + 1],
  [[testNumber, 100, 200], undefined]
]

describe('binarySearchNumber()', function () {
  for (const [args, expected] of tests) {
    it(`should return ${expected}`, async () => {
      const res = await binarySearchNumber(...args)
      expect(res).to.be.equal(expected)
    })
  }
})

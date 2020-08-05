import { sum } from './utils.js'
import { greeter } from './utils.ts'

const user = { firstName: 'jack', lastName: 'kong' }

document.write(greeter(user))

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
test('print obj { firstName: jack, lastName: kong }', () => {
  expect(greeter(user)).toBe('Hello, jack kong')
})

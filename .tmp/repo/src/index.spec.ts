import { Hello } from './index'
import * as assert from 'assert'

describe('Unit test', () => {
	it('test', () => {
		assert.equal(new Hello().name, 'hello world!', 'name error')
	})
})

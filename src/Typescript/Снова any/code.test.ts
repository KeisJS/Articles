import { describe, it, expect } from '@jest/globals'
import { anyAgainEx1, anyAgainEx2 } from './code'

describe('Снова any', () => {
  it('Example 1', () => {
    expect(() => anyAgainEx1()).toThrow('B.repeat is not a function')
  })

  it('Example 2', () => {
    expect(anyAgainEx2()).toBe('11')
  })
})

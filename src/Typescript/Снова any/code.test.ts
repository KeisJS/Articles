import { describe, it, expect } from '@jest/globals'
import { anyAgainCounts, anyAgainEx1, anyAgainEx2, anyAgainEx3, anyAgainEx4 } from './code'

describe('Снова any', () => {
  it('Example 1', () => {
    expect(() => anyAgainEx1()).toThrow('B.repeat is not a function')
  })

  it('Example 2', () => {
    expect(anyAgainEx2()).toBe('11')
  })

  it('Example 3', () => {
    expect(anyAgainEx4(1, 1, 1)).toBe(3)
    expect(anyAgainEx4(1, 1, 1)).toBe(3)
    expect(anyAgainCounts['anyAgainEx4']).toBe(2)
  })
})

import { describe, expect, it } from '@jest/globals'
import { systemTypesAndSettings } from './code'

describe('Система типов и настройки', () => {
  it('Example 1', () => {
    expect(systemTypesAndSettings.example1()).toBe(true)
  })

  it('Example 2', () => {
    expect(systemTypesAndSettings.example2()).toBe(true)
  })

  it('Example 3', () => {
    expect(() => {
      systemTypesAndSettings.example3()
    }).toThrow('error a in CB')
  })
})

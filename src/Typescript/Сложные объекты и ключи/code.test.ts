import { describe, it, expect } from '@jest/globals'
import { getMessageByKeyTypeA, getMessageByKeyTypeB, getMessageByKey } from './code'
import { CreateMutable } from '../../utils/typeUtils'

describe('Сложные объекты и ключи', () => {
  const testData = [
    ['defaultAction.file.create', 'create file'],
    ['title1', 'default title 1']
  ] as const

  describe.each([
    ['Simple', getMessageByKey],
    ['TypeA', getMessageByKeyTypeA],
    ['TypeB', getMessageByKeyTypeB]
  ])('%s', (name,fn) => {
    it.each(testData as CreateMutable<typeof testData>)('%s -> %s', (input, result) => {
      expect(fn(input)).toBe(result)
    })
  })
})



import { getMessageByKeyTypeA, getMessageByKeyTypeB, getMessageByKey, neverAgainEx1, getMessageByKeyTypeC } from './code'
import { CreateMutable } from '../../utils/typeUtils'

describe('Сложные объекты и ключи', () => {
  const testData = [
    ['defaultAction.file.create', 'create file'],
    ['title1', 'default title 1'],
    ['defaultPrompt.cancel', 'Cancel'],
  ] as const

  describe.each([
    ['Simple', getMessageByKey],
    ['TypeA', getMessageByKeyTypeA],
    ['TypeB', getMessageByKeyTypeB],
    ['TypeC', getMessageByKeyTypeA]
  ])('%s', (name,fn) => {
    it.each(testData as CreateMutable<typeof testData>)('%s -> %s', (input, result) => {
      expect(fn(input)).toBe(result)
    })
  })

  it('Never again ex1', () => {
    expect(() => {
      neverAgainEx1()
    }).toThrow('error in createSomeDesc')
  })
})



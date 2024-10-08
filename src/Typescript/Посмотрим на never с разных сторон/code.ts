export const neverAgainEx1 = () => {
  let logValue = ''

  const createSomeDesc = (value: string | number | object): string | never => {
    switch(typeof value) {
      case 'string':
        return 'log string'
      case 'number':
        return 'log number'
      default:
        throw new Error('error in createSomeDesc')
    }
  }

  logValue = 'some string' + createSomeDesc({})
}

//-----
type GenericWithRestriction<T extends string> = T
type GenericWithNever<T> = T extends string ? T : never

const neverAgainEx2 = () => {
  const value: GenericWithRestriction<string> = ''
  //@ts-ignore
  const neverValue: GenericWithNever<number> = '' // TS2322: Type string is not assignable to type never
  const value2: GenericWithNever<string> = ''
}

const messages = {
  defaultPrompt: {
    ok: 'Ok',
    cancel: 'Cancel'
  },
  defaultAction: {
    file: {
      rm: 'delete file',
      create: 'create file'
    },
    directory: {
      rm: 'delete directory',
      create: 'make directory'
    }
  },
  title1: 'default title 1',
} as const

type KeyTree = {
  [key: string]: string | KeyTree,
}

type TExtractAllKeysTypeA<O extends KeyTree, K extends keyof O = keyof O> = K extends string
  ? O[K] extends KeyTree
    ? `${K}.${TExtractAllKeysTypeA<O[K]>}`
    : K
  : never

type TExtractAllKeysTypeA_1<O, K extends keyof O = keyof O> = K extends string
  ? O[K] extends string
    ? K
    : `${K}.${TExtractAllKeysTypeA_1<O[K]>}`
  : never

type TExtractAllKeysTypeA_2<O, K extends keyof O = keyof O> = K extends string
  ? O[K] extends string
    ? K
    : O[K] extends KeyTree
      ? `${K}.${TExtractAllKeysTypeA_2<O[K]>}`
      : never
  : never

type TExtractAllKeysTypeB<O> = {
  [K in keyof O]: K extends string
    ? O[K] extends string
      ? K
      : `${K}.${TExtractAllKeysTypeB<O[K]>}`
    : never
}[keyof O]

export const getMessageByKey = (key: TExtractAllKeysTypeA<typeof messages>): string => eval(`messages.${key}`)

const isKey = <O extends object>(key: string, data: O): key is keyof O & string => {
  return key in data
}

export const getMessageByKeyTypeC = (key: TExtractAllKeysTypeA<typeof messages>) => {
  const keys = key.split('.')
  let tmpValue: object = messages

  while(keys.length) {
    let key = keys.shift() as string

    if (isKey(key, tmpValue)) {
      if (typeof tmpValue[key] === 'string') {
        return tmpValue[key]
      } else {
        tmpValue = tmpValue[key]
      }
    }
  }

  return 'wrong key'
}

const _getMessageByKeyTypeA = <T extends KeyTree>(data: T) => {
  return (key: TExtractAllKeysTypeA<T>): string => eval(`data.${String(key)}`)
}

const _getMessageByKeyTypeB = <T>(data: T) => {
  return (key: TExtractAllKeysTypeB<T>): string => eval(`data.${String(key)}`)
}

export const getMessageByKeyTypeA = _getMessageByKeyTypeA(messages)
export const getMessageByKeyTypeB = _getMessageByKeyTypeB(messages)

getMessageByKeyTypeA('defaultAction.file.create')


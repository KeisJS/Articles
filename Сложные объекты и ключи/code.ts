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

type TExtractAllKeysTypeA<O, K extends keyof O = keyof O> = K extends string
  ? O[K] extends string
    ? K
    : `${K}.${TExtractAllKeysTypeA<O[K]>}`
  : never

type TExtractAllKeysTypeB<O> = {
  [K in keyof O]: K extends string
    ? O[K] extends string
      ? K
      : `${K}.${TExtractAllKeysTypeB<O[K]>}`
    : never
}[keyof O]

export const getMessageByKey = (key: TExtractAllKeysTypeA<typeof messages>): string => eval(`messages.${key}`)

const _getMessageByKeyTypeA = <T>(data: T) => {
  return (key: TExtractAllKeysTypeA<T>): string => eval(`data.${String(key)}`)
}

const _getMessageByKeyTypeB = <T>(data: T) => {
  return (key: TExtractAllKeysTypeB<T>): string => eval(`data.${String(key)}`)
}

export const getMessageByKeyTypeA = _getMessageByKeyTypeA(messages)
export const getMessageByKeyTypeB = _getMessageByKeyTypeB(messages)



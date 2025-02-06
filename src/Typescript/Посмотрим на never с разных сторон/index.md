# Посмотрим на never с разных сторон?

## Введение
Данную заметку можно рассматривать как приложение к официальной документации. С одной стороны я решил, что стоит развернуть примеры из документации, а с другой показать роль never в выражениях типов. Последнее в документации отражено между делом.

Предложенная структура и содержимое заметки могут быть интересны как начинающим, так и опытным специалистам.

## Документация

В документации never в основном описан в следующих разделах:

- [В разделе о сужении типов](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type)
- [В разделе о функциях](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)

Несмотря на то, что примеры в документации представлены выразительные некоторые проблемы, на мой взгляд, являются неочевидными.
Поэтому предлагаю рассмотреть пример, который объединяет и дополняет оба этих раздела.

Пример 1.
```ts
export const neverAgainEx1 = () => {
  let logValue = ''

  const createSomeDesc = (value: string | number | object): string | never=> {
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

it('Never again ex1', () => {
  expect(() => {
    neverAgainEx1()
  }).toThrow()
})
```

Ключевые моменты:

- never является подтипом любого типа, поэтому в соответствии с принципом подстановки Барбары Лисков присваивание любому типу never является безопасным: 
```ts
type Value = string | never extends string ? true : false // true
```
- функция createSomeDesc выкидывает исключение, если параметр не строка и не число.  
- присваивание нового значения logValue является недостижимой операцией, что очевидно является некорректным поведением

Сам пример показывает, что будет, если тип параметра расширить "забыв" добавить реализацию для `object`. Тип возвращаемого значения `string | never` я добавил для наглядности.

Несмотря на то, что такое поведение ts может показаться опасным, оно позволяет свободно использовать код внутри try/catch. При этом, исчерпывающее описание типов описанное в документации становится необходимым для контролирования ситуация на уровне ts.

## Выражения типов 

Использование `never` является ключом к созданию типов утилит.

Пример 2
```ts
type GenericWithRestriction<T extends string> = T
type GenericWithNever<T> = T extends string ? T : never

const neverAgainEx2 = () => {
  const value: GenericWithRestriction<string> = ''
  //@ts-ignore
  const neverValue: GenericWithNever<number> = '' // TS2322: Type string is not assignable to type never
  const value2: GenericWithNever<string> = ''
}
```

Ts "откидывает" любой тип, который может привести к never. Таким образом мы получаем возможность использовать только такие типы, которые имеют смысл. 


### Примеры использования never в выражениях

Рассмотрим пример:
```ts
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
}

export const getMessageByKey = (key: string): string => eval(`messages.${key}`)
```

Задача: настроить тип getMessageByKey так, что бы в key были строки вида `path.to.value`. Реализация в данном случае значения не имеет.

Сам message превратим в литерал через `as const`

Вариант 1:
```ts
type KeyTree = {
  [key: string]: string | KeyTree,
}

type ExtractAllKeysTypeA<O extends KeyTree, K extends keyof O = keyof O> = K extends string
  ? O[K] extends KeyTree
    ? `${K}.${ExtractAllKeysTypeA<O[K]>}`
    : K
  : never
```
Ключевым моменты:
- `K extends string` выполняет две функции
  1. Позволяет работать дистрибутивности объединения относительно операции extends
  2. Сужает множество ключей выкидывая из него symbol, что будет полезно далее для шаблонных строчных литералов
- Для задания ключей вида `path.to.property` используем шаблонные строчные литералы
- Для создания множества всех ключей используем рекурсию
- Для простоты использования второму дженерику задаем дефолтное значение

В данном случае явное использование never играет скромную роль, отсекая symbol из множества ключей `keyof O`. Но есть и неявное поведение. При значениях ключей отличных от `string | KeyTree`, выражение `${K}.${ExtractAllKeysTypeA<O[K]>}` будет приведено к never и тогда такие ключи будут откинуты. А саму утилиту можно преобразовать к виду:

```
type ExtractAllKeysTypeA<O, K extends keyof O = keyof O> = K extends string
  ? O[K] extends string
    ? K
    : `${K}.${ExtractAllKeysTypeA<O[K]>}`
  : never
```

Разумеется в этом случае литерал `messages` никак не контролируется.

Итоговый результат:
```ts
export const getMessageByKey = (key: ExtractAllKeysTypeA<typeof messages>): string => eval(`messages.${key}`)
```

Вариант 2:
```ts
type ExtractAllKeysTypeB<O> = {
  [K in keyof O]: K extends string
    ? O[K] extends string
      ? K
      : `${K}.${ExtractAllKeysTypeB<O[K]>}`
    : never
}[keyof O]
```

- количество дженериков сократилось до одного
- never используется более изобретательным способом. ТС откидывает свойства, значения которых never
- используется неявное приведение к never

И в конце можно рассмотреть функцию, которая работает с любым messages
```ts
const _getMessageByKeyTypeA = <T extends KeyTree>(data: T) => {
  return (key: ExtractAllKeysTypeA<T>): string => eval(`data.${String(key)}`)
}

const _getMessageByKeyTypeB = <T>(data: T) => {
  return (key: ExtractAllKeysTypeB<T>): string => eval(`data.${String(key)}`)
}

export const getMessageByKeyTypeA = _getMessageByKeyTypeA(messages)
export const getMessageByKeyTypeB = _getMessageByKeyTypeB(messages)
```

## Вместо заключения

Как видно из этой заметки освоить never является необходимым не только для того, что бы не пропустить ситуации в которых данный тип нужен "по прямому назначению", но и для того, что бы освоить создание типов-утилит.


# Получить все ключи с определенным шаблоном

Рассмотрим пример:
```ts
const messages = {
  defaultPrompt: {
    ok: 'Ok',
    cancel: 'Cancel'
  },
  defaultAction: {
    file: {
      delete: 'delete file',
      create: 'create file'
    },
    directory: {
      delete: 'delete directory',
      create: 'make directory'
    }
  }
}

export const getMessageByKey = (key: string): string => eval(`messages.${key}`)
```

Задача: настроить типы messages и функций, которые с ним работают. Реализация в данном случае значения не имеет.

Первым делом получим тип messages. Что бы не делать двойную работу превратим его просто в литерал через `as const`

Теперь можно перейти к функции `getMessageByKey`

Вариант 1:
```ts
type TExtractAllKeysTypeA<O, K extends keyof O = keyof O> = K extends string
  ? O[K] extends string
    ? K
    : `${K}.${TExtractAllKeysTypeA<O[K]>}`
  : never
```
Пробежимся по ключевым моментам
- `K extends string` выполняет две функции
  1. Позволяет работать дистрибутивности объединения относительно операции extends
  2. Сужает множество ключей выкидывая из него symbol, что будет полезно далее для шаблонных строчных литералов
- Для задания ключей вида `path.to.property` используем шаблонные строчные литералы
- Для создания множества всех ключей используем рекурсию
- Для простоты использования второму дженерику задаем дефолтное значение

Итоговый результат:
```ts
export const getMessageByKey = (key: TExtractAllKeysTypeA<typeof messages>): string => eval(`messages.${key}`)
```

Вариант 2:
```ts
type TExtractAllKeysTypeB<O> = {
  [K in keyof O]: K extends string
    ? O[K] extends string
      ? K
      : `${K}.${TExtractAllKeysTypeB<O[K]>}`
    : never
}[keyof O]
```
Пробежимся по ключевым моментам
- количество дженериков сократилось до одного
- never используется более изобретательным способом. ТС откидывает свойство значения которых never

В остальном снова рекурсия и шаблонный строчный литерал.

И в конце можно рассмотреть функцию, которая работает с любым messages
```ts
const _getMessageByKeyTypeA = <T>(data: T) => {
  return (key: TExtractAllKeysTypeA<T>): string => eval(`data.${String(key)}`)
}

export const getMessageByKeyTypeA = _getMessageByKeyTypeA(messages)
```

Примеры и тесты находятся в папке со статьей.



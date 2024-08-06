# Снова any

Поводом для данной заметки стали несколько обстоятельств. Негативный опыт на одном проекте, следующий спич в одном из докладов по ТС 2023 года:
"Так когда же использовать any? Никогда. Шучу, конечно. Если идет портирование или при разработке дженериков можно" - за точность уже отвечать не могу, но смысл примерно такой.
А так же заявления некоторых команд в духе: "У нас отличный проект. У нас нет any"

Так как относиться неискушенному разработчику к any?

## Документация. 

Первым делом обратимся к современной документации на ТС. А имеем мы [следующие](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any):
> TypeScript also has a special type, any, that you can use whenever you don’t want a particular value to cause typechecking errors.

И подобное действительно может ввести в заблуждение, что с `any` можно обращаться как с любым другим типом и использовать при разработке.
Потому что очень легко упустить из виду ошибки отключаются из-за того, что вся система типизации на месте отключается.

Пример 1.
```ts
export const anyAgainEx1 = () => {
  const A: any = 1
  const B: string = A

  const C = B.repeat(10)
}
```

Запустив тест мы получим подтверждение, что функция выкинет исключение с ошибкой `B.repeat is not a function`

Поэтому действительно использовать `any` как тип в ТС проекте нельзя, потому что основная его функция - это отключать типизацию в месте использования.

И в документации об этом написано прямым текстом. Но не в самом разделе посвященном `any`, а в, на мой взгляд весьма отдаленном разделе, [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#any):

> Don’t use any as a type unless you are in the process of migrating a JavaScript project to TypeScript. The compiler effectively treats any as “please turn off type checking for this thing”. It is similar to putting an @ts-ignore comment around every usage of the variable. This can be very helpful when you are first migrating a JavaScript project to TypeScript as you can set the type for stuff you haven’t migrated yet as any, but in a full TypeScript project you are disabling type checking for any parts of your program that use it.

И если мы не знаем какой тип должен быть на месте должны использовать `unknown`

Пример 2.
```ts
export const anyAgainEx2 = () => {
  const A: unknown = 1
  const B: string = typeof A === 'string' ? A : '1'

  return B.repeat(2)
}
```

## Generic

Когда у нас есть ТС проект `any` в нем все равно использовать можно. 

Пример 3.
```ts
type A<T> = { value: T }
type B<T> = T extends any ? A<T> : never
type C<T extends { value: any }> = T extends { value: infer InnerT } ? InnerT : never

type testType = string | number

type Result = {
value1: A<testType> // { value: string | number }
value2: B<testType> // { value: string } | { value: number }
value3: C<A<string> | B<number>> // string | number
}
```

Мы имеем два примера выразительного использования `any`
- В первом случае таким образом ТС позволяет включать дистрибутивность объединения при передаче в дженерик
- Во втором случае с помощью `any` мы определили форму ограничения для типа дженерика

## Отключение типизации через any как рабочий вариант
Задача: Написать декоратор для функции, который подсчитывает количество вызовов

Пример 4.
```ts
export const anyAgainCounts: { [key: string]: number } = {}

const decoratorCount = function<T extends (...p: any[]) => any>(fn: T, desc: string): T {
  if (typeof fn !== 'function') {
    throw 'fn is not function'
  }

  anyAgainCounts[desc] = 0

  return ((...params: any[]) => {
    anyAgainCounts[desc]++

    return fn(...params)
  }) as T
}

export const anyAgainEx4 = decoratorCount((a: number, b: number, c: number): number => a + b + c, 'anyAgainEx4')
```

Ключевые моменты использования any:
1. Задание формы для типа параметра декорируемого подсчитывающей функцией
2. Отключение типизации, т.к. в данном случае нас вообще не интересует с какими параметрами работает декорирующая функция. О количестве параметров должна заботится декорируемая функция.


## Заключение

Так что же означает фраза: "У нас на проекте нет any"?

Во первых, это говорит о стадии проекта. Либо он изначально был на ТС, либо все операции портирования завершены.

Во вторых, `any` до сих пор может эффективно использоваться в TC проекте, но вот как тип его использование ограничено ясными продуманными ситуациями. Если же в проекте и в самом деле недолюбливают `any` просто так, то точно имеет смысл ознакомиться с особенностями из этой заметки.


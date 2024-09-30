## Предисловие

Написать заметку меня побудила статья [Как устроена система типов typescript](https://ru.hexlet.io/blog/posts/sistema-tipov-v-typescript) и собственный опыт.

Я обратил внимание, что не всегда понимал семантику "extends" в разных контекстах и влияние настроек языка. 

В результате, то что меня смущало, оказалось рабочим поведением языка, но при этом непредсказуемым и небезопасным.     

## Введение

Для демонстрации я выбрал простое объединение string | number, которое буду помещать в различные контексты. 

Пример 1:

```ts
type TA = number | string
type TB = string

type E1 = TA extends TB ? true : false // false
type E2 = TB extends TA ? true : false // true

export const example1 = () => {
  let a: TA = 100
  let b: TB = 'value 100'

  b = a
  a = b

  return true
}
```

Когда мы имеем дело с примитивными типами наше объединение будет выступать в определенном смысле супер типом для string или number.
И по описанному в статье, в примере 1 мы будем иметь некорректное нисходящее приведение `b = a` и корректное восходящее приведение `a = b`.
Пока все понятно, и предсказуемо.

## Функции

Вариант 2:
```ts
type TC = (a: number | string) => void
type TD = (a: string) => void

type E3 = TC extends TD ? true : false
type E4 = TD extends TC ? true : false

let c: TC = a => undefined
let d: TD = a => {
  if (typeof a !== 'string') {
    throw 'error a in d'
  }
}

const example2 = () => {
  c = d
  d = c

  return true
}
```

Вроде по смыслу ничего не поменялось, но ts перестал работать как ожидаем. Здесь у нас работает явно противоречащие принципу небезопасное присваивание.
За такие финты ушами отвечает `compilerOptions->strict` установленный в `true`. А так же может быть использована отдельная опция `strictFunctionTypes`.
Включение этих флажков решает проблему и мы получаем предупреждение о небезопасном присваивании.

## Объекты
Адаптируем функцию выше как метод объекта.

Вариант 3:
```ts
interface IA {
  setValue(a: number | string): void
}

class CB implements IA {
  setValue(a: string) {
    if (typeof a !== 'string') {
      throw 'error a in CB'
    }
  }
}

const example3 = () => {
  const oIA: IA = new CB
  oIA.setValue(100) // Error: thrown: "error a in CB"

  return true
}
```

Наш конфиг уже имеет флаг `strict->true`. Но никаких ошибок вида ниже мы не получаем:

```
TS2322: Type TD is not assignable to type TC
  Types of parameters a and a are incompatible.
    Type string | number is not assignable to type string
      Type number is not assignable to type string
```

Это как раз тот самый момент, который и вызвал у меня вопросы.

Ответ нашелся в [документации ts](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes) и звучит примерно так: 
> Во время разработки этой функции мы обнаружили большое количество изначально небезопасных иерархий классов, включая некоторые из них в DOM. В связи с этим настройка применяется только к функциям, написанным в синтаксисе функций, а не в синтаксисе методов

## Заключение
Выводов оказалось два.
1. Обязательно устанавливайте флажок `strict`. Он подключает дополнительные проверки типов.
2. При реализации интерфейсов, и работе с объектами корректность соблюдения принципа подстановки Барбары Лисков ложится на плечи разработчиков.



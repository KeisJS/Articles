## Предисловие

Написать заметку меня побудила статья [Как устроена система типов typescript](https://ru.hexlet.io/blog/posts/sistema-tipov-v-typescript) и собственный опыт.

Я обратил внимание, что не всегда понимал семантику "extends" в разных контекстах и влияние настроек языка. 

В результате, то что меня смущало, оказалось рабочим поведением языка, но при этом непредсказуемым и небезопасным.     

## Введение

Для демонстрации я выбрал простое объединение string | number, которое буду помещать в различные контексты. 

Пример 1:

```ts
type A = number | string
type B = string

type E1 = A extends B ? true : false // false
type E2 = B extends A ? true : false // true

export const example1 = () => {
  let a: A = 100
  let b: B = 'value 100'

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
type C = (a: number | string) => void
type D = (a: string) => void

type E3 = C extends D ? true : false
type E4 = D extends C ? true : false

let c: C = a => undefined
let d: D = a => {
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
TS2322: Type D is not assignable to type C
  Types of parameters a and a are incompatible.
    Type string | number is not assignable to type string
      Type number is not assignable to type string
```

Это как раз тот самый момент, который и вызвал у меня вопросы.

Ответ нашелся в [документации ts](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes) и звучит примерно так: 
> Во время разработки этой функции мы обнаружили большое количество изначально небезопасных иерархий классов, включая некоторые из них в DOM. В связи с этим настройка применяется только к функциям, написанным в синтаксисе функций, а не в синтаксисе методов

Проблему можно решить, использовав стрелочную функцию:
```ts
interface IA {
  setValue: (a: number | string) => void
}
```

Пример безопасной перегрузки метода:
```ts
interface IA {
  setValue: {
    (a: number | string): void;
    (a: boolean): boolean;
  };
}
```

## Заключение
Выводов оказалось два.
1. Обязательно устанавливайте флажок `strict`. Он подключает дополнительные проверки типов.
2. При реализации интерфейсов, и работе с объектами корректность соблюдения принципа подстановки Барбары Лисков ложится на плечи разработчиков.
    - использовать стрелочную форму записи метода
    - следить за импортированными типами 



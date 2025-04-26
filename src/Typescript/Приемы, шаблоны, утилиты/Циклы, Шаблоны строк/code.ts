/**
 * Создает кортеж заданной длины
 * @template T типа элементов кортежа
 * @template N длина кортежа
 */
type BuildTuple<T, N extends number> = _buildTuple<T, N>
type _buildTuple<T, N extends number, Result extends T[] = []> = Result['length'] extends N
  ? Result
  : _buildTuple<T, N, [T, ...Result]>

/**
 * Цифры для шестнадцатеричной системы счисления
 */
type Digit =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' |
  'A' | 'B' | 'C' | 'D' | 'E' | 'F'

/**
 * Преобразует кортеж в шаблонную строку
 * @template T входной кортеж
 */
type Join<T extends string[]> =
  T extends [string, ...infer Rest extends string[]]
    ? `${T[0]}${Join<Rest>}`
    : ''

/**
 * Создает тип для строки длины N представляющей шестнадцатеричное число
 * @template N длина строки
 */
type BuildHexString<N extends number> = N extends 0
  ? ''
  : _BuildHexString<N, Digit, [1]>

/**
 * Промежуточный тип-утилита
 * @template N длина строки
 * @template Result накапливает результат
 * @template Count счетчик цикла, когда Count['length'] === N цикл завершится
 */
type _BuildHexString<N extends number, Result extends string, Count extends unknown[]> = Count['length'] extends N
  ? Result
  : _BuildHexString<N, Result | Join<BuildTuple<Digit, [1, ...Count]['length']>>, [1, ...Count]>


export type {
  BuildTuple,
  Digit,
  BuildHexString
}



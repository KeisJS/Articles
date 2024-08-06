export const anyAgainEx1 = () => {
  const A: any = 1
  const B: string = A

  const C = B.repeat(10)
}

export const anyAgainEx2 = () => {
  const A: unknown = 1
  const B: string = typeof A === 'string' ? A : '1'

  return B.repeat(2)
}

export const anyAgainEx3 = () => {
  type A<T> = { value: T }
  type B<T> = T extends any ? A<T> : never
  type C<T extends { value: any }> = T extends { value: infer InnerT } ? InnerT : never

  type testType = string | number

  type Result = {
    value1: A<testType> // { value: string | number }
    value2: B<testType> // { value: string } | { value: number }
    value3: C<A<string> | B<number>> // string | number
  }

  const a: Result = {
    value1: { value: 100 },
    value2: { value: '100' },
    value3: 100
  }
}

export const anyAgainCounts: { [key: string]: number } = {}

const decoratorCount = function<T extends (...p: any[]) => any>(fn: T, desc: string): T {
  anyAgainCounts[desc] = 0

  return ((...params: any[]) => {
    anyAgainCounts[desc]++

    return fn(...params)
  }) as T
}

export const anyAgainEx4 = decoratorCount((a: number, b: number, c: number): number => a + b + c, 'anyAgainEx4')


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

const decoratorCount = <T extends (...p: any) => any>(fn: T, desc: string): T => {
  anyAgainCounts[desc] = 0

  return ((...params: any[]) => {
    anyAgainCounts[desc]++

    return fn(...params)
  }) as T
}

// Аналог decoratorCount, так как использует any
const decoratorCountShort = <T extends Function>(fn: T, desc: string): T => {
  anyAgainCounts[desc] = 0

  return ((...params: unknown[]) => {
    anyAgainCounts[desc]++

    return fn(...params)
  }) as unknown as T
}

const decoratorCount2 = <F extends (...args: Parameters<F>) => ReturnType<F>>(fn: F, desc: string) => {
  anyAgainCounts[desc] = 0

  return ((...params: Parameters<F>) => {
    anyAgainCounts[desc]++

    return fn(...params)
  })
}
const sum3x = (a: number, b: number, c: number): number => a + b + c

export const anyAgainEx4 = decoratorCount(sum3x, 'anyAgainEx4')
export const anyAgainEx4_2 = decoratorCount2(sum3x, 'anyAgainEx4_2')


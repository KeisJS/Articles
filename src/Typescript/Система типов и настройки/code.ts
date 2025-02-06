type A = number | string
type B = string

type E1 = A extends B ? true : false // false
type E2 = B extends A ? true : false // true

export const example1 = () => {
  let a: A = 100
  let b: B = 'value 100'

  //@ts-ignore
  b = a
  a = b

  return true
}

// -----
type C = (a: number | string) => void
type D = (a: string) => void

type E3 = C extends D ? true : false // true
type E4 = D extends C ? true : false // false

let c: C = a => undefined
let d: D = a => {
  if (typeof a !== 'string') {
    throw 'error a in d'
  }
}

const example2 = () => {
  //@ts-ignore
  c = d
  d = c

  return true
}

//-----
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

const systemTypesAndSettings = {
  example1,
  example2,
  example3
}

export { systemTypesAndSettings }

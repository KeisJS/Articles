type TA = number | string
type TB = string

type E1 = TA extends TB ? true : false // false
type E2 = TB extends TA ? true : false // true

export const example1 = () => {
  let a: TA = 100
  let b: TB = 'value 100'

  //@ts-ignore
  b = a
  a = b

  return true
}

// -----
type TC = (a: number | string) => void
type TD = (a: string) => void

type E3 = TC extends TD ? true : false // true
type E4 = TD extends TC ? true : false // false

let c: TC = a => undefined
let d: TD = a => {
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

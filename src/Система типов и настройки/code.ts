type TA = number | string
type TB = string

type E1 = TA extends TB ? true : false // false
type E2 = TB extends TA ? true : false // true

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

//@ts-ignore
c = d
d = c

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

const oIA: IA = new CB
oIA.setValue(100)

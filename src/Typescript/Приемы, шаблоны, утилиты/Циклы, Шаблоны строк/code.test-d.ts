import type { BuildHexString, BuildTuple, Digit } from './code.ts'
import { assertType } from 'vitest'

const tuple3length: [number, number, number] = [1, 2, 3]

assertType<BuildTuple<number, 3>>(tuple3length)

const hexValue1: `${Digit}` = '7'
const hexValue2: `${Digit}${Digit}` = '1A'
const hexValue3: `${Digit}${Digit}${Digit}` = '9FF'

assertType<BuildHexString<1>>(hexValue1)
assertType<BuildHexString<2>>(hexValue2)
assertType<BuildHexString<3>>(hexValue3)



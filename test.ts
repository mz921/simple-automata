import {char, ε, concat, union, closure} from './factory'
import NFA from './NFA'
import DFA from './DFA'


describe('char', () => {
    let charNFA:NFA
    beforeEach(() => {
         charNFA = char('a')
    })
    test('a', () => {
        expect(charNFA.test('a')).toBeTruthy()
    })
    test('b', () => {
        expect(charNFA.test('b')).toBeFalsy()
    })
    test('empty', () => {
        expect(charNFA.test('')).toBeFalsy()
    })
})


describe('epsilon', () => {
    let εNFA:NFA
    beforeEach(() => {
        εNFA = ε()
    })
    test('a', () => {
        expect(εNFA.test('a')).toBeFalsy()
    })
    test('empty', () => {
        expect(εNFA.test('')).toBeTruthy()
    })
})


describe('concat', () => {
    let charNFA1:NFA
    let charNFA2:NFA
    let concatNFA:NFA
    beforeEach(() => {
         charNFA1 = char('a')
         charNFA2 = char('b')
         concatNFA = concat(charNFA1,charNFA2)
    })
    test('a', () => {
        expect(concatNFA.test('ab')).toBeTruthy()
    })
    test('b', () => {
        expect(concatNFA.test('a')).toBeFalsy()
    })
    test('empty', () => {
        expect(concatNFA.test('')).toBeFalsy()
    })
})

describe('union', () => {
    let charNFA1:NFA
    let charNFA2:NFA
    let unionNFA:NFA
    let unionDFA:DFA
    beforeEach(() => {
         charNFA1 = char('a')
         charNFA2 = char('b')
         unionNFA = union(charNFA1,charNFA2)
         unionDFA = new DFA(unionNFA)

    })
    test('a', () => {
        expect(unionNFA.test('a')).toBeTruthy()
    })
    test('b', () => {
        expect(unionNFA.test('b')).toBeTruthy()
    })
    test('ab', () => {
        expect(unionNFA.test('ab')).toBeFalsy()
    })
    test('empty', () => {
        expect(unionNFA.test('')).toBeFalsy()
    })
    test.only('nfaTransitionTable', () => {
        
        console.log(unionNFA.getTransitionTable())
        console.log(unionNFA.getEpsilonClosure())
    })
    test('dfaTransitionTable', () => {
        debugger
        console.log(unionDFA.getTransitionTable())
    })

})

describe('closure', () => {
    let charNFA:NFA
    let closureNFA:NFA
    beforeEach(() => {
         charNFA = char('a')
         closureNFA = closure(charNFA)
    })
    test('a', () => {
        expect(closureNFA.test('a')).toBeTruthy()
    })
    test('aa', () => {
        expect(closureNFA.test('aa')).toBeTruthy()
    })
    test('empty', () => {
        expect(closureNFA.test('')).toBeTruthy()
    })
})

describe('re', () => {
    let reNFA: NFA
    beforeEach(() => {
        reNFA = union(concat(char('x'), closure(char('y'))), char('z'))
    })
    test('x', () => {
        expect(reNFA.test('x')).toBeTruthy()
    })
    test('xy', () => {
        expect(reNFA.test('xy')).toBeTruthy()
    })
    test('xyz', () => {
        expect(reNFA.test('xyy')).toBeTruthy()
    })
    test('z', () => {
        expect(reNFA.test('z')).toBeTruthy()
    })
    test('a', () => {
        expect(reNFA.test('a')).toBeFalsy()
    })
    test('', () => {
        expect(reNFA.test('')).toBeFalsy()
    })
})
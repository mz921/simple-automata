import NFA from "./NFA";
import {State} from "./state";
import { idDistributor } from "./utils";

const EPSILON = "ε";

// 创建一个单字符状态机
function char(symbol: string): NFA {
    const inState = new State(idDistributor.increment());
    const outState = new State(idDistributor.increment(), true);
    inState.addTransitionForSymbol(symbol, outState);
    return new NFA(inState, outState);
}

// 创建一个ε状态机
function ε(): NFA {
    return char(EPSILON);
}

// 创建两个NFA的连接

function concatPair(first: NFA, second: NFA):NFA {
    first.outState.accepting = false;
    second.outState.accepting = true;
    first.outState.addTransitionForSymbol(EPSILON, second.inState);
    return new NFA(first.inState, second.outState);
}

// 创建多个NFA的连接
function concat(first: NFA, ...rest: NFA[]): NFA {
    for (let fragment of rest) {
        first = concatPair(first, fragment);
    }
    return first;
}

// 创建两个或多个NFA的union(or)
function union(...rest: NFA[]):NFA {
    const start = new State(idDistributor.increment());
    const end = new State(idDistributor.increment(), true);

    for (let fragment of rest) {
        start.addTransitionForSymbol(EPSILON, fragment.inState);
        fragment.outState.addTransitionForSymbol(EPSILON, end);
        fragment.outState.accepting = false;
    }

    return new NFA(start, end);
}

// 创建一个NFA的闭包
function closure(fragment: NFA):NFA {
    const start = new State(idDistributor.increment());
    const end = new State(idDistributor.increment(), true);

    start.addTransitionForSymbol(EPSILON, fragment.inState);
    fragment.outState.accepting = false;
    fragment.outState.addTransitionForSymbol(EPSILON, end);
    end.addTransitionForSymbol(EPSILON, fragment.inState);
    start.addTransitionForSymbol(EPSILON, end);

    return new NFA(start, end);
}

export {
    char,
    ε,
    concat,
    union,
    closure
}
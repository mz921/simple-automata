import { State, idType } from "./state";

const EPSILON = "ε";

export default class NFA {
    // 简化问题，只有一个开始状态和一个接受状态
    inState: State;
    outState: State;
    constructor(inState: State, outState: State) {
        this.inState = inState;
        this.outState = outState;
    }

    // 传入钩子函数
    deepTraverse(handleStates?: Function, handleEpsilon?: Function): void {
        const stack: State[] = [];
        const visited = new Set<idType>();
        stack.push(this.inState);
        while (stack.length !== 0) {
            let curState = stack.pop()!;
            for (let [ch, nextStates] of curState.transitionMap) {
                let noEpsilon = true
                if (ch !== EPSILON) {
                    if (handleStates) handleStates(curState, nextStates, ch);
                } else {
                    if (handleEpsilon) handleEpsilon(curState, nextStates);
                    noEpsilon = false

                }
                if (noEpsilon) {
                    if (handleEpsilon) handleEpsilon(curState, [curState])
                }
                for (let nextState of nextStates) {
                    if (!visited.has(nextState.id)) {
                        stack.push(nextState);
                        visited.add(nextState.id);
                    }
                }
            }
        }
    }

    // 检测symbol是否能被NFA接受
    test(symbol: string): boolean {
        let curState = this.inState;
        let index = 0;
        let accecpting = false;
        //  不能出现不消耗symbol的环，否则会死循环
        const visited = new Set<idType>();
        const visitedIndex = new Map<idType, number>();

        function _test(curState: State, index: number): void {
            if (index === symbol.length && curState.accepting === true) {
                accecpting = true;
                return;
            }
            const nextStates = curState.getTransitionForSymbol(symbol[index]);
            const nextStatesByEpsilon = curState.getTransitionForSymbol(EPSILON);

            // 实现贪心策略
            if (nextStates) {
                for (const nextState of nextStates) {
                    if (!accecpting) {
                        _test(nextState, ++index);
                    }
                }
            }
            if (nextStatesByEpsilon) {
                for (const nextStateByEpsilon of nextStatesByEpsilon) {
                    if (!accecpting) {
                        const cycled =
                            visited.has(nextStateByEpsilon.id) &&
                            visitedIndex.get(nextStateByEpsilon.id) === index;
                        if (!cycled) {
                            visited.add(nextStateByEpsilon.id);
                            visitedIndex.set(nextStateByEpsilon.id, index);
                            _test(nextStateByEpsilon, index);
                        }
                    }
                }
            }
        }
        _test(curState, index);
        return accecpting;
    }

    getTransitionTable(): Map<idType, Map<string, State[]>> {
        const transitionTable = new Map<idType, Map<string, State[]>>();
        const handleStates = (curState: State, nextStates: State[], ch: string) => {
            if (!transitionTable.has(curState.id)) {
                transitionTable.set(
                    curState.id,
                    new Map<string, State[]>([[ch, nextStates]])
                );
            }else {
                transitionTable.set(
                    curState.id,
                    transitionTable.get(curState.id)!.set(ch, nextStates)
                )
            }   
        };
        this.deepTraverse(handleStates);
        return transitionTable;
    }

    getEpsilonClosure(): Map<idType, State[]> {
        const epsilonClosure = new Map<idType, State[]>();
        const handleEpsilon = (curState: State, nextStates: State[]) => {
            epsilonClosure.set(curState.id, nextStates.concat(curState));
        };
        this.deepTraverse(undefined, handleEpsilon);
        return epsilonClosure;
    }
}

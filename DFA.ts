import { State, idType } from "./state";
import { idDistributor } from "./utils";
import NFA from "./NFA";

interface NFAToDFAMap {
    dfaState: State;
    nfaStates: idType[];
}

export default class DFA {
    private _nfa: NFA;
    inState: State;
    outStates: State[];
    // 非接受状态，为了实现DFA最小化
    nonOutStates: State[];

    constructor(_nfa: NFA) {
        idDistributor.reset();
        this._nfa = _nfa;
        this.inState = new State(idDistributor.increment());
        this.outStates = [];
        this.nonOutStates = [];
        this.createDFA();
    }

    private createDFA() {
        const nfaEpsilonClosure = this._nfa.getEpsilonClosure();
        const nfaTransitinTable = this._nfa.getTransitionTable();
        const stack: NFAToDFAMap[] = [];
        const startDFA: NFAToDFAMap = {
            nfaStates: nfaEpsilonClosure.get(this._nfa.inState.id)!.map(s => s.id),
            dfaState: this.inState
        };
        stack.push(startDFA);
        while (stack.length !== 0) {
            let curNFAToDFAMap = stack.pop()!;
            let curNFAStates = curNFAToDFAMap.nfaStates;
            let curDFAState = curNFAToDFAMap.dfaState;
            let nextDFAStatesMap = new Map<string, idType[]>();
            for (let curNFAState of curNFAStates) {
                let nextNFAStatesMap = nfaTransitinTable.get(curNFAState);
                if (!nextNFAStatesMap) continue;
                for (let [ch, nextNFAStates] of nextNFAStatesMap) {
                    if (nextDFAStatesMap.has(ch)) {
                        nextDFAStatesMap.get(ch)!.concat(nextNFAStates.map(s => s.id));
                    } else {
                        let nextDFAStates: idType[] = [];
                        nextNFAStates.forEach(s => {
                            nextDFAStates.push(...nfaEpsilonClosure.get(s.id)!.map(s => s.id));
                        });
                        nextDFAStatesMap.set(ch, nextDFAStates);
                    }
                }
            }
            for (let [ch, states] of nextDFAStatesMap) {
                let nextDFAState: State;
                if (
                    states.some(sID => {
                        return sID === this._nfa.outState.id;
                    })
                ) {
                    nextDFAState = new State(idDistributor.increment(), true);
                    this.outStates.push(nextDFAState);
                } else {
                    nextDFAState = new State(idDistributor.increment());
                    this.nonOutStates.push(nextDFAState)
                }
                curDFAState.addTransitionForSymbol(ch, nextDFAState);
                stack.push({
                    nfaStates: states,
                    dfaState: nextDFAState
                });
            }
        }
    }

    deepTraverse(handleState?: Function): void {
        const stack: State[] = [];
        const visited = new Set<idType>();
        stack.push(this.inState);
        while (stack.length !== 0) {
            let curState = stack.pop()!;
            for (let [ch, nextStates] of curState.transitionMap) {
                let nextState = nextStates[0];
                if (handleState) handleState(curState, nextState, ch);
                if (!visited.has(nextState.id)) {
                    stack.push(nextState);
                    visited.add(nextState.id);
                }
            }
        }
    }

    getTransitionTable(): Map<idType, Map<string, State>> {
        const transitionTable = new Map<idType, Map<string, State>>();
        const handleState = (curState: State, nextState: State, ch: string) => {
            if (!transitionTable.has(curState.id)) {
                transitionTable.set(
                    curState.id,
                    new Map<string, State>([[ch, nextState]])
                );
            } else {
                transitionTable.set(
                    curState.id,
                    transitionTable.get(curState.id)!.set(ch, nextState)
                );
            }
        };
        this.deepTraverse(handleState);
        return transitionTable;
    }

    minimize() {
        // TODO

        
    }
}

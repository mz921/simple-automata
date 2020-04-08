export type idType = number | string

export class State {
    id: idType;
    accepting: boolean;
    transitionMap: Map<string, State[]>;
    constructor(id: idType, accepting = false) {
        this.id = id;
        this.accepting = accepting;
        this.transitionMap = new Map<string,State[]>()
    }

    addTransitionForSymbol(symbol: string, state: State) :void {
        let states: State[] | undefined
        if (states = this.transitionMap.get(symbol)){
            states.push(state)
        }else {
            this.transitionMap.set(symbol,[state])
        }
    }

    getTransitionForSymbol(symbol:string): State[] | undefined{
        
        return this.transitionMap.get(symbol)
    }

}


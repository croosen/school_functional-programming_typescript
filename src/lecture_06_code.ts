import { Fun } from './Fun'
import * as Immutable from 'immutable'


type Unit = {}

type Pair<a,b> = {
    fst: a
    snd: b
}

let Pair = <a,b>(x: a, y: b) : Pair<a,b> => {
    return {
        fst: x,
        snd: y
    }
}

let map_Pair = <a, a1, b, b1>(f: Fun<a,a1>, g: Fun<b,b1>) : Fun<Pair<a,b>, Pair<a1,b1> => {
    // use f.f from the function, pass p.fst
    return Fun((p: Pair<a,b>) => Pair<a1,b1>(f.f(p.fst), g.f(p.snd)))
}

// Monad = functor + unit + bind


// Pair<a,s> a = first result, s = state
// (State s) a < operations do not effect s, only a / s is only data storage
// a = store result of computation
type State<s,a> = Fun<s, Pair<a,s>>

let map_State = <s, a, b>(f: Fun<a,b>) : Fun<State<s,a>, State<s,b>> => {
    // isolate the Pair<>, get rid of the Fun<> : Fun<s, Pair<a,s>>
    return Fun((p: State<s,a>) => p.then(map_Pair(f, id<s>())))
}

let unit_State = <s,a>() : Fun<a, State<s,a>> => {
    return Fun((x: a) => Fun((state: s) => Pair<a,s>(x, state)))
}

let apply = <a,b>() : Fun<Pair<Fun<a,b>, a>, b> => {
    Fun((p: Pair<Fun<a,b>,a>) => p.fst.f(p.snd))
}

// output flattened in single state
// let join_State = <s,a>() : Fun<State<s,State<s,a>>, State<s,a>> => {
//     return Fun((p: State<s,State<s,a>>) => p.then(apply()))
// }

// p can be called "process", like process, then apply
let join_State = <s,a>() : Fun<State<s,State<s,a>>, State<s,a>> =>
    Fun((p: State<s,State<s,a>>) => p.then(apply()))

let bind_State = <s,a,b>(p: State<s,a>, f: Fun<a, State<s,b>>) : State<s,b> => 
    map_State<s,a, State<s,b>>(f).then(join_State<s,b>()).f(p)

// state = memory, not to touch, state 2 = result from memory
let get_State = <s>() : State<s,s> => Fun((state: s) => Pair(state, state))

let set_State = <s>(state: s) : State<s, Unit> => 
    Fun((_: s) => Pair({}, state))

type Memory = Immutable.Map<string,number>
type Statement<a> = State<Memory, a>

// _var = because of reserved word
let setVar = (_var: string, value:number) : Statement<Unit> => {
    return bind_State(get_State(), Fun((m: Memory) => {
        let m1 = m.set(_var,value)
        return set_State(m1)
    }))
}

// !!!
let getVar = (_var: string) : Statement<number> => {
    return bind_State(get_State(), Fun((m: Memory) => {
        let m1 = m.get(_var)
        return unit_State<Memory, number>()
    }))
}

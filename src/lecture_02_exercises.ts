import { Fun } from './Fun'

type List<a> = {
    kind: 'Cons',
    head: a,
    tail: List<a>
} | {
    kind: 'Empty'
}

let Cons = function<a>(h: a, t: List<a>) : List<a> {
    return {
        kind: 'Cons',
        head: h,
        tail: t
    }
} 

let Empty = function<a>() : List<a> {
    return {
        kind: 'Empty'
    }
}

let mapList = function<a,b>(f: Fun<a,b>) : Fun<List<a>,List<b>> {
    let map = (l: List<a>) : List<b> => {
        if (l.kind == 'Empty') {
            return EmptyList<b>()
        } else {
            let otherlist = map(l.tail)
            return List<b>(f.f(l.head), otherlist)
        }
    }
}

let l = Cons(6,Cons(5,Empty()))
let l_2 = Cons(6,Cons(5,Cons(7,Empty())))
console.log(l_2)

// let encode = function<a>() : Fun<number, Fun<List<string>, List<string>>> {
//     return Fun()
// }

type Exeption<a> = {
    kind: 'Result'
    value: a
} | {
    kind: 'Error'
    msg: a
}

let Result = function<a>(v: a) : Exeption<a> {
    return {
        kind: 'Result',
        value: v
    }
}

let Error = function<a>(msg: a) : Exeption<a> {
    return {
        kind: 'Error',
        msg: msg
    }
}

// Tile; terrain, town, army
type Tyle<a, b> = {
    kind: (i:a) => b
}

let Tyle = function<a, b>(f:(_:a) => b) : Tyle<a, b> {
    return {
        kind: f
    }
}





import { Fun } from './Fun'

let convert = Fun<number, string>(x => String(x))
let incr = Fun((x: number) => x + 1)
let double = Fun<number, number>(x => x + x)


// Functor: transorms F<a> to F<b> with a mapping function

type Option<a> = {
    kind: "none"
} | {
    kind: "some",
    value: a
}

let None = function<a>() : Option<a> {
    return {
        kind: "none"
    }
}

let Some = function<a>(value: a) : Option<a> {
    return {
        kind: "some",
        value: value
    }
}

let map_Option = function<a, b>(f: Fun<a, b>) : Fun<Option<a>, Option<b>> {
    let g = (opt: Option<a>) : Option<b> => {
        if (opt.kind == "none") {
            return None<b>()
        } else {
            // apply function f (type a to b) and return b
            return Some<b>(f.f(opt.value))
        }
    }
    return Fun<Option<a>, Option<b>>(g)
}

let foo = Fun<number, number>(x => x + 1)
let id = <a>() => Fun<a, a>((x: a) => x)
// let id = function<a>() { return Fun<a, a>((x: a) => x) }

let opt = Some<string>("hi")
let opt2 = Some<number>(5)
let res1 = id<Option<string>>().f(opt) //f = field f of Fun wrapper
let res2 = map_Option<string, string>(id<string>()).f(opt)

console.log(res1)
console.log(res2)

let convert1 = map_Option(incr).then(map_Option(double)).then(map_Option(convert)).f(opt2)
let convert2 = map_Option(incr.then(double).then(convert)).f(opt2)

console.log(convert1)
console.log(convert2)

// Combine functors
// x + 0 = 0 + x = x
// (x + y) + z = x + (y + z)
// x + y + z
// == MONOID
// data type with an operation

interface Tuple<a, b> {
    fst: a
    snd: b
}

let sum = Fun<Tuple<number, number>, number>((p: Tuple<number, number>) => p.fst + p.snd)

// from compositon to one Option
// for example, a function with a function within
let join_Option = function<a>(nestedOption: Option<Option<a>>) : Option<a> {
    if (nestedOption.kind == "none") {
        return None<a>()
    } else {
        return nestedOption.value // is already a some, so no Option<>
    }
}

// let requestConnection = function() : string {
//     if (Math.random() < 0.75) {
//         return Some<string>("Connection accepted")
//     } else {
//         return None<string>()
//     }
// }
//
// let writeResult = function() : Option<Option<string>> {
//     if (Math.random() < 0.9) {
//         return Some<Option<string>>(requestConnection())
//     } else {
//         return None<Option<string>>()
//     }
// }

// let result = writeResult()

type List<a> = {
    kind: "empty"
} | {
    kind: "::"
    head: a
    tail: List<a>
}

let Empty = function<a>() : List<a> { return { kind: "empty" } }
let Cons = function<a>(h: a, t: List<a>) : List<a> {
    return {
        kind: "::",
        head: h,
        tail: t
    }
}

let map_List = function<a, b>(f: Fun<a, b>) : Fun<List<a>, List<b>> {
    let g = (l: List<a>) : List<b> => {
        if (l.kind == "empty") {
            return Empty<b>()
        } else {
            let otherList = g(l.tail)
            return Cons<b>(f.f(l.head), otherList)
        }
    }
    return Fun<List<a>, List<b>>(g)
}

// constructor for monoid, building a list
let unit = function<a>(x: a) : Fun<a, List<a>> {
    let g = <a>(x: a) : List<a>  => {
        return Cons<a>(x, Empty<a>())
    }
    return Fun<a, List<a>>(g)
}

// Join, concat (not flatten) to make join, you need concat
// [[x,x,x],[x,x,x],[x,x]]


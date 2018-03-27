import { Fun } from './Fun'

let increment = Fun<number, number>(x => x + 1)
let double = Fun<number, number>(x => x + x)
let isEven = Fun<number, boolean>(x => x % 2 == 0)

type Option<a> = {
    kind: 'none'
} | {
    kind: 'some',
    value: a
}

let None = function<a>() : Option<a> {
    return {
        kind: 'none'
    }
} 

let Some = function<a>(x:a) : Option<a> {
    return {
        kind: 'some',
        value: x
    }
}

let map_Option = function<a,b>(f: Fun<a,b>) : Fun<Option<a>,Option<b>> {
    //return Fun(x => x.kind == 'none' ? None<b>() : Some<b>(f.f(x.kind)))

    let mapp = (o: Option<a>) : Option<b> => {
        if (o.kind == 'none') {
            return None<b>()
        } else {
            return Some<b>(f.f(o.kind))
        }
    }
    return Fun<Option<a>,Option<b>>(mapp)
}

let pipeline: Fun<Option<number>,Option<boolean>> = map_Option(increment.then(double))

let o_1: Option<number> = ({ kind: 'some', value: 11 })

console.log(pipeline.f(o_1))
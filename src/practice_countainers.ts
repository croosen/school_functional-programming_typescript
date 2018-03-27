import { Fun } from './Fun'

type Countainer<a> = {
    content: a,
    counter: number
}

let Countainer = function<a>(c: a) : Countainer<a> {
    return {
        content: c,
        counter: 0
    }
}

// mapper
let map_countainer = function<a,b>(f: Fun<a,b>) : Fun<Countainer<a>,Countainer<b>> {
    let mapp = (c: Countainer<a>) => {
        let result = f.f(c.content)
        return Countainer<b>(result)
    }
    return Fun<Countainer<a>,Countainer<b>>(mapp)
}

let c_1: Countainer<string> = ({content: 'blaat', counter: 10})
let c_2: Countainer<number> = ({content: 20, counter: 10})
let c_3: Countainer<Array<string>> = ({content: ['aap', 'banaan'], counter: 30})

let incr = Fun((x: number) => x + 1)
let incr_countainer : Fun<Countainer<number>,Countainer<number>> = map_countainer(incr)
console.log(incr_countainer.f(c_1))




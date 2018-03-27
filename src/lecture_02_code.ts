import { Fun } from './Fun'

let isEven = Fun<number, boolean>(x => x % 2 == 0)
let incr = Fun((x: number) => x + 1)

interface Countainer<a> {
    content: a // can be anything
    counter: number
}

let Countainer = function<a>(c: a) : Countainer<a> {
    return {
        content: c,
        counter: 0
    }
}

// FUNCTOR
// F<a>
// map_F<a,b>
// preserve identity
// id<F<a>> == map_F<a, a>(id<a>)
// takes content of container, puts new container, get back same container
// map_F<a,b>(f).then(map_F<b,c>(g)) == map_F<a,c>(f.then(g))

let id = function<a>() { return Fun<a, a>(x => x) }


// Transform Countainer with number to new Countainer with boolean
// Give a functoin isEven and a Countainer with number, for example 10
let transContainerNumtoBool = function(f: Fun<number, boolean>, c: Countainer<number>) : Countainer<boolean> {
    return {
        content: f.f(c.content), // give 10 to the function (isEven), this returns a boolean
        counter: c.counter
    }
}

// More generic map Countainer
let mapCountainerSimple = function<a, b>(f: Fun<a, b>, c: Countainer<a>) : Countainer<b> {
    return {
        content: f.f(c.content),
        counter: c.counter
    }
}

// More more generic, to be able to chain functions, return a Fun with from Countainer a to Countainer b
// With this, we can use the "then"
let mapCountainer = function<a, b>(f: (_:a) => b) : Fun<Countainer<a>, Countainer<b>> {
    // return Fun(c => { content: f.f(c.content), counter: c.counter })

    // return Fun<Countainer<a>, Countainer<b>>((c: Countainer<a>) => {
    //     return Countainer<b>({content: f.f(c.content)})
    // })

    let mapping = (x: Countainer<a>) => {
        let result = f(x.content)
        return Countainer<b>(result)
    }
    return Fun<Countainer<a>, Countainer<b>>(mapping)
}

let mapCountainer2 = function<a, b>(f: Fun<a, b>) : Fun<Countainer<a>, Countainer<b>> {
    let mapping = (x: Countainer<a>) => {
        let result = f.f(x.content)
        return Countainer<b>(result)
    }
    return Fun<Countainer<a>, Countainer<b>>(mapping)
}

// let map_countainer = function<a,b>(f:Fun<a,b>) : Fun<Countainer<a>, Countainer<b>> { 
//   return Fun(c =>{ content:f.f(c.content), counter:c.counter })
// }




// Own stuff to try
// Magic Box of Tricks
interface MagicBox<T> {
    content: T,
    counter: number,
    happy: boolean
}

let MagicBox = function<a>(c: a) : MagicBox<a> {
    return {
        content: c,
        counter: 0,
        happy: true,
    }
}

let mbt1 : MagicBox<string> = ({ content: "hiiii", counter: 10, happy: true })
console.log(mbt1)

let mapMagicBox = function<a,b>(f: Fun<a,b>, c: MagicBox<a>) : MagicBox<b> {
    return {
        content: f.f(c.content),
        counter: c.counter,
        happy: c.happy
    }
}

// let mapMagicBox2 = function<a,b>(f: Fun<a,b>) : Fun<MagicBox<a>, MagicBox<b>> { 
//   return Fun(c => { content: f.f(c.content), counter: c.counter, happy:c.happy }) 
// }


let mapMagicBox3 = function<a, b>(f: Fun<a, b>) : Fun<MagicBox<a>, MagicBox<b>> {
    let mapping = (x: MagicBox<a>) => {
        let result = f.f(x.content) 
        return MagicBox<b>(result)
    }
    return Fun<MagicBox<a>, MagicBox<b>>(mapping)
}


let mbt2 : MagicBox<number> = { content: 3, counter: 0, happy: true }
mbt2.content = 10

let testMap : MagicBox<boolean> = mapMagicBox(isEven, mbt2)
console.log(testMap)

let testMap2 : MagicBox<boolean> = mapMagicBox(incr.then(isEven), mbt2)
console.log(testMap2)

let incr_mbt : Fun<MagicBox<number>, MagicBox<number>> = mapMagicBox3(incr)
let isEven_mbt : Fun<MagicBox<number>, MagicBox<boolean>> = mapMagicBox3(isEven)

console.log()






// type Option<'a>, discriminated union
// none or some of 'a (in F#)
// option = keyword type !!! if use unions, you must use type, no interface
type Option<a> = {
    kind: "none"
} | {
    kind: "some"
    value: a
}

let none = function<a>() : Option<a> { return { kind: "none" } }
let some = function<a>(value: a) : Option<a> { return { kind: "some", value: value } }

let mapOption = function<a,b>(f: (_:a) => b) : Fun<Option<a>, Option<b>> {
    let mapping = (opt: Option<a>) => {
        if (opt.kind == "none") {
            return none<b>()
        } else {
            let result = f(opt.value)
            return some<b>(result)
        }
    }
    return Fun<Option<a>, Option<b>>(mapping)
}

export let main = () => {
    let c : Countainer<number> = Countainer(515)
    let id1 = id<Countainer<number>>().f(c) //should give back same object as c
    let f = (x: number) => String(x)
    let g = (x: String) => x + " Hi!"

    let compose1 = mapCountainer<number, string>(f).then(mapCountainer<string, string>(g)).f(c)
    // let compose2 = mapCountainer<number, string>((Fun(f).then(Fun(g))).f).f(c)
    // console.log(compose1)
    // console.log(compose2)

    // let incr_countainer : Fun<Countainer<number>,Countainer<number>> = mapCountainer(incr)
    // let is_countainer_even : Fun<Countainer<number>,Countainer<boolean>> = mapCountainer(isEven)

    // let my_f = incr_countainer.then(is_countainer_even)
    // console.log(mapCountainer2<number, string>(isEven).f(c))

    // let my_g = incr_countainer.then(is_countainer_even).then(tick)
    // console.log(incr_countainer.then(tick).f(c))
    // return Fun(c => { content: f.f(c.content), counter: c.counter })
    // let tick : Fun<Countainer<number>, Countainer<number>> = Fun( c => ( { ...c, counter: c.counter + 1 } ))

    // console.log( c.my_g )


    // Option
    // let n = none<number>()
    // let s = some<number>(5)
    // let idn1 = id<Option<number>>().f(n)
    // let idn2 = mapOption(id<number>().f).f(n)
    // let ids1 = id<Option<number>>().f(s)
    // let ids2 = mapOption(id<number>().f).f(s)

    // console.log(idn1, idn2)
    // console.log(ids1, ids2)

    // console.log(map_Countainer(f).f(c))
    // console.log(c)
    // console.log(id1)
    // console.log(map_Countainer(id<number>().f).f(c)) //id2
}

main()

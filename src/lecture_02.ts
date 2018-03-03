// The Wrapper Datatype
// Fun takes a ---function--- with type a and returns a ---function--- with type b
// same as f : a -> b
// Signature
interface Fun<a, b> {
    f: (i:a) => b,
    then:<c>(g: Fun<b, c>) => Fun<a, c>,
    repeat: (n: number) => Fun<a, a>
    repeatUntil: (predicate: Fun<a, boolean>) => Fun<a, a>
}

// Lifter, takes and returns a Func
// Function that takes an a
// returns TYPE Fun<a, b>
// (_:a) => b is given to the first a
let Fun = function<a, b>(f:(_:a) => b) : Fun<a, b> {
    return {
        f:f,
        then: function<c>(this: Fun<a, b>, g: Fun<b, c>) : Fun<a, c> {
            return then(this, g)
        },
        repeat: function(this: Fun<a, a>, n: number) : Fun<a,a> {
            return repeat(this, n)
        },
        repeatUntil: function(this: Fun<a, a>, predicate: Fun<a, boolean>) : Fun<a, a> {
            return repeatUntil(this, predicate)
        }
    }
}

// f : a -> b and g : b -> c = (f;g) : a -> c (first f then g) = input a and output c
// because f needs an a, do not output but give to g, then output c
let then = function<a, b, c>(f: Fun<a, b>, g: Fun<b, c>) : Fun<a, c> {
    return Fun<a, c>(a => g.f(f.f(a)))
}

// Complete the code of repeat, which repeats a function n times.
let repeat = function<a>(f: Fun<a, a>, n: number): Fun<a, a> {
    return n > 0 ? f.then(repeat(f, n - 1)) : f;
}

// Extend the type Fun<a, b> with an additional method repeatUntil
// that takes a predicate and repeats a function until the predicate returns false.
// predicate: isEven
let repeatUntil = function<a>(f: Fun<a, a>, predicate: Fun<a, boolean>) : Fun<a, a> {
    let g = (x: a) => {
        if (predicate.f(x)) {
            // return just once, because repeat untill iseven
            return x;
        }
        else {
            // else, keep repeating
            return g(f.f(x));
        }
    }
    return Fun((x: a) => g(x));
}

let isEven = Fun<number, boolean>(x => x % 2 == 0)

// =========================================================

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
let mapCountainer = function<a, b>(f: Fun<a, b>, c: Countainer<a>) : Countainer<b> {
    return {
        content: f.f(c.content),
        counter: c.counter
    }
}

let map_Countainer = function<a, b>(f: (_:a) => b) : Fun<Countainer<a>, Countainer<b>> {
    // return Fun<Countainer<a>, Countainer<b>>((x : Countainer<a>) => {
    //     let result = f(x.content)
    //     return Countainer<b>(result) // the function, in the function above, a will become b
    // })

    let mapping = (x : Countainer<a>) => {
        let result = f(x.content)
        return Countainer<b>(result)
    }
    return Fun<Countainer<a>, Countainer<b>>(mapping)
}

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
    let c: Countainer<number> = Countainer(515)
    let id1 = id<Countainer<number>>().f(c) //should give back same object as c
    let f = (x:number) => String(x)
    let g = (x:String) => x + " Hi!"

    // Countainer number to boolean
    let cNum: Countainer<number> = Countainer(100)
    console.log("Countainer num to bool: ")
    console.log(transContainerNumtoBool(isEven, cNum))

    // Map Countainer more generic
    let mc: Countainer<number> = Countainer(5)
    let md: Countainer<boolean> = mapCountainer(isEven, mc)
    console.log("Countainer num to bool generic: ")
    console.log(md)


    let compose1 = map_Countainer<number, string>(f).then(map_Countainer<string, string>(g)).f(c)
    // let compose2 = map_Countainer<number, string>((Fun(f).then(Fun(g))).f).f(c)
    console.log(compose1)

    // Option
    let n = none<number>()
    let s = some<number>(5)
    let idn1 = id<Option<number>>().f(n)
    let idn2 = mapOption(id<number>().f).f(n)
    let ids1 = id<Option<number>>().f(s)
    let ids2 = mapOption(id<number>().f).f(s)

    console.log(idn1, idn2)
    console.log(ids1, ids2)

    // console.log(map_Countainer(f).f(c))
    // console.log(c)
    // console.log(id1)
    // console.log(map_Countainer(id<number>().f).f(c)) //id2
}

main()

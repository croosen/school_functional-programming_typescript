// The Wrapper Datatype
// Fun takes a ---function--- with type a and returns a ---function--- with type b
// same as f : a -> b
// Signature
export default interface Fun<a, b> {
    f: (i:a) => b,
    then:<c>(g: Fun<b, c>) => Fun<a, c>,
    repeat: (n: number) => Fun<a, a>
    repeatUntil: (predicate: Fun<a, boolean>) => Fun<a, a>
}

// Lifter, takes and returns a Func
// Function that takes an a
// returns TYPE Fun<a, b>
// (_:a) => b is given to the first a
export let Fun = function<a, b>(f:(_:a) => b) : Fun<a, b> {
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
export let then = function<a, b, c>(f: Fun<a, b>, g: Fun<b, c>) : Fun<a, c> {
    return Fun<a, c>(a => g.f(f.f(a)))
}

// Complete the code of repeat, which repeats a function n times.
export let repeat = function<a>(f: Fun<a, a>, n: number): Fun<a, a> {
    return n > 0 ? f.then(repeat(f, n - 1)) : f;
}

// Extend the type Fun<a, b> with an additional method repeatUntil
// that takes a predicate and repeats a function until the predicate returns false.
// predicate: isEven
export let repeatUntil = function<a>(f: Fun<a, a>, predicate: Fun<a, boolean>) : Fun<a, a> {
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

export * from "./Fun";
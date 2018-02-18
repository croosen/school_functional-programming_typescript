// The Wrapper Datatype
// f: take a Func of type a and make it a Func of type b
// Func takes a ---function--- with type a and returns a ---function--- with type b
// same as f : a -> b
type Fun<a,b> = {
    f: (i:a) => b,
    then:<c>(g:Fun<b, c>) => Fun<a, c>,
    repeat: (n: number) => Fun<a, a>
}

// Lifter, takes and returns a Func
// Function that takes an a and b
// returns TYPE Func<a, b>
// (_:a) => b is given to the first a
let Fun = function<a,b>(f:(_:a) => b) : Fun<a,b> {
    return {
        f:f,
        then:function <c>(this:Fun<a, b>, g:Fun<b, c>) : Fun<a, c> {
            return then(this,g)
        },
        repeat: function(this:Fun<a, a>, n: number): Fun<a,a> {
            return repeat(this, n);
        }
    }
}

// f : a -> b and g : b -> c = (f;g) : a -> c (first f then g) = input a and output c
// because f needs an a, do not output but give to g, then output c
let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
    return Fun<a,c>(a => g.f(f.f(a)))
}

// Complete the code of repeat, which repeats a function n times.
let repeat = function<a>(f: Fun<a,a>, n: number): Fun<a,a> {
    return n > 0 ? f.then(repeat(f, n - 1)) : f;
}

let repeatUntil = function<a>(f: Fun<a, a>, predicate: Fun<a, boolean>) : Fun<a, a> {
    let g = (x: a) => {
        if (predicate.f(x)) {
            //COMPLETE
        } else {
            //COMPLETE
        }
    }
    return //COMPLETE
}

repeatUntil: function(this: Fun<a, a>): Fun<Fun<a, boolean>, Fun<a, a>> {
  return {
        f: f,
        then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
            return Fun<a, c>(a => g.f(this.f(a)))},
        repeatUntil: function(this: Fun<a, a>): Fun<(_: a) => boolean, Fun<a, a>> {
            //COMPLETE
        }
    }
}

// Functions
let increment = Fun<number, number>(x => x + 1) // given a, returns a b (a+1)
let double = Fun<number, number>(x => x + x)
let toggle = Fun<boolean, boolean>(x => !x)
let isEven = Fun<number, boolean>(x => x % 2 == 0)
let multiply = Fun<number, number>(x => x * x)
let stringify = Fun<number, string>(x => String(x))

let increment_twice = increment.then(increment)
let double_twice = double.then(double)
let double_then_isEven = double.then(isEven)
let stuff = increment.then(stringify)

let mofoFunctionComposition = increment.then((multiply.then(double.then(increment))))

// ====== ASSIGNMENTS ====== //
let incr = Fun((x: number) => x + 1)
let double2 = Fun((x: number) => x * 2)
let square = Fun((x: number) => x * x)
let isPositive = Fun((x: number) => x > 0)
let isEven2 = Fun((x: number) => x % 2 == 0)
let invert = Fun((x: number) => -x)
let squareRoot = Fun((x: number) => Math.sqrt(x))
let ifThenElse = function<a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>) : Fun<a, b> {
    return Fun((x: a) => {
        if (p.f(x)) {
            console.log("true")
            return _then.f(x)
        }
        else {
            console.log("false")
            return _else.f(x)
        }
    })
}


let start = 10
console.log("Input: " + start)
console.log("Increment, stringify: " + stuff.f(start))
console.log("Increment: " + increment.f(start))
console.log("Double: " + double.f(start))
console.log("Increment twice: " + increment_twice.f(start))
console.log("Double, even?: " + double_then_isEven.f(start))
console.log("Mofo Function (increment, multiply, double, increment): " + mofoFunctionComposition.f(start))
console.log("Increment, positive?: " + incr.then(isPositive).f(start))
console.log("Increment, repeat, direct: " + repeat(incr, 5).f(start))
console.log("Increment, repeat, chain: " + incr.repeat(5).f(start))
console.log("Increment, double, positive?: " + incr.then(double).then(isPositive).f(start))

// Implement a function that computes the square root if the input is positive, otherwise inverts it and then performs the square root
console.log("Positive ? squareroot : squareroot.invert: " + ifThenElse(isPositive, squareRoot, invert.then(squareRoot)).f(start))

// Square a number and then if it is even invert it otherwise do the square root
console.log("Square, even? squreroot.invert : squreroot: " + square.then(ifThenElse(isEven2, invert, squareRoot)).f(10))

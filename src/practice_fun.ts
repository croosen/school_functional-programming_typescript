
// Takes values of type A and returns values of type B
// (i:a) is the signature, takes some A => B
// MyType is a SIGNATURE for the A => B Function
type MyType<a,b> = {
    f: (i:a) => b,
    then: <c>(g: MyType<b,c>) => MyType<a,c>,
    repeat: (n: number) => MyType<a,a>
}

// This is the A => B Function
// name = function<type,type>(signature) : return type {}
let MyType = function<a,b>(f : (_:a) => b) : MyType<a,b> {
    return {
        // return f : a => b (f)
        f: f,
        then: function<c>(this: MyType<a,b>, g: MyType<b,c>) : MyType<a,c> {
            // combine this function (f) then g
            return then(this,g)
        },
        repeat: function(this: MyType<a,a>, n: number) : MyType<a,a> {
            return repeat(this, n)
        }
    }
}

let repeat = function<a>(f: MyType<a,a>, n: number): MyType<a,a> {
    // when n is lower than or 0, just return f once
    if (n <= 0) {
      return f
    }
    // else, return function, then repeat function again and decrease counter n
    else {
      return f.then(repeat(f, n - 1))
    }
}

// Functions
// Calls let MyType
// Does not call Type MyType, this is only the signature
let increment = MyType<number, number>(x => x + 1) // let MyType
let double = MyType<number, number>(x => x * x)
let is_even = MyType<number, boolean>(x => x % 2 == 0)

// Function composition
// f : a -> b and g : b -> c
// (f,g) : a -> c
// first f, then g

// Operator to make one function out of 2
let then = function<a,b,c>(f: MyType<a,b>, g: MyType<b,c>) : MyType<a,c> {
    // return a lifter let MyType, wich returns a Type MyType
    return MyType<a,c>(a => g.f(f.f(a)))
}

let increment_twice = increment.then(increment)

console.log(increment_twice.f(5)) // 7

let MoFoComposition = increment.then(increment.then(increment))

console.log(MoFoComposition.f(5)) // 8

// Identity function
// Neutral element of composition
// Says that f.then(id()) and id().then(f) is the same
// id<number>()
let id = function<a>() { 
    return MyType<a, a>(x => x) 
}

// Testing
let convert = MyType<number, string>((x: number) => String(x))
console.log(increment.then(convert).then)

// Assignments from Grande Omega
let incr = MyType((x: number) => x + 1)
let double2 = MyType((x: number) => x * 2)
let square = MyType((x: number) => x * x)
let isPositive = MyType((x: number) => x > 0)
let isEven = MyType((x: number) => x % 2 == 0)
let squareRootinvert = MyType((x: number) => -x)
let squareRoot = MyType((x: number) => Math.sqrt(x))
let ifThenElse =
    function<a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>) : Fun<a, b> {
        return MyType((x: a) => {
        if (p.f(x)) {
            return _then.f(x)
        }
        else {
            return _else.f(x)
        }
    })
}

console.log(incr.then(isPositive).f(5))
console.log(incr.then(double2).then(isPositive).f(5))

// Implement a function that computes the square root if the input is positive, 
// otherwise inverts it and then performs the square root
console.log(ifThenElse(isPositive, squareRoot, squareRootinvert).f(-5))

// Square a number and then if it is even invert it otherwise do the square root
console.log(square.then(ifThenElse(isEven, squareRootinvert, squareRoot)).f(5))



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


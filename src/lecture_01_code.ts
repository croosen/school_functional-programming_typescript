import { Fun } from './Fun'

// Functions
let increment = Fun<number, number>(x => x + 1) // given a, returns a b (a+1)
let double = Fun<number, number>(x => x + x)
let negate = Fun<boolean, boolean>(x => !x)
let isEven = Fun<number, boolean>(x => x % 2 == 0)
let multiply = Fun<number, number>(x => x * x)
let stringify = Fun<number, string>(x => String(x))

// Functions composition
let increment_twice = increment.then(increment)
let double_twice = double.then(double)
let double_then_isEven = double.then(isEven)
let incr_then_stringify = increment.then(stringify)
let mofoFunctionComposition = double_twice.then(increment.then((multiply.then(double.then(increment)))))

// ====== ASSIGNMENTS (Grande Omega) ====== //
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
            return _then.f(x)
        }
        else {
            return _else.f(x)
        }
    })
}

let start = 10

// console.log("Input: " + start)
// console.log("Increment: " + increment.f(start))
// console.log("Double: " + double.f(start))
// console.log("Increment twice: " + increment_twice.f(start))
// console.log("Double, even?: " + double_then_isEven.f(start))
// console.log("Mofo Function (increment, multiply, double, increment): " + mofoFunctionComposition.f(start))
// console.log("Mofo Function repeat * 5: " + repeat(mofoFunctionComposition, 5).f(start))
// console.log("Increment, positive?: " + incr.then(isPositive).f(start))
// console.log("Increment, repeat, direct: " + repeat(incr, 5).f(start))
// console.log("Increment, repeat, chain: " + incr.repeat(5).f(start))
// console.log("Increment, double, positive?: " + incr.then(double).then(isPositive).f(start))

// Implement a function that computes the square root if the input is positive, otherwise inverts it and then performs the square root
// console.log("Positive ? squareroot : squareroot.invert: " + ifThenElse(isPositive, squareRoot, invert.then(squareRoot)).f(start))

// Square a number and then if it is even invert it otherwise do the square root
// console.log("Square, even? sqaureroot.invert : squreroot: " + ifThenElse(isPositive, squareRoot, squareRootinvert).f(start))

// Repeat a function untill the predicate function returns true
// console.log("Increment, repeatUntill isEven, direct: " + repeatUntil(incr, isEven).f(start))
// console.log("Increment, repeatUntill isEven, chain: " + incr.repeatUntil(isEven).f(start))

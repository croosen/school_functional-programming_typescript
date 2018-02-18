// The Wrapper Datatype
// f: take a Func of type a and make it a Func of type b
// Func takes a ---function--- with type a and returns a ---function--- with type b
// same as f : a -> b
type Fun<a,b> = {
    f: (i:a) => b,
    then:<c>(g:Fun<b,c>) => Fun<a,c>
}

// Lifter, takes and returns a Func
// Function that takes an a and b
// returns TYPE Func<a, b>
// (_:a) => b is given to the first a
let FunLifter = function<a,b>(f:(_:a) => b) : Fun<a,b> {
    return {
        f:f,
        then:function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
            return then(this,g)
        }
        // repeat: function(this:Fun<a,a>) : Fun<number,Fun<a, a>> {
        //     // KUT
        // }
    }
}

// f : a -> b and g : b -> c = (f;g) : a -> c (first f then g) = input a and output c
// because f needs an a, do not output but give to g, then output c
let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
    return FunLifter<a,c>(a => g.f(f.f(a)))
}

// Complete the code of repeat, which repeats a function n times.
// let repeat = function<a>(f: Fun<a,a>, n: number): Fun<a,a> {
//     if (n <= 0) {
//         return f
//     }
//     else {
//         return FunLifter<a,a>(a => a * n)
//     }
// }

// Functions
let increment = FunLifter<number, number>(x => x + 1) // given a, returns a b (a+1)
let double = FunLifter<number, number>(x => x + x)
let toggle = FunLifter<boolean, boolean>(x => !x)
let isEven = FunLifter<number, boolean>(x => x % 2 == 0)
let multiply = FunLifter<number, number>(x => x * x)
let stringyfy = FunLifter<number, string>(x => String(x))

let increment_twice = increment.then(increment)
let double_twice = double.then(double)
let double_then_isEven = double.then(isEven)
let stuff = increment.then(stringyfy)

// console.log(stuff.f(5))

// console.log(increment.f(5))
// console.log(double.f(10))

// console.log(increment_twice.f(10)) // 12
// console.log(double_then_isEven.f(10)) // true
// console.log(double_then_isEven.f(5))

let mFLFunctionComposition = increment.then((multiply.then(double.then(increment))))

// console.log(mFLFunctionComposition.f(5))


// ====== ASSIGNMENTS ====== //
let incr = FunLifter((x: number) => x + 1)
let double2 = FunLifter((x: number) => x * 2)
let square = FunLifter((x: number) => x * x)
let isPositive = FunLifter((x: number) => x > 0)
let isEven2 = FunLifter((x: number) => x % 2 == 0)
let invert = FunLifter((x: number) => -x)
let squareRoot = FunLifter((x: number) => Math.sqrt(x))
let ifThenElse = function<a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>) : Fun<a, b> {
    return FunLifter((x: a) => {
        if (p.f(x)) {
            console.log("trueee")
            return _then.f(x)
        }
        else {
            console.log("falsy")
            return _else.f(x)
        }
    })
}

// Increment a number and then check if it is positive
// console.log(incr.then(isPositive).f(-10))

// Increment a number, double it and check if it is positive
// console.log(incr.then(double).then(isPositive).f(10))

// Implement a function that computes the square root if the input is positive, otherwise inverts it and then performs the square root
// console.log(ifThenElse(isPositive, squareRoot, invert.then(squareRoot)).f(-5))

// Square a number and then if it is even invert it otherwise do the square root
// console.log(square.then(ifThenElse(isEven2, invert, squareRoot)).f(6))

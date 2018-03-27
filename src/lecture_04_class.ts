import { Fun } from "../Lesson3/practicum3"

type Option<a> = {
  kind: "none"
} | {
  kind: "some"
  value: a
}

let None = function<a>(): Option<a> { return { kind: "none" } }
let Some = function<a>(content: a): Option<a> {
  return {
    kind: "some",
    value: content
  }
}

let map_Option = function<a, b>(mapper: Fun<a, b>): Fun<Option<a>, Option<b>> {
  let g = (opt: Option<a>): Option<b> => {
    if (opt.kind == "none") {
      return None<b>()
    }
    else {
      return Some<b>(mapper.f(opt.value))
    }
  }
  return Fun<Option<a>,Option<b>>(g)
}

type Unit = {}

interface Tuple<a, b> {
  fst: a
  snd: b
}

let join_Option = function<a>() : Fun<Option<Option<a>>, Option<a>> {
  let g = (opt: Option<Option<a>>) => {
    if (opt.kind == "none") {
      return None<a>()
    }
    else {
      return opt.value
    }
  }
  return Fun<Option<Option<a>>, Option<a>>(g)
}

let requestConnection = (): Fun<Unit, Option<string>> => {
  let g = (_: Unit): Option<string> => {
    if (Math.random() < 0.75) {
      return Some<string>("Connection accepted!")
    }
    else {
      return None<string>()
    }
  }
  return Fun<Unit, Option<string>>(g)
}

let writeResult = (): Fun<Unit, Option<Option<string>>> => {
  let g = (_: Unit) => {
    if (Math.random() < 0.9) {
      return Some<Option<string>>(requestConnection().f({}))
    }
    else {
      return None<Option<string>>()
    }
  }
  return Fun(g)
}

let printToOutput = (): Fun<Unit, Option<Option<Option<string>>>> => {
  let g = (_: Unit) => {
    if (Math.random() < 0.9) {
      return Some<Option<Option<string>>>(writeResult().f({}))
    }
    else {
      return None<Option<Option<string>>>()
    }
  }
  return Fun(g)
}

type List<a> = {
  kind: "empty" //[]
}  | {
  kind: "::" // x :: y
  head: a
  tail: List<a>
}

let Empty = function<a>(): List<a>  { return { kind: "empty" } }
let Cons = function<a>(h: a, t: List<a>): List<a> {
  return {
    kind: "::",
    head: h,
    tail: t
  }
}

let map_List = function<a, b>(f: Fun<a, b>): Fun<List<a>, List<b>> {
  let g = (l: List<a>): List<b> => {
    if (l.kind == "empty") {
      return Empty<b>()
    }
    else {
      let otherList = g(l.tail)
      return Cons<b>(f.f(l.head),otherList)
    }
  }
  return Fun<List<a>, List<b>>(g)
}

let unit = function<a>(): Fun<a, List<a>> {
  let g = <a>(x: a): List<a> => {
    return Cons<a>(x,Empty<a>())
  }
  return Fun<a, List<a>>(g)
}

//[[3,5,4], [2,1,0], [0,-1]]

let i = 0
while (i < 10){
  i++
  console.log(printToOutput().then(join_Option()).then(join_Option()).f({}))
}


//x + 0 = 0 + x = x identity law
//(x + y) + z = x + (y + z) //associativity law

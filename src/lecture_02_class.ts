export interface Fun<a, b> {
  f: (i: a) => b,
  then: <c>(g: Fun<b, c>) => Fun<a, c>
}

export let Fun = function <a, b>(f: (_: a) => b): Fun<a, b> {
  return {
    f: f,
    then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
      return Fun<a, c>(a => g.f(this.f(a)))}
    }
  }

interface Countainer<a> {
  content: a
  counter: number
}

let Countainer = function<a>(c : a) : Countainer<a> {
  return { content: c, counter: 0 }
}

let id = function<a>(){return Fun<a, a>(x => x)}

//FUNCTOR
//F<a>
//map_F<a,b>
//id<F<a>>== map_F<a, a>(id<a>)
//map_F<a, b>(f).then(map_F<b,c>(g)) == map_F<a,c>(f.then(g))

let map_Countainer = function<a, b>(f: (_: a) => b) : Fun<Countainer<a>, Countainer<b>> {
  let mapping = (x : Countainer<a>) => {
    let result = f(x.content)
    return Countainer<b>(result)
  }
  return Fun<Countainer<a>, Countainer<b>>(mapping)

}

//OPTIONAL FUNCTOR

/* 
type Option<'a> =
| None
| Some of 'a

*/

type Option<a> = {
  kind: "none"
} | {
  kind: "some"
  value: a
}

let none = function<a>() : Option<a> { return { kind: "none" } }
let some = function<a>(value: a) : Option<a> {
  return {
    kind: "some",
    value: value
  }
}

/*match opt with
| None -> None
| Some x -> Some(f(x))
*/
let map_Option = function<a, b>(f: (_: a) => b) : Fun<Option<a>, Option<b>> {
  let mapping = (opt: Option<a>) => {
    if (opt.kind == "none") {
      return none<b>()
    }
    else {
      let result = f(opt.value)
      return some<b>(result)
    }
  }
  return Fun<Option<a>, Option<b>>(mapping)
}


export let main = function() {
  //countainer
  let c : Countainer<number> = Countainer(515)
  let f = (x: number) => String(x)
  let g = (x: string) => x + " Hi!"
  let id1 = id<Countainer<number>>().f(c)
  let id2 = map_Countainer(id<number>().f).f(c)
  let compose1 = map_Countainer<number, string>(f).then(map_Countainer<string, string>(g)).f(c)
  let compose2 = map_Countainer<number,string>((Fun(f).then(Fun(g))).f).f(c)

  //option
  let n = none<number>()
  let s = some<number>(5)
  let idn1 = id<Option<number>>().f(n)
  let idn2 = map_Option(id<number>().f).f(n)
  let ids1 = id<Option<number>>().f(s)
  let ids2 = map_Option(id<number>().f).f(s)
  let compn1 = map_Option<number, string>(f).then(map_Option<string, string>(g)).f(n)
  let compn2 = map_Option<number, string>(Fun(f).then(Fun(g)).f).f(n)
  let comps1 = map_Option<number, string>(f).then(map_Option<string, string>(g)).f(s)
  let comps2 = map_Option<number, string>(Fun(f).then(Fun(g)).f).f(s)
  console.log(idn1, idn2)
  console.log(ids1, ids2)
  console.log(compn1, compn2)
  console.log(comps1, comps2)
}

main()
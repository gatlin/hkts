import {
  $,
  _,
  Functor,
  Monad
} from './base';

type Expr<A>
    = { tag: 'plus' ; l: A ; r: A }
    | { tag: 'times' ; l: A ; r: A }
    | { tag: 'paren' ; c: A }
    | { tag: 'num' ; n: number }
    ;

const plus = <A>(l: A, r: A): Expr<A> => ({ tag: 'plus', l, r });
const times = <A>(l: A, r: A): Expr<A> => ({ tag: 'times', l, r });
const paren = <A>(c: A): Expr<A> => ({ tag: 'paren', c });
const num = <A>(n: number): Expr<A> => ({ tag: 'num', n });

const ExprFunctor: Functor<Expr<_>> = {
  map: (f, expr) => {
    switch(expr.tag) {
      case 'plus': return plus(f(expr.l), f(expr.r));
      case 'times': return times(f(expr.l), f(expr.r));
      case 'paren': return paren(f(expr.c));
      default: return expr; } }};

function cata<F,A>(
    functor: Functor<_>,
    transformer: any,
    term: any
): A {
    const children_mapped = functor.map(
        (v: A) => cata(functor, transformer,v), term);
    const transformed = transformer(children_mapped);
    return transformed;
}

function _eval_expr(ex: Expr<number>): number {
    switch (ex.tag) {
        case 'plus': return ex.l + ex.r;
        case 'times': return ex.l * ex.r;
        case 'paren': return ex.c;
        default: return ex.n;
    }
}

const eval_expr = (ex: any): number => cata(ExprFunctor,_eval_expr,ex);
const expr1 =
  times(
    num(2),
    plus(
      num(1),
      num(3)));

const expr2 =
    times(
        num(2),
        times(
            paren(
                plus(
                    num(1),
                    num(1))),
            times(
                num(4),
                num(3))));

console.log(eval_expr(expr1));
console.log(eval_expr(expr2));

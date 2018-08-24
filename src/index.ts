declare const index: unique symbol;

export type _<N extends number = 0> = { [index]: N };

export interface $Array<T, S, N extends number> extends Array<$<T, S, N>> {}

// prettier-ignore
export type $<T, S, N extends number = 0> =
  T extends _<N> ? S :
  T extends undefined | null | boolean | string | number ? T :
  T extends Array<infer A> ? $Array<A, S, N> :
  T extends (x: infer I) => infer O ? (x: $<I, S, N>) => $<O, S, N> :
  T extends object ? { [K in keyof T]: $<T[K], S, N> } : T;

export interface Functor<F> {
  map: <A, B>(fa: $<F, A>, f: (a: A) => B) => $<F, B>;
}

export interface Monad<M> {
  pure: <A>(a: A) => $<M, A>;
  bind: <A, B>(ma: $<M, A>, f: (a: A) => $<M, B>) => $<M, B>;
}

export interface MonadLib<M> extends Monad<M>, Functor<M> {
  flatten: <A>(mma: $<M, $<M, A>>) => $<M, A>;
  // sequence, etc...
}

export const Monad = <M>({ pure, bind }: Monad<M>): MonadLib<M> => ({
  pure,
  bind,
  map: (ma, f) => bind(ma, a => pure(f(a))),
  flatten: mma => bind(mma, ma => ma),
});

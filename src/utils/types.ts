/**
 * For a type _T_, when the _Discriminator_ is equal to any of the _Values_, all the _Require_
 * properties will be non-nullable.
 */
export type RequireWithDiscriminator<
    T,
    Discriminator extends keyof T,
    Values extends T[Discriminator],
    Require extends keyof T,
> =
    | T & {[k in Discriminator]: Exclude<T[Discriminator], Values>}
    | T & {[k in Discriminator]: Values} & {[K in Require]-?: NonNullable<T[K]>};

export type RequiredNonNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>
};

/**
 * Make all properties in T nullable.
 */
export type NullableObject<T> = {
    [P in keyof T]: T[P] | null;
};

export type PickOptional<V, K extends keyof V> = Pick<Partial<V>, K> & Omit<V, K>;
export type PickRequired<V, K extends keyof V> = RequiredNonNull<Pick<V, K>> & Omit<V, K>;

type AllKeys<T> = T extends unknown ? keyof T : never;
type Id<T> = T extends infer U ? {[K in keyof U]: U[K]} : never;
type ExclusiveUnionHelper<T, K extends PropertyKey> =
    T extends unknown
        ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>>
        : never;
/**
 * Only allow one of the union types and not a combination of both.
 * https://stackoverflow.com/questions/46370222/why-does-a-b-allow-a-combination-of-both
 * https://github.com/Microsoft/TypeScript/issues/14094
 */
export type ExclusiveUnion<T> = ExclusiveUnionHelper<T, AllKeys<T>>;

/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * Noop type only to be used in intersection.
 * See https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
 */
export type Noop = {};
/* eslint-enable @typescript-eslint/consistent-type-definitions */
/* eslint-enable @typescript-eslint/ban-types */

/**
 * For a type _T_, when the _Discriminator_ is equal to any of the _Values_, all the _Require_
 * properties will be non-nullable.
 */
export type RequireWithDiscriminator<
    T,
    Discriminator extends keyof T,
    Values extends T[Discriminator],
    Require extends keyof T
> =
    | T & {[k in Discriminator]: Exclude<T[Discriminator], Values>}
    | T & {[k in Discriminator]: Values} & {[K in Require]: NonNullable<T[K]>};

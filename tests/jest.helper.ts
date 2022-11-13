/**
 * Error throw if the function passed to {@link jestGetError} and {@link jestGetErrorAsync} does not
 * throw.
 */
export class NoErrorThrownError extends Error {
    constructor() {
        super('Function did not throw an error');
    }
}

/**
 * Catch the error thrown in the given function. If the given function does not error, an error
 * will be thrown.
 *
 * This is explained in
 * <https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-conditional-expect.md>
 */
export function jestGetError<TError>(call: () => unknown): TError {
    try {
        call();
    } catch (error) {
        return error as TError;
    }

    throw new NoErrorThrownError();
}

/**
 * Catch the error thrown in the given function. If the given function does not error, an error
 * will be thrown.
 *
 * This is explained in
 * <https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-conditional-expect.md>
 */
export async function jestGetErrorAsync<TError>(call: () => Promise<unknown>): Promise<TError> {
    try {
        await call();
    } catch (error) {
        return error as TError;
    }

    throw new NoErrorThrownError();
}

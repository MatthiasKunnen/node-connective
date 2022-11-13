class NoErrorThrownError extends Error {
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

        throw new NoErrorThrownError();
    } catch (error) {
        return error as TError;
    }
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

        throw new NoErrorThrownError();
    } catch (error) {
        return error as TError;
    }
}

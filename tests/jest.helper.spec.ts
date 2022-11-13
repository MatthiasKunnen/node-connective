import {jestGetError, jestGetErrorAsync} from './jest.helper';

describe('jestGetError', () => {
    it('should return the thrown error', () => {
        const error: any = jestGetError(() => {
            throw new Error('Stop');
        });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Stop');
    });

    it('should throw an error if no error is thrown in the passed function', () => {
        expect(() => {
            jestGetError(() => undefined);
        }).toThrow('Function did not throw an error');
    });
});

describe('jestGetErrorAsync', () => {
    it('should return the thrown error', async () => {
        const error: any = await jestGetErrorAsync(() => {
            throw new Error('Stop');
        });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Stop');
    });

    it('should throw an error if no error is thrown in the passed function', async () => {
        await expect(async () => {
            await jestGetErrorAsync(async () => undefined);
        }).rejects.toThrow('Function did not throw an error');
    });
});

import {objectContainsProperty} from './object.util';

it('should return false for non-objects', () => {
    expect(objectContainsProperty(1, 'prop')).toBe(false);
    expect(objectContainsProperty(true, 'prop')).toBe(false);
    expect(objectContainsProperty(undefined, 'prop')).toBe(false);
});

it('should return false for null', () => {
    expect(objectContainsProperty(null, 'prop')).toBe(false);
});

it('should return false for when the object does not contain the property', () => {
    expect(objectContainsProperty({}, 'prop')).toBe(false);
    expect(objectContainsProperty(new Date(), 'prop')).toBe(false);
});

it('should return when the object does contains the property', () => {
    expect(objectContainsProperty({prop: undefined}, 'prop')).toBe(true);
    expect(objectContainsProperty({prop: 'foo'}, 'prop')).toBe(true);
});

it('should narrow the type of the input', () => {
    const obj: unknown = {
        prop: 'foo',
    };

    const propType = objectContainsProperty(obj, 'prop') && typeof obj.prop;
    expect(propType).toBe('string');
});

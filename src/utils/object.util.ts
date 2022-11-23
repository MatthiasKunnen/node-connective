/**
 * Type guard to narrow an unknown type based on the presence of a property.
 */
export function objectContainsProperty<Key extends string>(
    obj: unknown,
    key: Key,
): obj is Record<Key, unknown> {
    return typeof obj === 'object' && obj !== null && key in obj;
}

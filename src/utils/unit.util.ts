const pointToMillimeterRatio = 72 / 25.4;

/**
 * Converts millimeter to the PDF point unit used by Connective. The point is 1/72th of an inch.
 */
export function millimeterToPoints(mm: number): number {
    return mm * pointToMillimeterRatio;
}

/**
 * Converts point to millimeter.
 */
export function pointsToMillimeter(pt: number): number {
    return pt / pointToMillimeterRatio;
}

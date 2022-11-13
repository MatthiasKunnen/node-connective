import {millimeterToPoints, pointsToMillimeter} from '../src';

describe('millimeterToPoints', () => {
    it('correctly converts 297 mm to points', () => {
        expect(millimeterToPoints(297)).toBeCloseTo(841.88976378);
    });
});

describe('pointsToMillimeter', () => {
    it('correctly converts 595 points to mm', () => {
        expect(pointsToMillimeter(595)).toBeCloseTo(209.90277778);
    });
});

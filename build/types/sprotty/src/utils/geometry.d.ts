/********************************************************************************
 * Copyright (c) 2017-2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
/**
 * A Point is composed of the (x,y) coordinates of an object.
 */
export interface Point {
    readonly x: number;
    readonly y: number;
}
/**
 * (x,y) coordinates of the origin.
 */
export declare const ORIGIN_POINT: Point;
/**
 * Adds two points.
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} The sum of the two points
 */
export declare function add(p1: Point, p2: Point): Point;
/**
 * Subtracts two points.
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} The difference of the two points
 */
export declare function subtract(p1: Point, p2: Point): Point;
/**
 * The Dimension of an object is composed of its width and height.
 */
export interface Dimension {
    readonly width: number;
    readonly height: number;
}
/**
 * A dimension with both width and height set to a negative value, which is considered as undefined.
 */
export declare const EMPTY_DIMENSION: Dimension;
/**
 * Checks whether the given dimention is valid, i.e. the width and height are non-zero.
 * @param {Dimension} b - Dimension object
 * @returns {boolean}
 */
export declare function isValidDimension(d: Dimension): boolean;
/**
 * The bounds are the position (x, y) and dimension (width, height) of an object.
 */
export interface Bounds extends Point, Dimension {
}
export declare const EMPTY_BOUNDS: Bounds;
export declare function isBounds(element: any): element is Bounds;
/**
 * Combines the bounds of two objects into one, so that the new bounds
 * are the minimum bounds that covers both of the original bounds.
 * @param {Bounds} b0 - First bounds object
 * @param {Bounds} b1 - Second bounds object
 * @returns {Bounds} The combined bounds
 */
export declare function combine(b0: Bounds, b1: Bounds): Bounds;
/**
 * Translates the given bounds.
 * @param {Bounds} b - Bounds object
 * @param {Point} p - Vector by which to translate the bounds
 * @returns {Bounds} The translated bounds
 */
export declare function translate(b: Bounds, p: Point): Bounds;
/**
 * Returns the center point of the bounds of an object
 * @param {Bounds} b - Bounds object
 * @returns {Point} the center point
 */
export declare function center(b: Bounds): Point;
export declare function centerOfLine(s: Point, e: Point): Point;
/**
 * Checks whether the point p is included in the bounds b.
 */
export declare function includes(b: Bounds, p: Point): boolean;
/**
 * Represents an object's insets, for top, bottom, left and right
 */
export interface Insets {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
/**
 * Enumeration of possible directions (left, right, up, down)
 * @deprecated do we use this? We should rather use a string type
 */
export declare enum Direction {
    left = 0,
    right = 1,
    up = 2,
    down = 3
}
export declare type Orientation = 'north' | 'south' | 'east' | 'west';
/**
 * Returns the "straight line" distance between two points.
 * @param {Point} a - First point
 * @param {Point} b - Second point
 * @returns {number} The Eucledian distance
 */
export declare function euclideanDistance(a: Point, b: Point): number;
/**
 * Returns the distance between two points in a grid, using a
 * strictly vertical and/or horizontal path (versus straight line).
 * @param {Point} a - First point
 * @param {Point} b - Second point
 * @returns {number} The Manhattan distance
 */
export declare function manhattanDistance(a: Point, b: Point): number;
/**
 * Returns the maximum of the horizontal and the vertical distance.
 * @param {Point} a - First point
 * @param {Point} b - Second point
 * @returns {number} The maximum distance
 */
export declare function maxDistance(a: Point, b: Point): number;
/**
 * Computes the angle in radians of the given point to the x-axis of the coordinate system.
 * The result is in the range [-pi, pi].
 * @param {Point} p - A point in the Eucledian plane
 */
export declare function angleOfPoint(p: Point): number;
/**
 * Computes the angle in radians between the two given points (relative to the origin of the coordinate system).
 * The result is in the range [0, pi]. Returns NaN if the points are equal.
 * @param {Point} a - First point
 * @param {Point} b - Second point
 */
export declare function angleBetweenPoints(a: Point, b: Point): number;
/**
 * Computes a point that is the original `point` shifted towards `refPoint` by the given `distance`.
 * @param {Point} point - Point to shift
 * @param {Point} refPoint - Point to shift towards
 * @param {Point} distance - Distance to shift
 */
export declare function shiftTowards(point: Point, refPoint: Point, distance: number): Point;
/**
 * Computes the normalized vector from the vector given in `point`; that is, computing its unit vector.
 * @param {Point} point - Point representing the vector to be normalized
 * @returns {Point} The normalized point
 */
export declare function normalize(point: Point): Point;
/**
 * Computes the magnitude of the vector given in `point`.
 * @param {Point} point - Point representing the vector to compute the magnitude for
 * @returns {number} The magnitude or also known as length of the `point`
 */
export declare function magnitude(point: Point): number;
/**
 * Converts from radians to degrees
 * @param {number} a - A value in radians
 * @returns {number} The converted value
 */
export declare function toDegrees(a: number): number;
/**
 * Converts from degrees to radians
 * @param {number} a - A value in degrees
 * @returns {number} The converted value
 */
export declare function toRadians(a: number): number;
/**
 * Returns whether two numbers are almost equal, within a small margin (0.001)
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {boolean} True if the two numbers are almost equal
 */
export declare function almostEquals(a: number, b: number): boolean;
/**
 * Calculates a linear combination of p0 and p1 using lambda, i.e.
 *   (1-lambda) * p0 + lambda * p1
 * @param p0
 * @param p1
 * @param lambda
 */
export declare function linear(p0: Point, p1: Point, lambda: number): Point;
/**
 * A diamond or rhombus is a quadrilateral whose four sides all have the same length.
 * It consinsts of four points, a `topPoint`, `rightPoint`, `bottomPoint`, and a `leftPoint`,
 * which are connected by four lines -- the `topRightSideLight`, `topLeftSideLine`, `bottomRightSideLine`,
 * and the `bottomLeftSideLine`.
 */
export declare class Diamond {
    protected bounds: Bounds;
    constructor(bounds: Bounds);
    get topPoint(): Point;
    get rightPoint(): Point;
    get bottomPoint(): Point;
    get leftPoint(): Point;
    get topRightSideLine(): Line;
    get topLeftSideLine(): Line;
    get bottomRightSideLine(): Line;
    get bottomLeftSideLine(): Line;
    /**
     * Return the closest side of this diamond to the specified `refPoint`.
     * @param {Point} refPoint a reference point
     * @returns {Line} a line representing the closest side
     */
    closestSideLine(refPoint: Point): Line;
}
/**
 * A line represented in its standard form `a*x + b*y = c`.
 */
export interface Line {
    readonly a: number;
    readonly b: number;
    readonly c: number;
}
/**
 * A line made up from two points.
 */
export declare class PointToPointLine implements Line {
    protected p1: Point;
    protected p2: Point;
    constructor(p1: Point, p2: Point);
    get a(): number;
    get b(): number;
    get c(): number;
}
/**
 * Returns the intersection of two lines `l1` and `l2`
 * @param {Line} l1 - A line
 * @param {Line} l2 - Another line
 * @returns {Point} The intersection point of `l1` and `l2`
 */
export declare function intersection(l1: Line, l2: Line): Point;
//# sourceMappingURL=geometry.d.ts.map
/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
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
 * An iterable that allows filtering, mapping values etc. with a fluent API.
 * Arrays conform to this interface, so an array can be passed at every place where
 * a FluentIterable is expected.
 */
export interface FluentIterable<T> extends Iterable<T> {
    filter(callback: (element: T) => boolean): FluentIterable<T>;
    map<T2>(callback: (element: T) => T2): FluentIterable<T2>;
    forEach(callback: (element: T, index: number) => void): void;
    indexOf(element: any): number;
}
/**
 * A helper class that allows to easily create fluent iterables.
 */
export declare class FluentIterableImpl<S, T> implements FluentIterable<T> {
    private readonly startFn;
    private readonly nextFn;
    constructor(startFn: () => S, nextFn: (state: S) => IteratorResult<T>);
    [Symbol.iterator](): {
        state: S;
        next: () => IteratorResult<T, any>;
        [Symbol.iterator]: () => any;
    };
    filter(callback: (element: T) => boolean): FluentIterable<T>;
    map<T2>(callback: (element: T) => T2): FluentIterable<T2>;
    forEach(callback: (element: T, index: number) => void): void;
    indexOf(element: any): number;
}
/**
 * Converts a FluentIterable into an array. If the input is an array, it is returned unchanged.
 */
export declare function toArray<T>(input: FluentIterable<T>): T[];
export declare const DONE_RESULT: IteratorResult<any>;
/**
 * Create a fluent iterable that filters the content of the given iterable or array.
 */
export declare function filterIterable<T>(input: Iterable<T> | ArrayLike<T>, callback: (element: T) => boolean): FluentIterable<T>;
/**
 * Create a fluent iterable that maps the content of the given iterable or array.
 */
export declare function mapIterable<T1, T2>(input: Iterable<T1> | ArrayLike<T1>, callback: (element: T1) => T2): FluentIterable<T2>;
//# sourceMappingURL=iterable.d.ts.map
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
export declare class ProviderRegistry<T, U> {
    protected elements: Map<string, new (u: U) => T>;
    register(key: string, cstr: new (u: U) => T): void;
    deregister(key: string): void;
    hasKey(key: string): boolean;
    get(key: string, arg: U): T;
    protected missing(key: string, arg: U): T | never;
}
export declare class FactoryRegistry<T, U> {
    protected elements: Map<string, (u: U) => T>;
    register(key: string, factory: (u: U) => T): void;
    deregister(key: string): void;
    hasKey(key: string): boolean;
    get(key: string, arg: U): T;
    protected missing(key: string, arg: U): T | never;
}
export declare class InstanceRegistry<T> {
    protected elements: Map<string, T>;
    register(key: string, instance: T): void;
    deregister(key: string): void;
    hasKey(key: string): boolean;
    get(key: string): T;
    protected missing(key: string): T | never;
}
export declare class MultiInstanceRegistry<T> {
    protected elements: Map<string, T[]>;
    register(key: string, instance: T): void;
    deregisterAll(key: string): void;
    get(key: string): T[];
}
//# sourceMappingURL=registry.d.ts.map
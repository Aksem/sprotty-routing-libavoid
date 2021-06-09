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
import { ViewerOptions } from "../base/views/viewer-options";
export interface ILogger {
    logLevel: LogLevel;
    error(thisArg: any, message: string, ...params: any[]): void;
    warn(thisArg: any, message: string, ...params: any[]): void;
    info(thisArg: any, message: string, ...params: any[]): void;
    log(thisArg: any, message: string, ...params: any[]): void;
}
export declare enum LogLevel {
    none = 0,
    error = 1,
    warn = 2,
    info = 3,
    log = 4
}
export declare class NullLogger implements ILogger {
    logLevel: LogLevel;
    error(thisArg: any, message: string, ...params: any[]): void;
    warn(thisArg: any, message: string, ...params: any[]): void;
    info(thisArg: any, message: string, ...params: any[]): void;
    log(thisArg: any, message: string, ...params: any[]): void;
}
export declare class ConsoleLogger implements ILogger {
    logLevel: LogLevel;
    protected viewOptions: ViewerOptions;
    error(thisArg: any, message: string, ...params: any[]): void;
    warn(thisArg: any, message: string, ...params: any[]): void;
    info(thisArg: any, message: string, ...params: any[]): void;
    log(thisArg: any, message: string, ...params: any[]): void;
    protected consoleArguments(thisArg: any, message: string, params: any[]): any[];
}
//# sourceMappingURL=logging.d.ts.map
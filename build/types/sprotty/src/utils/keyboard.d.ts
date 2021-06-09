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
 * Returns whether the keyboard event matches the keystroke described by the given
 * code and modifiers. The code must comply to the format of the `code` property
 * of KeyboardEvent, but in contrast to that property, the actual keyboard layout is
 * considered by this function if possible.
 */
export declare function matchesKeystroke(event: KeyboardEvent, code: KeyCode, ...modifiers: KeyboardModifier[]): boolean;
export declare type KeyboardModifier = 'ctrl' | 'meta' | 'ctrlCmd' | 'alt' | 'shift';
export declare type KeyCode = 'AltLeft' | 'AltRight' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'Backslash' | 'Backspace' | 'Backquote' | 'BracketLeft' | 'BracketRight' | 'CapsLock' | 'Comma' | 'ContextMenu' | 'ControlLeft' | 'ControlRight' | 'Convert' | 'Delete' | 'Digit0' | 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4' | 'Digit5' | 'Digit6' | 'Digit7' | 'Digit8' | 'Digit9' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12' | 'F13' | 'F14' | 'F15' | 'F16' | 'F17' | 'F18' | 'F19' | 'F20' | 'F21' | 'F22' | 'F23' | 'F24' | 'End' | 'Enter' | 'Equal' | 'Escape' | 'Home' | 'Insert' | 'IntlBackslash' | 'IntlRo' | 'IntlYen' | 'KanaMode' | 'KeyA' | 'KeyB' | 'KeyC' | 'KeyD' | 'KeyE' | 'KeyF' | 'KeyG' | 'KeyH' | 'KeyI' | 'KeyJ' | 'KeyK' | 'KeyL' | 'KeyM' | 'KeyN' | 'KeyO' | 'KeyP' | 'KeyQ' | 'KeyR' | 'KeyS' | 'KeyT' | 'KeyU' | 'KeyV' | 'KeyW' | 'KeyX' | 'KeyY' | 'KeyZ' | 'MetaLeft' | 'MetaRight' | 'Minus' | 'NonConvert' | 'NumLock' | 'Numpad0' | 'Numpad1' | 'Numpad2' | 'Numpad3' | 'Numpad4' | 'Numpad5' | 'Numpad6' | 'Numpad7' | 'Numpad8' | 'Numpad9' | 'NumpadAdd' | 'NumpadComma' | 'NumpadDecimal' | 'NumpadDivide' | 'NumpadEnter' | 'NumpadEqual' | 'NumpadMultiply' | 'NumpadSeparator' | 'NumpadSubtract' | 'OSLeft' | 'OSRight' | 'PageDown' | 'PageUp' | 'Pause' | 'Period' | 'PrintScreen' | 'Quote' | 'ScrollLock' | 'Semicolon' | 'ShiftLeft' | 'ShiftRight' | 'Slash' | 'Space' | 'Tab';
/**
 * Determines a key code from the given event. This is necessary because the `code` property of
 * a KeyboardEvent does not consider keyboard layouts.
 */
export declare function getActualCode(event: KeyboardEvent): KeyCode;
//# sourceMappingURL=keyboard.d.ts.map
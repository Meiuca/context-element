import { CSSResult } from 'lit-element';

declare interface ContextRegistry {
  [id: string]: any;
}

export function getComponentContext<Context>(contextId: string, defaultContext?: Context): Context;

export function updateRegisteredComponents(): CSSResult[][];

/**
 * @param contextId if omitted, the function will clear the entire DSContext
 *
 * @returns `true` if the context was successfully cleared
 */
export function clearContext(contextId?: string): boolean;

export function setContext(url: string): Promise<void>;

export function setContext(id: string, value: any): Promise<void>;

export function setContext(id: string, url: string): Promise<void>;

export function setContext(context: ContextRegistry): Promise<void>;

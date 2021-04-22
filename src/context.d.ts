import { CSSResult } from 'lit-element';

declare interface ContextRegistry {
  [id: string]: any;
}

export function getComponentContext<Context>(contextId: string, defaultContext?: Context): Context;

export function updateRegisteredComponents(): void;

/**
 * @param contextId If omitted, the function will clear the entire DSContext
 *
 * @returns `true` if the context was successfully cleared
 */
export function clearContext(contextId?: string): boolean;

/**
 * Set the global context using a url
 *
 * @param url `https://url.to.global.context/`
 */
export function setContext(url: string): Promise<void>;

/**
 * Set a component context
 *
 * @param id The component context id.
 * Initially is the same as the component tag name,
 * but can be changed by `context` property changes
 *
 * @param value The context object
 */
export function setContext(id: string, value: any): Promise<void>;

/**
 * Set a component context using a url
 *
 * @param id The component context id.
 * Initially it is the same as the component tag name,
 * but can be changed by `context` property changes
 *
 * @param url `https://url.to.component.context/`
 */
export function setContext(id: string, url: string): Promise<void>;

/**
 * Set the global context using a object
 */
export function setContext(context: ContextRegistry): Promise<void>;

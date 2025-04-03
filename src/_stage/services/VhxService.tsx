// src/_stage/services/VhxService.tsx
import { JSX } from 'preact';
import { StrictObjectKVService } from '../../_core';

export class VHXService extends StrictObjectKVService<
  string,
  string | JSX.Element
> {
  constructor(key: string, initial: Record<string, string | JSX.Element> = {}) {
    super(key, initial);
  }

  // -- Title ---------------------------------------------------------

  setTitle(title: string): void {
    this.set('title', title);
  }

  getTitle(): string {
    return this.get('title', new Error('VHX: No title has been set')) as string;
  }

  // -- Template ------------------------------------------------------

  setTemplate(template: JSX.Element): void {
    this.set('template', template);
  }

  getTemplate(): JSX.Element {
    return this.get(
      'template',
      new Error('VHX: No template has been set'),
    ) as JSX.Element;
  }

  // -- Header --------------------------------------------------------

  setHeader(header: JSX.Element): void {
    this.set('header', header);
  }

  getHeader(): JSX.Element {
    return this.get(
      'header',
      new Error('VHX: No header has been set'),
    ) as JSX.Element;
  }

  // -- Slot Content --------------------------------------------------

  setSlot(key: string, content: JSX.Element): void {
    this.set(`slot:${key}`, content);
  }

  getSlot(key: string): JSX.Element {
    return this.get(
      `slot:${key}`,
      new Error(`VHX: Slot "${key}" has not been filled`),
    ) as JSX.Element;
  }

  hasSlot(key: string): boolean {
    return this.has(`slot:${key}`);
  }

  removeSlot(key: string): void {
    this.remove(`slot:${key}`);
  }
}

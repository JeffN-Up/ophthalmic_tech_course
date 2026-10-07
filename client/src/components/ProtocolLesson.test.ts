import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as component from './ProtocolLesson';
import { getProtocolsForModuleDay } from '@/data/spindelProtocols';

describe('required doctor protocol display', () => {
  it('renders doctor-specific conditions and source links', () => {
    const ProtocolLesson = (component as Record<string, unknown>).ProtocolLesson as React.ComponentType<{day:number}>;
    expect(ProtocolLesson).toBeTypeOf('function');
    if (!ProtocolLesson) return;
    const html = renderToStaticMarkup(createElement(ProtocolLesson,{day:8}));
    expect(html).toContain('Dr. Guenena');
    expect(html).toContain('cylinder of -2.50 D or greater');
    expect(html).toContain(getProtocolsForModuleDay(8)[0].source.url);
    expect(html).not.toContain('Dr. Wood');
  });
});

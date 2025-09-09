import { buildHashUrl, getHashId, isUnder, handleMenuKeyNav, scrollToId } from '../navigation';

describe('navigation utils', () => {
  test('buildHashUrl builds correct url with hash', () => {
    expect(buildHashUrl('/pricing', 'faq')).toBe('/pricing#faq');
    expect(buildHashUrl('/pricing', '#calculator')).toBe('/pricing#calculator');
  });

  test('getHashId returns id without leading #', () => {
    expect(getHashId('#faq')).toBe('faq');
    expect(getHashId('')).toBe('');
  });

  test('isUnder detects nested paths and same path', () => {
    expect(isUnder('/ai-agents/mas', '/ai-agents')).toBe(true);
    expect(isUnder('/ai-agents', '/ai-agents')).toBe(true);
    expect(isUnder('/pricing?x=1', '/pricing')).toBe(true);
    expect(isUnder('/pricing#faq', '/pricing')).toBe(true);
    expect(isUnder('/other', '/pricing')).toBe(false);
  });

  test('handleMenuKeyNav moves focus among menuitems', () => {
    document.body.innerHTML = `
      <div role="menu" id="m">
        <button role="menuitem" id="a">A</button>
        <button role="menuitem" id="b">B</button>
        <button role="menuitem" id="c">C</button>
      </div>
    `;
    const container = document.getElementById('m') as HTMLElement;
    const a = document.getElementById('a') as HTMLElement;
    const b = document.getElementById('b') as HTMLElement;
    const c = document.getElementById('c') as HTMLElement;

    a.focus();
    const evDown = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    handleMenuKeyNav(evDown, container);
    expect(document.activeElement).toBe(b);

    const evUp = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
    handleMenuKeyNav(evUp, container);
    expect(document.activeElement).toBe(a);

    const evEnd = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
    handleMenuKeyNav(evEnd, container);
    expect(document.activeElement).toBe(c);

    const evHome = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
    handleMenuKeyNav(evHome, container);
    expect(document.activeElement).toBe(a);
  });

  test('scrollToId does not throw when element missing', () => {
    expect(() => scrollToId('does-not-exist', { offset: 10 })).not.toThrow();
  });
});

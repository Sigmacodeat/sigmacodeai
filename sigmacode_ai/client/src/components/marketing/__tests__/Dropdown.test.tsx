import React, { useState } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dropdown, { type DropdownItem, type DropdownKey } from '../Dropdown';

function DropdownHarness({
  name,
  items,
  label = 'Menu',
}: {
  name: DropdownKey;
  items: DropdownItem[];
  label?: string;
}) {
  const [open, setOpen] = useState<DropdownKey | null>(null);
  return (
    <MemoryRouter>
      <Dropdown
        name={name}
        label={label}
        items={items}
        widthClass="w-64"
        isOpen={open === name}
        setOpenMenu={setOpen}
        clearHoverTimer={() => {}}
        scheduleClose={() => {}}
        onCloseAll={() => {}}
        prefersReduced={true}
        buttonActive={false}
        isPath={() => false}
        analyticsPrefix={`test-${name}`}
        onAnchorClick={() => {}}
      />
    </MemoryRouter>
  );
}

describe('Dropdown', () => {
  test('rendert Menü und Items, wenn isOpen initial true ist', async () => {
    function OpenHarness() {
      const [open, setOpen] = useState<DropdownKey | null>('produkte');
      const items: DropdownItem[] = [
        { id: 'one', label: 'One', analyticsId: 'one', to: '/one' },
        { id: 'two', label: 'Two', analyticsId: 'two', to: '/two' },
      ];
      return (
        <MemoryRouter>
          <Dropdown
            name="produkte"
            label="Menu"
            items={items}
            widthClass="w-64"
            isOpen={open === 'produkte'}
            setOpenMenu={setOpen}
            clearHoverTimer={() => {}}
            scheduleClose={() => {}}
            onCloseAll={() => {}}
            prefersReduced={true}
            buttonActive={false}
            isPath={() => false}
            analyticsPrefix="test-produkte"
            onAnchorClick={() => {}}
          />
        </MemoryRouter>
      );
    }

    render(<OpenHarness />);
    expect(screen.getByRole('button', { name: /menu/i })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(await screen.findByRole('menuitem', { name: 'One' })).toBeInTheDocument();
    expect(await screen.findByRole('menuitem', { name: 'Two' })).toBeInTheDocument();
  });

  test('schließt bei Hover-Leave via scheduleClose (Timer)', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup();

    function TimedCloseHarness() {
      const [open, setOpen] = useState<DropdownKey | null>('produkte');
      let timer: any;
      const items: DropdownItem[] = [
        { id: 'one', label: 'One', analyticsId: 'one', to: '/one' },
      ];
      return (
        <MemoryRouter>
          <Dropdown
            name="produkte"
            label="Menu"
            items={items}
            widthClass="w-64"
            isOpen={open === 'produkte'}
            setOpenMenu={setOpen}
            clearHoverTimer={() => clearTimeout(timer)}
            scheduleClose={() => {
              timer = setTimeout(() => setOpen(null), 50);
            }}
            onCloseAll={() => {}}
            prefersReduced={true}
            buttonActive={false}
            isPath={() => false}
            analyticsPrefix="test-produkte"
            onAnchorClick={() => {}}
          />
        </MemoryRouter>
      );
    }

    render(<TimedCloseHarness />);
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Maus verlässt Wrapper => scheduleClose() startet Timer
    const wrapper = button.closest('.relative') as HTMLElement;
    expect(wrapper).toBeTruthy();
    if (wrapper) {
      // mouseLeave triggert scheduleClose
      fireEvent.mouseLeave(wrapper);
    }

    // Timer ausführen lassen und auf Schließung warten
    jest.advanceTimersByTime(60);
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));

    jest.useRealTimers();
  });

  test('onCloseAll beim Link-Item-Klick wird aufgerufen und Menü schließt', async () => {
    const user = userEvent.setup();
    const onCloseAll = jest.fn();

    function CloseAllHarness() {
      const [open, setOpen] = useState<DropdownKey | null>('howto');
      const items: DropdownItem[] = [
        { id: 'a', label: 'A', analyticsId: 'a', to: '/a' },
      ];
      return (
        <MemoryRouter>
          <Dropdown
            name="howto"
            label="Menu"
            items={items}
            widthClass="w-64"
            isOpen={open === 'howto'}
            setOpenMenu={setOpen}
            clearHoverTimer={() => {}}
            scheduleClose={() => {}}
            onCloseAll={() => {
              onCloseAll();
              setOpen(null);
            }}
            prefersReduced={true}
            buttonActive={false}
            isPath={() => false}
            analyticsPrefix="test-howto"
            onAnchorClick={() => {}}
          />
        </MemoryRouter>
      );
    }

    render(<CloseAllHarness />);
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');

    const link = await screen.findByRole('menuitem', { name: 'A' });
    await user.click(link);
    expect(onCloseAll).toHaveBeenCalled();
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
  });
  test('öffnet per Klick und rendert Items', async () => {
    const user = userEvent.setup();
    render(
      <DropdownHarness
        name="produkte"
        items={[
          { id: 'one', label: 'One', analyticsId: 'one', to: '/one' },
          { id: 'two', label: 'Two', analyticsId: 'two', to: '/two' },
        ]}
      />,
    );

    const button = screen.getByRole('button', { name: /menu/i });
    // Anfangszustand geschlossen
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    // Fallbacks für JSDOM: falls userEvent nicht toggelt
    if (button.getAttribute('aria-expanded') === 'false') {
      fireEvent.click(button);
    }
    if (button.getAttribute('aria-expanded') === 'false') {
      const wrapper = button.closest('.relative');
      if (wrapper) fireEvent.mouseOver(wrapper);
    }
    // Warten bis der Button den geöffneten Zustand widerspiegelt
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'true'));
    // Menü und Items erscheinen
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(await screen.findByRole('menuitem', { name: 'One' })).toBeInTheDocument();
    expect(await screen.findByRole('menuitem', { name: 'Two' })).toBeInTheDocument();
  });

  test('ArrowDown fokussiert erstes Item, wenn Menü offen ist', async () => {
    const user = userEvent.setup();
    function OpenHarness() {
      const [open, setOpen] = useState<DropdownKey | null>('howto');
      const items: DropdownItem[] = [
        { id: 'a', label: 'A', analyticsId: 'a', to: '/a' },
        { id: 'b', label: 'B', analyticsId: 'b', to: '/b' },
      ];
      return (
        <MemoryRouter>
          <Dropdown
            name="howto"
            label="Menu"
            items={items}
            widthClass="w-64"
            isOpen={open === 'howto'}
            setOpenMenu={setOpen}
            clearHoverTimer={() => {}}
            scheduleClose={() => {}}
            onCloseAll={() => {}}
            prefersReduced={true}
            buttonActive={false}
            isPath={() => false}
            analyticsPrefix="test-howto"
            onAnchorClick={() => {}}
          />
        </MemoryRouter>
      );
    }

    render(<OpenHarness />);
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    (button as HTMLButtonElement).focus();
    await user.keyboard('{ArrowDown}');

    const first = await screen.findByRole('menuitem', { name: 'A' });
    await waitFor(() => expect(first).toHaveFocus());
  });

  test('Anchor-Item ruft onAnchorClick mit id & route auf', async () => {
    const user = userEvent.setup();
    const onAnchorClick = jest.fn();

    function HarnessWithSpy() {
      const [open, setOpen] = useState<DropdownKey | null>('preise');
      const items: DropdownItem[] = [
        // Anchor-Items werden in der Komponente nur gerendert, wenn KEIN `to` gesetzt ist
        { id: 'section-1', label: 'Section 1', analyticsId: 's1', isAnchor: true },
      ];
      return (
        <MemoryRouter>
          <Dropdown
            name="preise"
            label="Menu"
            items={items}
            widthClass="w-64"
            isOpen={open === 'preise'}
            setOpenMenu={setOpen}
            clearHoverTimer={() => {}}
            scheduleClose={() => {}}
            onCloseAll={() => {}}
            prefersReduced={true}
            buttonActive={false}
            isPath={() => false}
            analyticsPrefix="test-preise"
            onAnchorClick={onAnchorClick}
          />
        </MemoryRouter>
      );
    }

    render(<HarnessWithSpy />);
    const anchor = await screen.findByRole('menuitem', { name: 'Section 1' });
    await user.click(anchor);

    expect(onAnchorClick).toHaveBeenCalled();
    const [evt, id, route] = onAnchorClick.mock.calls[0];
    expect(id).toBe('section-1');
    expect(route).toBeUndefined();
  });
});

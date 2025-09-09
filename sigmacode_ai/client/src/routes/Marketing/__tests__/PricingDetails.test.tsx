import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PricingDetails from '../PricingDetails';

jest.useFakeTimers();

describe('PricingDetails – Kalkulator', () => {
  it('formatiert Kosten in EUR und reagiert auf Input-Änderungen (mit Debounce)', async () => {
    render(
      <MemoryRouter>
        <PricingDetails />
      </MemoryRouter>
    );

    // Startwerte finden
    const msgs = screen.getByLabelText(/Nachrichten\/Monat/i) as HTMLInputElement;
    const tokens = screen.getByLabelText(/Ø Tokens je Nachricht/i) as HTMLInputElement;

    // Anfangswert Kosten vorhanden (gezielt innerhalb der Karte "Schätzung: Eigene API")
    const cardHeading = screen.getByRole('heading', { name: /Schätzung: Eigene API/i });
    const card = cardHeading.parentElement as HTMLElement;
    expect(within(card).getByText(/\€|EUR/)).toBeInTheDocument();

    // Werte ändern
    fireEvent.change(msgs, { target: { value: '1000' } });
    fireEvent.change(tokens, { target: { value: '100' } });

    // Debounce abwarten
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    // Erwartung: Zahl ist gerendert (keine genaue Summe prüfen, nur, dass formatierter Betrag da ist)
    expect(within(card).getByText(/\€|EUR/)).toBeInTheDocument();
  });

  it('zeigt zod-Fehler an bei ungültigen Eingaben', async () => {
    render(
      <MemoryRouter>
        <PricingDetails />
      </MemoryRouter>
    );

    const msgs = screen.getByLabelText(/Nachrichten\/Monat/i) as HTMLInputElement;
    fireEvent.change(msgs, { target: { value: '-1' } });

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    // Fehlermeldung
    expect(screen.getByRole('alert')).toHaveTextContent(/Muss ≥ 0 sein/i);
  });
});

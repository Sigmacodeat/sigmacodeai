import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorState from '~/components/common/ErrorState';

describe('ErrorState component', () => {
  it('renders with default message', () => {
    render(<ErrorState />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Etwas ist schiefgelaufen.')).toBeInTheDocument();
  });

  it('renders custom message and retry button', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Fehler beim Laden" onRetry={onRetry} retryLabel="Erneut versuchen" />);
    expect(screen.getByText('Fehler beim Laden')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Erneut versuchen' });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

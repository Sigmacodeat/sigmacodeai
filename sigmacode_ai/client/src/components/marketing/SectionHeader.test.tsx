import { render, screen } from '@testing-library/react';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  it('renders badge and title correctly', () => {
    render(
      <SectionHeader 
        badgeText="Test Badge" 
        title="Test Header" 
      />
    );
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('does not render badge when badgeText is empty', () => {
    render(
      <SectionHeader 
        badgeText="" 
        title="Test Header" 
      />
    );
    
    expect(screen.queryByText('Test Badge')).not.toBeInTheDocument();
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  // Weitere Tests für Animation und Ausrichtung können hier hinzugefügt werden
});

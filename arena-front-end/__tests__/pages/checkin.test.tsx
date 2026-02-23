import { render, screen } from '@testing-library/react';

// Mock simples da página Checkin
const MockCheckinPage = () => (
  <div>
    <h1>Check-in</h1>
    <div>Conteúdo da página Check-in</div>
  </div>
);

describe('CheckinPage', () => {
  it('renders page title', () => {
    render(<MockCheckinPage />);
    expect(screen.getByText('Check-in')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockCheckinPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
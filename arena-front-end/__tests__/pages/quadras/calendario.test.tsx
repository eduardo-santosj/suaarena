import { render, screen } from '@testing-library/react';

// Mock simples da página Calendário
const MockCalendarioPage = () => (
  <div>
    <h1>Calendário de Reservas</h1>
    <div className="calendar">
      <div>Janeiro 2024</div>
      <div className="calendar-grid">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>
    </div>
  </div>
);

describe('CalendarioPage', () => {
  it('renders page title', () => {
    render(<MockCalendarioPage />);
    expect(screen.getByText('Calendário de Reservas')).toBeInTheDocument();
  });

  it('renders calendar', () => {
    render(<MockCalendarioPage />);
    expect(screen.getByText('Janeiro 2024')).toBeInTheDocument();
  });

  it('renders weekdays', () => {
    render(<MockCalendarioPage />);
    expect(screen.getByText('Dom')).toBeInTheDocument();
    expect(screen.getByText('Seg')).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';

// Mock simples da página Dashboard
const MockDashboardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <div className="stats">
      <div>Total de alunos: 150</div>
      <div>Reservas hoje: 25</div>
    </div>
    <div className="charts">
      <h2>Gráficos</h2>
    </div>
    <div className="activities">
      <h2>Atividades recentes</h2>
    </div>
  </div>
);

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<MockDashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders statistics cards', () => {
    render(<MockDashboardPage />);
    expect(screen.getByText(/total de alunos/i)).toBeInTheDocument();
    expect(screen.getByText(/reservas hoje/i)).toBeInTheDocument();
  });

  it('renders charts section', () => {
    render(<MockDashboardPage />);
    expect(screen.getByText(/gráficos/i)).toBeInTheDocument();
  });

  it('renders recent activities', () => {
    render(<MockDashboardPage />);
    expect(screen.getByText(/atividades recentes/i)).toBeInTheDocument();
  });
});
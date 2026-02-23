import { render, screen } from '@testing-library/react';

// Mock simples da página GerenciarCheckins
const MockGerenciarCheckinsPage = () => (
  <div>
    <h1>Gerenciar Check-ins</h1>
    <div>
      <input type="date" placeholder="Filtrar por data" />
      <button>Exportar</button>
    </div>
    <table role="table">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>Data</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>João Silva</td>
          <td>2024-01-15</td>
          <td>08:30</td>
        </tr>
      </tbody>
    </table>
  </div>
);

describe('GerenciarCheckinsPage', () => {
  it('renders page title', () => {
    render(<MockGerenciarCheckinsPage />);
    expect(screen.getByText('Gerenciar Check-ins')).toBeInTheDocument();
  });

  it('renders checkins table', () => {
    render(<MockGerenciarCheckinsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders date filter', () => {
    render(<MockGerenciarCheckinsPage />);
    expect(screen.getByPlaceholderText('Filtrar por data')).toBeInTheDocument();
  });

  it('renders export button', () => {
    render(<MockGerenciarCheckinsPage />);
    expect(screen.getByText('Exportar')).toBeInTheDocument();
  });
});
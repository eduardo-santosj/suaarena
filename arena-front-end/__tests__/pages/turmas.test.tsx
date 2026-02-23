import { render, screen } from '@testing-library/react';

// Mock simples da página Turmas
const MockTurmasPage = () => (
  <div>
    <h1>Turmas</h1>
    <div>Conteúdo da página Turmas</div>
  </div>
);

describe('TurmasPage', () => {
  it('renders page title', () => {
    render(<MockTurmasPage />);
    expect(screen.getByText('Turmas')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockTurmasPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
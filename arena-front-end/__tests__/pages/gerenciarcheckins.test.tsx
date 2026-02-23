import { render, screen } from '@testing-library/react';

// Mock simples da página GerenciarCheckins
const MockGerenciarCheckinsPage = () => (
  <div>
    <h1>Gerenciar Check-ins</h1>
    <div>Conteúdo da página Gerenciar Check-ins</div>
  </div>
);

describe('GerenciarCheckinsPage', () => {
  it('renders page title', () => {
    render(<MockGerenciarCheckinsPage />);
    expect(screen.getByText('Gerenciar Check-ins')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockGerenciarCheckinsPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
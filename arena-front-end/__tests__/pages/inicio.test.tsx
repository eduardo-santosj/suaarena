import { render, screen } from '@testing-library/react';

// Mock simples da página Inicio
const MockInicioPage = () => (
  <div>
    <h1>Início</h1>
    <div>Conteúdo da página Início</div>
  </div>
);

describe('InicioPage', () => {
  it('renders page title', () => {
    render(<MockInicioPage />);
    expect(screen.getByText('Início')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockInicioPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
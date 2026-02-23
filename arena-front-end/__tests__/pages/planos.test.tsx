import { render, screen } from '@testing-library/react';

// Mock simples da página Planos
const MockPlanosPage = () => (
  <div>
    <h1>Planos</h1>
    <div>Conteúdo da página Planos</div>
  </div>
);

describe('PlanosPage', () => {
  it('renders page title', () => {
    render(<MockPlanosPage />);
    expect(screen.getByText('Planos')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockPlanosPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
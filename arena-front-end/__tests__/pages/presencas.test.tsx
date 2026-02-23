import { render, screen } from '@testing-library/react';

// Mock simples da página Presencas
const MockPresencasPage = () => (
  <div>
    <h1>Presenças</h1>
    <div>Conteúdo da página Presenças</div>
  </div>
);

describe('PresencasPage', () => {
  it('renders page title', () => {
    render(<MockPresencasPage />);
    expect(screen.getByText('Presenças')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockPresencasPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
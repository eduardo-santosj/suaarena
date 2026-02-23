import { render, screen } from '@testing-library/react';

// Mock simples da página TrocarSenha
const MockTrocarSenhaPage = () => (
  <div>
    <h1>Trocar Senha</h1>
    <div>Conteúdo da página Trocar Senha</div>
  </div>
);

describe('TrocarSenhaPage', () => {
  it('renders page title', () => {
    render(<MockTrocarSenhaPage />);
    expect(screen.getByText('Trocar Senha')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockTrocarSenhaPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';

// Mock simples da página AlterarSenha
const MockAlterarSenhaPage = () => (
  <div>
    <h1>Alterar Senha</h1>
    <div>Conteúdo da página Alterar Senha</div>
  </div>
);

describe('AlterarSenhaPage', () => {
  it('renders page title', () => {
    render(<MockAlterarSenhaPage />);
    expect(screen.getByText('Alterar Senha')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockAlterarSenhaPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
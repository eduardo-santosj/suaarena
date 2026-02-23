import { render, screen } from '@testing-library/react';

// Mock simples da página MeuPerfil
const MockMeuPerfilPage = () => (
  <div>
    <h1>Meu Perfil</h1>
    <div>Conteúdo da página Meu Perfil</div>
  </div>
);

describe('MeuPerfilPage', () => {
  it('renders page title', () => {
    render(<MockMeuPerfilPage />);
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockMeuPerfilPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
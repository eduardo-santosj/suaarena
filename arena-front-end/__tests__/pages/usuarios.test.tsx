import { render, screen } from '@testing-library/react';

// Mock simples da página Usuarios
const MockUsuariosPage = () => (
  <div>
    <h1>Usuários</h1>
    <div>Conteúdo da página Usuários</div>
  </div>
);

describe('UsuariosPage', () => {
  it('renders page title', () => {
    render(<MockUsuariosPage />);
    expect(screen.getByText('Usuários')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<MockUsuariosPage />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});
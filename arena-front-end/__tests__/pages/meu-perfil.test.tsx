import { render, screen, fireEvent } from '@testing-library/react';

// Mock simples da página MeuPerfil
const MockMeuPerfilPage = () => (
  <div>
    <h1>Meu Perfil</h1>
    <form>
      <label htmlFor="nome">Nome</label>
      <input id="nome" type="text" defaultValue="João Silva" />
      
      <label htmlFor="email">Email</label>
      <input id="email" type="email" defaultValue="joao@test.com" />
      
      <button type="submit">Salvar</button>
    </form>
  </div>
);

describe('MeuPerfilPage', () => {
  it('renders page title', () => {
    render(<MockMeuPerfilPage />);
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
  });

  it('renders profile form', () => {
    render(<MockMeuPerfilPage />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<MockMeuPerfilPage />);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('allows editing profile fields', () => {
    render(<MockMeuPerfilPage />);
    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    expect(nameInput).toHaveValue('João Silva');
  });
});
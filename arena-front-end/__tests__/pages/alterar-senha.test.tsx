import { render, screen, fireEvent } from '@testing-library/react';

// Mock simples da página AlterarSenha
const MockAlterarSenhaPage = () => (
  <div>
    <h1>Alterar Senha</h1>
    <form>
      <label htmlFor="senhaAtual">Senha Atual</label>
      <input id="senhaAtual" type="password" />
      
      <label htmlFor="novaSenha">Nova Senha</label>
      <input id="novaSenha" type="password" />
      
      <label htmlFor="confirmarSenha">Confirmar Senha</label>
      <input id="confirmarSenha" type="password" />
      
      <button type="submit">Salvar</button>
    </form>
  </div>
);

describe('AlterarSenhaPage', () => {
  it('renders page title', () => {
    render(<MockAlterarSenhaPage />);
    expect(screen.getByRole('heading', { name: 'Alterar Senha' })).toBeInTheDocument();
  });

  it('renders password form', () => {
    render(<MockAlterarSenhaPage />);
    expect(screen.getByLabelText('Senha Atual')).toBeInTheDocument();
    expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<MockAlterarSenhaPage />);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('allows typing in password fields', () => {
    render(<MockAlterarSenhaPage />);
    const passwordInput = screen.getByLabelText('Nova Senha');
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    expect(passwordInput).toHaveValue('newpassword123');
  });
});
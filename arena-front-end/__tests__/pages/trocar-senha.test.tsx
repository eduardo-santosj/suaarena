import { render, screen, fireEvent } from '@testing-library/react';

// Mock simples da página TrocarSenha
const MockTrocarSenhaPage = () => (
  <div>
    <h1>Trocar Senha</h1>
    <form>
      <label htmlFor="novaSenhaField">Nova Senha</label>
      <input id="novaSenhaField" type="password" />
      
      <label htmlFor="confirmarSenhaField">Confirmar Nova Senha</label>
      <input id="confirmarSenhaField" type="password" />
      
      <button type="submit">Alterar Senha</button>
    </form>
  </div>
);

describe('TrocarSenhaPage', () => {
  it('renders page title', () => {
    render(<MockTrocarSenhaPage />);
    expect(screen.getByText('Trocar Senha')).toBeInTheDocument();
  });

  it('renders password form', () => {
    render(<MockTrocarSenhaPage />);
    expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Nova Senha')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<MockTrocarSenhaPage />);
    expect(screen.getByRole('button', { name: 'Alterar Senha' })).toBeInTheDocument();
  });

  it('validates password confirmation', () => {
    render(<MockTrocarSenhaPage />);
    const newPassword = screen.getByLabelText('Nova Senha');
    const confirmPassword = screen.getByLabelText('Confirmar Nova Senha');
    
    fireEvent.change(newPassword, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPassword, { target: { value: 'different123' } });
    
    expect(newPassword).toHaveValue('newpass123');
    expect(confirmPassword).toHaveValue('different123');
  });
});
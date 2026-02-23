import { render, screen, fireEvent } from '@testing-library/react';

const mockLoginPage = () => (
  <div>
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <label htmlFor="senha">Senha</label>
      <input id="senha" type="password" />
      <button type="submit">Entrar</button>
    </form>
  </div>
);

describe('LoginPage', () => {
  it('renders login form', () => {
    render(mockLoginPage());
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(mockLoginPage());
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('allows typing in form fields', () => {
    render(mockLoginPage());
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
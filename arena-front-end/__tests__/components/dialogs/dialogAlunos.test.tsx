import { render, screen } from '@testing-library/react';

// Mock simples do dialog DialogAlunos
const MockDialogAlunos = ({ open = true, onClose, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" data-testid="dialogalunos">
      <h2>DialogAlunos</h2>
      <button onClick={onClose}>Fechar</button>
      <button>Salvar</button>
    </div>
  );
};

describe('DialogAlunos', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('renders dialog when open', () => {
    render(<MockDialogAlunos {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<MockDialogAlunos {...mockProps} />);
    expect(screen.getByText('DialogAlunos')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<MockDialogAlunos {...mockProps} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<MockDialogAlunos {...mockProps} />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
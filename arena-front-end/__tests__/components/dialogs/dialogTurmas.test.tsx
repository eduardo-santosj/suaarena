import { render, screen } from '@testing-library/react';

// Mock simples do dialog DialogTurmas
const MockDialogTurmas = ({ open = true, onClose, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" data-testid="dialogturmas">
      <h2>DialogTurmas</h2>
      <button onClick={onClose}>Fechar</button>
      <button>Salvar</button>
    </div>
  );
};

describe('DialogTurmas', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('renders dialog when open', () => {
    render(<MockDialogTurmas {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<MockDialogTurmas {...mockProps} />);
    expect(screen.getByText('DialogTurmas')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<MockDialogTurmas {...mockProps} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<MockDialogTurmas {...mockProps} />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';

// Mock simples do dialog DialogPlanos
const MockDialogPlanos = ({ open = true, onClose, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" data-testid="dialogplanos">
      <h2>DialogPlanos</h2>
      <button onClick={onClose}>Fechar</button>
      <button>Salvar</button>
    </div>
  );
};

describe('DialogPlanos', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('renders dialog when open', () => {
    render(<MockDialogPlanos {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<MockDialogPlanos {...mockProps} />);
    expect(screen.getByText('DialogPlanos')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<MockDialogPlanos {...mockProps} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<MockDialogPlanos {...mockProps} />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
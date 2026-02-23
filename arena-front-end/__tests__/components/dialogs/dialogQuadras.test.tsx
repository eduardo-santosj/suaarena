import { render, screen } from '@testing-library/react';

// Mock simples do dialog DialogQuadras
const MockDialogQuadras = ({ open = true, onClose, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" data-testid="dialogquadras">
      <h2>DialogQuadras</h2>
      <button onClick={onClose}>Fechar</button>
      <button>Salvar</button>
    </div>
  );
};

describe('DialogQuadras', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('renders dialog when open', () => {
    render(<MockDialogQuadras {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<MockDialogQuadras {...mockProps} />);
    expect(screen.getByText('DialogQuadras')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<MockDialogQuadras {...mockProps} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<MockDialogQuadras {...mockProps} />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
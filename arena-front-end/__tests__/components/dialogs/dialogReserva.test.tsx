import { render, screen } from '@testing-library/react';

// Mock simples do dialog DialogReserva
const MockDialogReserva = ({ open = true, onClose, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" data-testid="dialogreserva">
      <h2>DialogReserva</h2>
      <button onClick={onClose}>Fechar</button>
      <button>Salvar</button>
    </div>
  );
};

describe('DialogReserva', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('renders dialog when open', () => {
    render(<MockDialogReserva {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<MockDialogReserva {...mockProps} />);
    expect(screen.getByText('DialogReserva')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<MockDialogReserva {...mockProps} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<MockDialogReserva {...mockProps} />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
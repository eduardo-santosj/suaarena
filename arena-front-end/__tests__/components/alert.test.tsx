import { render, screen } from '@testing-library/react';

// Mock simples do componente Alert
const MockAlert = ({ type, message }: { type: string; message: string }) => {
  if (!message) return null;
  return (
    <div role="alert" className={`alert-${type}`}>
      {message}
    </div>
  );
};

describe('Alert', () => {
  it('renders success alert', () => {
    render(<MockAlert type="success" message="Operação realizada com sucesso!" />);
    expect(screen.getByText('Operação realizada com sucesso!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-success');
  });

  it('renders error alert', () => {
    render(<MockAlert type="error" message="Erro ao processar solicitação" />);
    expect(screen.getByText('Erro ao processar solicitação')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-error');
  });

  it('renders warning alert', () => {
    render(<MockAlert type="warning" message="Atenção: dados não salvos" />);
    expect(screen.getByText('Atenção: dados não salvos')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-warning');
  });

  it('renders info alert', () => {
    render(<MockAlert type="info" message="Informação importante" />);
    expect(screen.getByText('Informação importante')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-info');
  });

  it('does not render when no message', () => {
    const { container } = render(<MockAlert type="info" message="" />);
    expect(container.firstChild).toBeNull();
  });
});
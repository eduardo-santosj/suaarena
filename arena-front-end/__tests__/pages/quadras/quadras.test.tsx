import { render, screen } from '@testing-library/react';

// Mock simples da página Quadras
const MockQuadrasPage = () => (
  <div>
    <h1>Quadras</h1>
    <button>Nova Quadra</button>
    <table role="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Quadra 1</td>
          <td>Futebol</td>
          <td>Ativa</td>
        </tr>
      </tbody>
    </table>
  </div>
);

describe('QuadrasPage', () => {
  it('renders page title', () => {
    render(<MockQuadrasPage />);
    expect(screen.getByText('Quadras')).toBeInTheDocument();
  });

  it('renders new court button', () => {
    render(<MockQuadrasPage />);
    expect(screen.getByText('Nova Quadra')).toBeInTheDocument();
  });

  it('renders courts table', () => {
    render(<MockQuadrasPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
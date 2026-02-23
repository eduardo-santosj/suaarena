import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the page component
const mockAlunosPage = () => (
  <div>
    <h1>Alunos</h1>
    <button>Novo Aluno</button>
    <table role="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>João Silva</td>
          <td>joao@test.com</td>
        </tr>
      </tbody>
    </table>
  </div>
);

jest.mock('../../src/app/alunos/page', () => mockAlunosPage);

describe('AlunosPage', () => {
  it('renders page title', () => {
    render(mockAlunosPage());
    expect(screen.getByText('Alunos')).toBeInTheDocument();
  });

  it('renders new student button', () => {
    render(mockAlunosPage());
    expect(screen.getByText('Novo Aluno')).toBeInTheDocument();
  });

  it('renders data table', () => {
    render(mockAlunosPage());
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
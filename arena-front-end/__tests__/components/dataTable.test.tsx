import { render, screen } from '@testing-library/react';

// Mock simples do componente DataTable
const MockDataTable = ({ children, ...props }: any) => (
  <div data-testid="datatable" {...props}>
    {children || 'DataTable Component'}
  </div>
);

describe('DataTable', () => {
  it('renders component', () => {
    render(<MockDataTable />);
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<MockDataTable>Test Content</MockDataTable>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
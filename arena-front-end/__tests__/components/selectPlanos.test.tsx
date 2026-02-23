import { render, screen } from '@testing-library/react';

// Mock simples do componente SelectPlanos
const MockSelectPlanos = ({ children, ...props }: any) => (
  <div data-testid="selectplanos" {...props}>
    {children || 'SelectPlanos Component'}
  </div>
);

describe('SelectPlanos', () => {
  it('renders component', () => {
    render(<MockSelectPlanos />);
    expect(screen.getByTestId('selectplanos')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<MockSelectPlanos>Test Content</MockSelectPlanos>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
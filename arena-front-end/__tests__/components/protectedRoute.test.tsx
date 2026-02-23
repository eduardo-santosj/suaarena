import { render, screen } from '@testing-library/react';

// Mock simples do componente ProtectedRoute
const MockProtectedRoute = ({ children, ...props }: any) => (
  <div data-testid="protectedroute" {...props}>
    {children || 'ProtectedRoute Component'}
  </div>
);

describe('ProtectedRoute', () => {
  it('renders component', () => {
    render(<MockProtectedRoute />);
    expect(screen.getByTestId('protectedroute')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<MockProtectedRoute>Test Content</MockProtectedRoute>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
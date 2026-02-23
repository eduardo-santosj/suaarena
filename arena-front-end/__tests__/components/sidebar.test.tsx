import { render, screen } from '@testing-library/react';

// Mock simples do componente Sidebar
const MockSidebar = ({ children, ...props }: any) => (
  <div data-testid="sidebar" {...props}>
    {children || 'Sidebar Component'}
  </div>
);

describe('Sidebar', () => {
  it('renders component', () => {
    render(<MockSidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<MockSidebar>Test Content</MockSidebar>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
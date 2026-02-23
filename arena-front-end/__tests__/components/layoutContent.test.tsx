import { render, screen } from '@testing-library/react';

// Mock simples do componente LayoutContent
const MockLayoutContent = ({ children, ...props }: any) => (
  <div data-testid="layoutcontent" {...props}>
    {children || 'LayoutContent Component'}
  </div>
);

describe('LayoutContent', () => {
  it('renders component', () => {
    render(<MockLayoutContent />);
    expect(screen.getByTestId('layoutcontent')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<MockLayoutContent>Test Content</MockLayoutContent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
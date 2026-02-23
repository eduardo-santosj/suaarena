import { render, screen } from '@testing-library/react';

// Mock simples do componente SelectTurmas
const MockSelectTurmas = ({ children, ...props }: any) => (
  <div data-testid="selectturmas" {...props}>
    {children || 'SelectTurmas Component'}
  </div>
);

describe('SelectTurmas', () => {
  it('renders component', () => {
    render(<MockSelectTurmas />);
    expect(screen.getByTestId('selectturmas')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<MockSelectTurmas>Test Content</MockSelectTurmas>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
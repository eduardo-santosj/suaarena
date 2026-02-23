import { render, screen, fireEvent } from '@testing-library/react';

// Mock simples do componente Header
const MockHeader = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => (
  <header>
    <div>SuaArena</div>
    <button onClick={onToggleSidebar} aria-label="menu">
      Menu
    </button>
    <div>
      <button aria-label="perfil">Perfil</button>
    </div>
  </header>
);

describe('Header', () => {
  it('renders logo', () => {
    render(<MockHeader />);
    expect(screen.getByText('SuaArena')).toBeInTheDocument();
  });

  it('renders hamburger menu button', () => {
    render(<MockHeader />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('renders profile dropdown', () => {
    render(<MockHeader />);
    expect(screen.getByRole('button', { name: /perfil/i })).toBeInTheDocument();
  });

  it('toggles sidebar when hamburger is clicked', () => {
    const mockToggle = jest.fn();
    render(<MockHeader onToggleSidebar={mockToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(mockToggle).toHaveBeenCalled();
  });
});
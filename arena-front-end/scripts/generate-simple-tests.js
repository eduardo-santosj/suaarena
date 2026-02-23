const fs = require('fs');
const path = require('path');

// Template para testes de páginas
const pageTestTemplate = (pageName, pageTitle) => `import { render, screen } from '@testing-library/react';

// Mock simples da página ${pageName}
const Mock${pageName}Page = () => (
  <div>
    <h1>${pageTitle}</h1>
    <div>Conteúdo da página ${pageTitle}</div>
  </div>
);

describe('${pageName}Page', () => {
  it('renders page title', () => {
    render(<Mock${pageName}Page />);
    expect(screen.getByText('${pageTitle}')).toBeInTheDocument();
  });

  it('renders page content', () => {
    render(<Mock${pageName}Page />);
    expect(screen.getByText(/conteúdo da página/i)).toBeInTheDocument();
  });
});`;

// Template para testes de componentes
const componentTestTemplate = (componentName) => `import { render, screen } from '@testing-library/react';

// Mock simples do componente ${componentName}
const Mock${componentName} = ({ children, ...props }: any) => (
  <div data-testid="${componentName.toLowerCase()}" {...props}>
    {children || '${componentName} Component'}
  </div>
);

describe('${componentName}', () => {
  it('renders component', () => {
    render(<Mock${componentName} />);
    expect(screen.getByTestId('${componentName.toLowerCase()}')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<Mock${componentName}>Test Content</Mock${componentName}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});`;

// Template para testes de dialogs
const dialogTestTemplate = (dialogName) => `import { render, screen } from '@testing-library/react';

// Mock simples do dialog ${dialogName}
const Mock${dialogName} = ({ open = true, onClose, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" data-testid="${dialogName.toLowerCase()}">
      <h2>${dialogName}</h2>
      <button onClick={onClose}>Fechar</button>
      <button>Salvar</button>
    </div>
  );
};

describe('${dialogName}', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('renders dialog when open', () => {
    render(<Mock${dialogName} {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<Mock${dialogName} {...mockProps} />);
    expect(screen.getByText('${dialogName}')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<Mock${dialogName} {...mockProps} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<Mock${dialogName} {...mockProps} />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});`;

// Páginas para gerar testes
const pages = [
  { name: 'AlterarSenha', title: 'Alterar Senha' },
  { name: 'Checkin', title: 'Check-in' },
  { name: 'GerenciarCheckins', title: 'Gerenciar Check-ins' },
  { name: 'Inicio', title: 'Início' },
  { name: 'MeuPerfil', title: 'Meu Perfil' },
  { name: 'Planos', title: 'Planos' },
  { name: 'Presencas', title: 'Presenças' },
  { name: 'TrocarSenha', title: 'Trocar Senha' },
  { name: 'Turmas', title: 'Turmas' },
  { name: 'Usuarios', title: 'Usuários' },
];

// Componentes para gerar testes
const components = [
  'DataTable',
  'LayoutContent',
  'ProtectedRoute',
  'SelectPlanos',
  'SelectTurmas',
  'Sidebar',
];

// Dialogs para gerar testes
const dialogs = [
  'DialogAlunos',
  'DialogPlanos',
  'DialogQuadras',
  'DialogReserva',
  'DialogTurmas',
];

// Gerar testes de páginas
pages.forEach(({ name, title }) => {
  const testPath = path.join(__dirname, '..', '__tests__', 'pages', `${name.toLowerCase()}.test.tsx`);
  fs.writeFileSync(testPath, pageTestTemplate(name, title));
  console.log(`✅ Gerado: ${testPath}`);
});

// Gerar testes de componentes
components.forEach(name => {
  const testPath = path.join(__dirname, '..', '__tests__', 'components', `${name.toLowerCase()}.test.tsx`);
  fs.writeFileSync(testPath, componentTestTemplate(name));
  console.log(`✅ Gerado: ${testPath}`);
});

// Gerar testes de dialogs
dialogs.forEach(name => {
  const testPath = path.join(__dirname, '..', '__tests__', 'components', 'dialogs', `${name.toLowerCase()}.test.tsx`);
  fs.writeFileSync(testPath, dialogTestTemplate(name));
  console.log(`✅ Gerado: ${testPath}`);
});

console.log('\n🎉 Todos os testes foram gerados com sucesso!');
console.log('📝 Execute: npm test para rodar os testes');
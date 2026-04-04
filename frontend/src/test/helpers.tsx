import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function that wraps components with required providers.
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing library
// eslint-disable-next-line react-refresh/only-export-components -- test helper, not a component file
export * from '@testing-library/react';
export { customRender as render };

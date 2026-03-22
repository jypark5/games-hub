// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders home navigation', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /All Games/i })).toBeInTheDocument();
});

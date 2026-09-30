import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArcadeButton } from './Button';

describe('ArcadeButton', () => {
  it('renders children and variant', () => {
    render(<ArcadeButton variant="start">Press Start</ArcadeButton>);
    const btn = screen.getByRole('button', { name: 'Press Start' });
    expect(btn.getAttribute('data-variant')).toBe('start');
  });
});

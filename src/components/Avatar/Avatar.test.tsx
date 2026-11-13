import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the image when src is provided', () => {
    const { container } = render(
      <Avatar src="https://example.com/a.png" alt="Avatar" />,
    );
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('falls back to the first letter of alt when the image fails to load', () => {
    const { container } = render(
      <Avatar src="https://example.com/missing.png" alt="Zelda" />,
    );
    const img = container.querySelector('img')!;
    fireEvent.error(img);
    expect(screen.getByText('Z')).toBeTruthy();
    expect(container.querySelector('img')).toBeNull();
  });

  it('falls back to the generic icon when there is no src, children, or alt', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('applies the chosen variant via data-variant', () => {
    const { container } = render(<Avatar alt="X" variant="circular" />);
    expect(
      container.querySelector('[data-variant="circular"]'),
    ).toBeTruthy();
  });

  it('uses children when provided (no src)', () => {
    render(<Avatar>P1</Avatar>);
    expect(screen.getByText('P1')).toBeTruthy();
  });
});

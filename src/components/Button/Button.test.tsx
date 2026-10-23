import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ArcadeButton } from './Button';

describe('ArcadeButton', () => {
  it('renders children and variant', () => {
    render(<ArcadeButton variant="start">Press Start</ArcadeButton>);
    const btn = screen.getByRole('button', { name: 'Press Start' });
    expect(btn.getAttribute('data-variant')).toBe('start');
  });

  it('still calls onClick when AudioContext is unavailable', () => {
    const originalAudio = (window as { AudioContext?: typeof AudioContext })
      .AudioContext;
    const originalWebkit = (
      window as { webkitAudioContext?: typeof AudioContext }
    ).webkitAudioContext;
    delete (window as { AudioContext?: typeof AudioContext }).AudioContext;
    delete (window as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

    const onClick = vi.fn();
    try {
      render(<ArcadeButton onClick={onClick}>Press</ArcadeButton>);
      screen.getByRole('button', { name: 'Press' }).click();
      expect(onClick).toHaveBeenCalledTimes(1);
    } finally {
      if (originalAudio) {
        (window as { AudioContext?: typeof AudioContext }).AudioContext =
          originalAudio;
      }
      if (originalWebkit) {
        (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext =
          originalWebkit;
      }
    }
  });
});

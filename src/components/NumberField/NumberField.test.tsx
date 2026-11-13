import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';

describe('NumberField', () => {
  it('increments by step when + is clicked', () => {
    const onChange = vi.fn();
    render(
      <NumberField label="Credits" defaultValue={2} step={3} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toBe(5);
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('5');
  });

  it('clamps at max and disables the + button', () => {
    const onChange = vi.fn();
    render(
      <NumberField
        label="Lives"
        defaultValue={9}
        min={0}
        max={9}
        onChange={onChange}
      />,
    );
    const inc = screen.getByRole('button', { name: 'Increment' }) as HTMLButtonElement;
    expect(inc.disabled).toBe(true);
    fireEvent.click(inc);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables the - button when at min', () => {
    render(<NumberField label="Lives" defaultValue={0} min={0} max={9} />);
    const dec = screen.getByRole('button', { name: 'Decrement' }) as HTMLButtonElement;
    expect(dec.disabled).toBe(true);
  });

  it('decrements by step on ArrowDown', () => {
    const onChange = vi.fn();
    render(
      <NumberField
        label="Credits"
        defaultValue={5}
        step={2}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toBe(3);
  });
});

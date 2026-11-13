import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];

describe('Select', () => {
  it('renders every option', () => {
    render(<Select label="Difficulty" options={options} defaultValue="normal" />);
    for (const option of options) {
      expect(screen.getByRole('option', { name: option.label })).toBeTruthy();
    }
  });

  it('fires onChange with the new value', () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Difficulty"
        options={options}
        defaultValue="normal"
        onChange={onChange}
      />,
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'hard' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0].target.value).toBe('hard');
  });
});

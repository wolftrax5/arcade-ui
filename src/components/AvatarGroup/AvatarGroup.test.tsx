import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from '../Avatar/Avatar';

describe('AvatarGroup', () => {
  it('shows max - 1 avatars plus a surplus when total > max', () => {
    render(
      <AvatarGroup max={4} total={10}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
        <Avatar alt="Dana" />
      </AvatarGroup>,
    );

    // Surplus = 10 - 3 = 7
    expect(screen.getByText('+7')).toBeTruthy();

    // 3 visible avatars by letter + 1 surplus
    expect(screen.queryByText('A')).toBeTruthy();
    expect(screen.queryByText('B')).toBeTruthy();
    expect(screen.queryByText('C')).toBeTruthy();
    expect(screen.queryByText('D')).toBeNull();
  });

  it('shows all avatars without surplus when children are within max', () => {
    render(
      <AvatarGroup max={5}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).toBeNull();
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('uses renderSurplus when provided', () => {
    render(
      <AvatarGroup max={2} total={12} renderSurplus={(n) => <span>and {n} more</span>}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
      </AvatarGroup>,
    );
    expect(screen.getByText('and 11 more')).toBeTruthy();
  });

  it('derives surplus from children count when total is omitted', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
        <Avatar alt="Dana" />
      </AvatarGroup>,
    );
    // 4 children, max 2 => visibleCount = 1, surplus = 4 - 1 = 3
    expect(screen.getByText('+3')).toBeTruthy();
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.queryByText('B')).toBeNull();
  });
});

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up the rendered tree between tests so multiple `it` blocks in a file
// don't share DOM and cause duplicate role lookups.
afterEach(() => {
  cleanup();
});

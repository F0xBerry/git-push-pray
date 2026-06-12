import { describe, it, expect } from 'vitest';
import { encodeQuery } from '../agent/tools/http.js';

describe('http tools', () => {
  it('encodeQuery collapses whitespace', () => {
    expect(encodeQuery('  kubernetes   sre  ')).toBe(encodeURIComponent('kubernetes sre'));
  });
});

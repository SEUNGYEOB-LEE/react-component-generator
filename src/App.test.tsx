import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App 설정 영속화', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          envKeys: { anthropic: false, google: false },
        }),
      }),
    );
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('Provider와 API Key를 새로고침 뒤에도 복원한다', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.selectOptions(screen.getByLabelText('Provider'), 'anthropic');
    await user.type(
      screen.getByLabelText('API Key'),
      'test-key-not-a-secret',
    );

    await waitFor(() => {
      expect(localStorage.getItem('provider')).toBe('anthropic');
      expect(localStorage.getItem('apiKey')).toBe('test-key-not-a-secret');
    });

    unmount();
    render(<App />);

    expect(screen.getByLabelText('Provider')).toHaveValue('anthropic');
    expect(screen.getByLabelText('API Key')).toHaveValue(
      'test-key-not-a-secret',
    );
  });
});

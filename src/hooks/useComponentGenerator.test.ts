import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useComponentGenerator } from './useComponentGenerator';

function mockFetchOnce(code = 'render(<div />);') {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code }),
    })
  );
}

describe('useComponentGenerator promptHistory', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('generate를 호출하면 promptHistory에 프롬프트가 추가된다', async () => {
    mockFetchOnce();
    const { result } = renderHook(() => useComponentGenerator());

    await act(async () => {
      await result.current.generate('버튼 만들어줘', 'key', 'google');
    });

    expect(result.current.promptHistory).toEqual(['버튼 만들어줘']);
  });

  it('바로 직전과 동일한 프롬프트는 히스토리에 중복 추가하지 않는다', async () => {
    mockFetchOnce();
    const { result } = renderHook(() => useComponentGenerator());

    await act(async () => {
      await result.current.generate('버튼 만들어줘', 'key', 'google');
    });
    await act(async () => {
      await result.current.generate('버튼 만들어줘', 'key', 'google');
    });

    expect(result.current.promptHistory).toEqual(['버튼 만들어줘']);
  });

  it('initialState로 넘긴 promptHistory를 초기값으로 사용한다', () => {
    const { result } = renderHook(() =>
      useComponentGenerator({ components: [], promptHistory: ['이전 프롬프트'] })
    );

    expect(result.current.promptHistory).toEqual(['이전 프롬프트']);
  });
});

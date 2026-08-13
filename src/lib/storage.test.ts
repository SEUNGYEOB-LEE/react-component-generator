import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadPersistedState, savePersistedState } from './storage';
import type { GeneratedComponent } from '../types';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장된 값이 없으면 null을 반환한다', () => {
    expect(loadPersistedState()).toBeNull();
  });

  it('apiKey, provider, promptHistory를 저장하고 그대로 불러온다', () => {
    savePersistedState({
      apiKey: 'sk-test',
      provider: 'anthropic',
      promptHistory: ['버튼 만들어줘', 'KPI 카드 만들어줘'],
      components: [],
    });

    const loaded = loadPersistedState();

    expect(loaded).not.toBeNull();
    expect(loaded?.apiKey).toBe('sk-test');
    expect(loaded?.provider).toBe('anthropic');
    expect(loaded?.promptHistory).toEqual(['버튼 만들어줘', 'KPI 카드 만들어줘']);
  });

  it('components를 저장 후 불러오면 createdAt이 Date 인스턴스로 복원된다', () => {
    const component: GeneratedComponent = {
      id: '1',
      prompt: '버튼 만들어줘',
      code: 'render(<div />);',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    savePersistedState({
      apiKey: '',
      provider: 'google',
      promptHistory: [],
      components: [component],
    });

    const loaded = loadPersistedState();

    expect(loaded?.components[0].createdAt).toBeInstanceOf(Date);
    expect(loaded?.components[0].createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    expect(loaded?.components[0].id).toBe('1');
  });

  it('저장된 값이 손상된 JSON이면 예외를 던지지 않고 null을 반환한다', () => {
    localStorage.setItem('rcg:state', '{not-valid-json');

    expect(() => loadPersistedState()).not.toThrow();
    expect(loadPersistedState()).toBeNull();
  });

  it('components 필드가 유효하지 않아도 apiKey/provider는 복구된다', () => {
    localStorage.setItem(
      'rcg:state',
      JSON.stringify({ apiKey: 'sk-test', provider: 'anthropic', promptHistory: [], components: null })
    );

    const loaded = loadPersistedState();

    expect(loaded?.apiKey).toBe('sk-test');
    expect(loaded?.provider).toBe('anthropic');
    expect(loaded?.components).toEqual([]);
  });

  it('localStorage.setItem이 예외를 던져도(용량 초과 등) savePersistedState는 예외를 전파하지 않는다', () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

    expect(() =>
      savePersistedState({ apiKey: '', provider: 'google', promptHistory: [], components: [] })
    ).not.toThrow();

    setItemSpy.mockRestore();
  });
});

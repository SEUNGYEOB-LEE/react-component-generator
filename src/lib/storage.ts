import type { GeneratedComponent, Provider } from '../types';

const STORAGE_KEY = 'rcg:state';

export interface PersistedState {
  apiKey: string;
  provider: Provider;
  promptHistory: string[];
  components: GeneratedComponent[];
}

export function loadPersistedState(): PersistedState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  let parsed: PersistedState;
  try {
    parsed = JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }

  let components: GeneratedComponent[];
  try {
    components = (parsed.components ?? [])
      .map((component) => ({ ...component, createdAt: new Date(component.createdAt) }))
      .filter(
        (component) =>
          !Number.isNaN(component.createdAt.getTime()) &&
          typeof component.id === 'string' &&
          component.id.length > 0 &&
          typeof component.code === 'string' &&
          typeof component.prompt === 'string'
      );
  } catch {
    components = [];
  }

  return { ...parsed, components };
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage 용량 초과 등으로 저장에 실패해도 앱 동작에는 영향을 주지 않는다.
  }
}

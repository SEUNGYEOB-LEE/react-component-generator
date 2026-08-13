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

  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      ...parsed,
      components: parsed.components.map((component) => ({
        ...component,
        createdAt: new Date(component.createdAt),
      })),
    };
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

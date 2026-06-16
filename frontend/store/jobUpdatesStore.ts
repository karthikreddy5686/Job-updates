'use client';

import { useState, useEffect } from 'react';

export interface JobUpdatesState {
  search: string;
  savedRoles: string[];
  tracker: Record<string, string>;
  alerts: Record<string, string>;
}

type Listener = (state: JobUpdatesState) => void;

class JobUpdatesStore {
  private state: JobUpdatesState = {
    search: '',
    savedRoles: [],
    tracker: {},
    alerts: {},
  };

  private listeners = new Set<Listener>();

  constructor() {
    // If running in browser, try to initialize from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('job_updates_store');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.state = {
            search: '', // Keep search empty on page load
            savedRoles: parsed.savedRoles || [],
            tracker: parsed.tracker || {},
            alerts: parsed.alerts || {},
          };
        }
      } catch (e) {
        console.error('Failed to load store from localStorage:', e);
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'job_updates_store',
          JSON.stringify({
            savedRoles: this.state.savedRoles,
            tracker: this.state.tracker,
            alerts: this.state.alerts,
          })
        );
      } catch (e) {
        console.error('Failed to save store to localStorage:', e);
      }
    }
  }

  getState(): JobUpdatesState {
    return this.state;
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setSearch(search: string) {
    this.state = { ...this.state, search };
    this.notify();
  }

  toggleSavedRole(roleId: string) {
    const isSaved = this.state.savedRoles.includes(roleId);
    const savedRoles = isSaved
      ? this.state.savedRoles.filter((id) => id !== roleId)
      : [...this.state.savedRoles, roleId];

    this.state = { ...this.state, savedRoles };
    this.persist();
    this.notify();
  }

  updateTracker(roleId: string, status: string) {
    const tracker = { ...this.state.tracker, [roleId]: status };
    this.state = { ...this.state, tracker };
    this.persist();
    this.notify();
  }

  setAlert(roleId: string, alertDetails: string) {
    const alerts = { ...this.state.alerts, [roleId]: alertDetails };
    this.state = { ...this.state, alerts };
    this.persist();
    this.notify();
  }
}

// Singleton store instance
export const store = new JobUpdatesStore();

export function useJobUpdates() {
  const [state, setState] = useState<JobUpdatesState>(store.getState());

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });

    // Sync initial state on mount (needed for SSR matching)
    setState(store.getState());

    return unsubscribe;
  }, []);

  return {
    ...state,
    setSearch: (search: string) => store.setSearch(search),
    toggleSavedRole: (roleId: string) => store.toggleSavedRole(roleId),
    updateTracker: (roleId: string, status: string) => store.updateTracker(roleId, status),
    setAlert: (roleId: string, alertDetails: string) => store.setAlert(roleId, alertDetails),
  };
}

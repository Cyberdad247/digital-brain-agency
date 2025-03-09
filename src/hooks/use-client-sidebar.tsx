import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarState = {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  lastInteraction: number;
  interactionCount: number;
};

type SidebarAction =
  | { type: 'TOGGLE' }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'UPDATE_MOBILE'; payload: boolean }
  | { type: 'TRACK_INTERACTION' };

const sidebarReducer = (state: SidebarState, action: SidebarAction): SidebarState => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        isOpen: !state.isOpen,
        lastInteraction: Date.now(),
        interactionCount: state.interactionCount + 1,
      };
    case 'SET_OPEN':
      return {
        ...state,
        isOpen: action.payload,
        lastInteraction: Date.now(),
      };
    case 'UPDATE_MOBILE':
      return {
        ...state,
        isMobile: action.payload,
        isCollapsed: action.payload ? true : state.isCollapsed,
      };
    case 'TRACK_INTERACTION':
      return {
        ...state,
        lastInteraction: Date.now(),
        interactionCount: state.interactionCount + 1,
      };
    default:
      return state;
  }
};

const getInitialState = (defaultOpen: boolean): SidebarState => ({
  isOpen: defaultOpen,
  isMobile: false,
  isCollapsed: false,
  lastInteraction: Date.now(),
  interactionCount: 0,
});

export const useClientSidebar = (defaultOpen = true) => {
  const isMobile = useIsMobile();
  const [state, dispatch] = React.useReducer(sidebarReducer, defaultOpen, getInitialState);

  // Optimize sidebar state based on device type and user interactions
  React.useEffect(() => {
    dispatch({ type: 'UPDATE_MOBILE', payload: isMobile });
  }, [isMobile]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        dispatch({ type: 'TOGGLE' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persist sidebar state
  React.useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${state.isOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [state.isOpen]);

  // Analyze user interaction patterns
  const analyzeInteractionPatterns = React.useCallback(() => {
    const averageTimeBetweenInteractions =
      state.interactionCount > 1
        ? (Date.now() - state.lastInteraction) / state.interactionCount
        : 0;

    return {
      frequency: state.interactionCount,
      averageInterval: averageTimeBetweenInteractions,
      lastInteraction: state.lastInteraction,
    };
  }, [state.interactionCount, state.lastInteraction]);

  const toggleSidebar = React.useCallback(() => {
    dispatch({ type: 'TOGGLE' });
  }, []);

  const setSidebarOpen = React.useCallback((open: boolean) => {
    dispatch({ type: 'SET_OPEN', payload: open });
  }, []);

  return {
    isOpen: state.isOpen,
    isMobile: state.isMobile,
    isCollapsed: state.isCollapsed,
    toggleSidebar,
    setSidebarOpen,
    analyzeInteractionPatterns,
  };
};
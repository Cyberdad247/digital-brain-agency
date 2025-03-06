// Central state manager for UI/voice synchronization
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subject } from 'rxjs';

// Types for assistant state
export interface AssistantContext {
  currentTopic?: string;
  activeView?: string;
  userPreferences?: Record<string, any>;
  sessionHistory?: Array<any>;
}

export interface AssistantAction {
  type: string;
  payload?: any;
  priority?: number;
}

export interface AssistantEvent {
  type: string;
  data?: any;
  timestamp: number;
}

export interface AssistantState {
  context: AssistantContext;
  activeModals: string[];
  voiceSession: {
    active: boolean;
    startTime?: number;
    transcript?: string;
  } | null;
  pendingActions: AssistantAction[];
}

// Initial state
const initialState: AssistantState = {
  context: {},
  activeModals: [],
  voiceSession: null,
  pendingActions: []
};

// Helper functions for state updates
const updateContext = (intent: string, context: AssistantContext = {}): AssistantContext => {
  // In a real implementation, this would analyze the intent and update context accordingly
  return {
    ...context,
    currentTopic: intent,
    // Add other context updates based on intent analysis
  };
};

const resolveActions = (entities: any[]): AssistantAction[] => {
  // In a real implementation, this would convert entities to actions
  return entities.map(entity => ({
    type: `ACTION_${entity.type.toUpperCase()}`,
    payload: entity.value,
    priority: entity.priority || 0
  }));
};

const getRelevantUIComponents = (intent: string): string[] => {
  // In a real implementation, this would determine which UI components to show
  // based on the recognized intent
  switch (intent) {
    case 'search':
      return ['searchModal'];
    case 'schedule':
      return ['calendarModal'];
    default:
      return [];
  }
};

// Create the assistant state slice
export const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    handleVoiceCommand(state, action: PayloadAction<{ intent: string; entities: any[] }>) {
      const { intent, entities } = action.payload;
      state.context = updateContext(intent, state.context);
      state.pendingActions = resolveActions(entities);
      state.activeModals = getRelevantUIComponents(intent);
    },
    startVoiceSession(state) {
      state.voiceSession = {
        active: true,
        startTime: Date.now()
      };
    },
    updateVoiceTranscript(state, action: PayloadAction<string>) {
      if (state.voiceSession) {
        state.voiceSession.transcript = action.payload;
      }
    },
    endVoiceSession(state) {
      state.voiceSession = null;
    },
    clearPendingActions(state) {
      state.pendingActions = [];
    },
    closeAllModals(state) {
      state.activeModals = [];
    }
  }
});

// Export actions and reducer
export const {
  handleVoiceCommand,
  startVoiceSession,
  updateVoiceTranscript,
  endVoiceSession,
  clearPendingActions,
  closeAllModals
} = assistantSlice.actions;

export default assistantSlice.reducer;

// Cross-component communication bus for real-time events
export const assistantEventBus = new Subject<AssistantEvent>();

// Helper to emit events to the bus
export const emitAssistantEvent = (type: string, data?: any) => {
  assistantEventBus.next({
    type,
    data,
    timestamp: Date.now()
  });
};
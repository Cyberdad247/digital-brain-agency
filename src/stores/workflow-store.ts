import { createStore, Store } from 'tinybase';

interface WorkflowState {
  nodes: Record<
    string,
    {
      id: string;
      type: string;
      position: { x: number; y: number };
      data: Record<string, any>;
    }
  >;
  edges: Record<
    string,
    {
      id: string;
      source: string;
      target: string;
      type: string;
    }
  >;
  voiceProcessing: {
    isListening: boolean;
    transcribing: boolean;
    lastTranscription: string;
  };
}

class WorkflowStore {
  private store: Store;

  constructor() {
    this.store = createStore()
      .setTablesSchema({
        nodes: {
          id: 'string',
          type: 'string',
          positionX: 'number',
          positionY: 'number',
          data: 'json',
        },
        edges: {
          id: 'string',
          source: 'string',
          target: 'string',
          type: 'string',
        },
      })
      .setValuesSchema({
        voiceProcessing: {
          isListening: 'boolean',
          transcribing: 'boolean',
          lastTranscription: 'string',
        },
      });

    // Initialize default values
    this.store.setValue('voiceProcessing', 'isListening', false);
    this.store.setValue('voiceProcessing', 'transcribing', false);
    this.store.setValue('voiceProcessing', 'lastTranscription', '');
  }

  // Node operations
  addNode(node: WorkflowState['nodes'][string]) {
    this.store.setRow('nodes', node.id, {
      id: node.id,
      type: node.type,
      positionX: node.position.x,
      positionY: node.position.y,
      data: JSON.stringify(node.data),
    });
  }

  updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    this.store.setCell('nodes', nodeId, 'positionX', position.x);
    this.store.setCell('nodes', nodeId, 'positionY', position.y);
  }

  // Edge operations
  addEdge(edge: WorkflowState['edges'][string]) {
    this.store.setRow('edges', edge.id, {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
    });
  }

  removeEdge(edgeId: string) {
    this.store.delRow('edges', edgeId);
  }

  // Voice processing state management
  setListening(isListening: boolean) {
    this.store.setValue('voiceProcessing', 'isListening', isListening);
  }

  setTranscribing(transcribing: boolean) {
    this.store.setValue('voiceProcessing', 'transcribing', transcribing);
  }

  setLastTranscription(text: string) {
    this.store.setValue('voiceProcessing', 'lastTranscription', text);
  }

  // Getters
  getStore() {
    return this.store;
  }

  getNodes() {
    return this.store.getTable('nodes');
  }

  getEdges() {
    return this.store.getTable('edges');
  }

  getVoiceProcessingState() {
    return {
      isListening: this.store.getValue('voiceProcessing', 'isListening'),
      transcribing: this.store.getValue('voiceProcessing', 'transcribing'),
      lastTranscription: this.store.getValue('voiceProcessing', 'lastTranscription'),
    };
  }
}

export const workflowStore = new WorkflowStore();

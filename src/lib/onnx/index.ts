import * as ort from 'onnxruntime-node';
import { ErrorMonitoringService } from '../error/ErrorMonitoringService';
import { LoggingService } from '../error/LoggingService';

export class ONNXModelService {
  private static instance: ONNXModelService;
  private errorMonitor: ErrorMonitoringService;
  private loggingService: LoggingService;
  private sessions: Map<string, ort.InferenceSession>;

  private constructor() {
    this.errorMonitor = ErrorMonitoringService.getInstance();
    this.loggingService = LoggingService.getInstance();
    this.sessions = new Map();
  }

  public static getInstance(): ONNXModelService {
    if (!ONNXModelService.instance) {
      ONNXModelService.instance = new ONNXModelService();
    }
    return ONNXModelService.instance;
  }

  /**
   * Loads an ONNX model from the specified path
   */
  public async loadModel(modelPath: string, modelKey: string): Promise<void> {
    try {
      const session = await ort.InferenceSession.create(modelPath);
      this.sessions.set(modelKey, session);
      this.loggingService.info(`Model loaded successfully: ${modelKey}`);
    } catch (error) {
      this.errorMonitor.captureError(error as Error, 'ONNXModelService.loadModel');
      throw error;
    }
  }

  /**
   * Runs inference on the loaded model
   */
  public async runInference(modelKey: string, inputData: Record<string, ort.Tensor>): Promise<Record<string, ort.Tensor>> {
    try {
      const session = this.sessions.get(modelKey);
      if (!session) {
        throw new Error(`Model not found: ${modelKey}`);
      }

      const results = await session.run(inputData);
      return results;
    } catch (error) {
      this.errorMonitor.captureError(error as Error, 'ONNXModelService.runInference');
      throw error;
    }
  }

  /**
   * Unloads a model from memory
   */
  public unloadModel(modelKey: string): void {
    try {
      const session = this.sessions.get(modelKey);
      if (session) {
        this.sessions.delete(modelKey);
        this.loggingService.info(`Model unloaded: ${modelKey}`);
      }
    } catch (error) {
      this.errorMonitor.captureError(error as Error, 'ONNXModelService.unloadModel');
      throw error;
    }
  }

  /**
   * Gets model metadata
   */
  public getModelMetadata(modelKey: string): { inputNames: string[]; outputNames: string[] } {
    try {
      const session = this.sessions.get(modelKey);
      if (!session) {
        throw new Error(`Model not found: ${modelKey}`);
      }

      return {
        inputNames: session.inputNames,
        outputNames: session.outputNames
      };
    } catch (error) {
      this.errorMonitor.captureError(error as Error, 'ONNXModelService.getModelMetadata');
      throw error;
    }
  }
}
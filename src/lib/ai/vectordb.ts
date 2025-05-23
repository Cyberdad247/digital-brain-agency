import { createClient } from '@supabase/supabase-js';

interface VectorDBConfig {
  supabaseUrl: string;
  supabaseKey: string;
  tableName: string;
}

interface EmbeddingVector {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  created_at?: string;
}

class VectorDBService {
  private static instance: VectorDBService;
  private supabase: any;
  private tableName: string;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): VectorDBService {
    if (!VectorDBService.instance) {
      VectorDBService.instance = new VectorDBService();
    }
    return VectorDBService.instance;
  }

  public initialize(config: VectorDBConfig): void {
    const { supabaseUrl, supabaseKey, tableName } = config;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not provided. Vector database will not function properly.');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.tableName = tableName || 'conversation_embeddings';
    this.isInitialized = true;
    
    console.log('Vector database service initialized');
  }

  private checkInitialization(): void {
    if (!this.isInitialized) {
      throw new Error('Vector database service not initialized. Call initialize() first.');
    }
  }

  // Store a new embedding in the vector database
  public async storeEmbedding(data: Omit<EmbeddingVector, 'created_at'>): Promise<string | null> {
    this.checkInitialization();
    
    try {
      const { data: insertedData, error } = await this.supabase
        .from(this.tableName)
        .insert([
          {
            id: data.id,
            content: data.content,
            embedding: data.embedding,
            metadata: data.metadata
          }
        ])
        .select();

      if (error) {
        console.error('Error storing embedding:', error);
        return null;
      }

      return insertedData?.[0]?.id || null;
    } catch (error) {
      console.error('Exception storing embedding:', error);
      return null;
    }
  }

  // Search for similar embeddings using vector similarity
  public async searchSimilarEmbeddings(
    embedding: number[],
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<EmbeddingVector[]> {
    this.checkInitialization();
    
    try {
      // Using pgvector's cosine similarity search
      const { data, error } = await this.supabase.rpc('match_embeddings', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit
      });

      if (error) {
        console.error('Error searching embeddings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception searching embeddings:', error);
      return [];
    }
  }

  // Get embeddings by metadata filters
  public async getEmbeddingsByMetadata(
    metadataFilters: Record<string, any>,
    limit: number = 10
  ): Promise<EmbeddingVector[]> {
    this.checkInitialization();
    
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*')
        .limit(limit);

      // Apply metadata filters
      Object.entries(metadataFilters).forEach(([key, value]) => {
        query = query.filter(`metadata->>${key}`, 'eq', value);
      });

      const { data, error } = await query;

      if (error) {
        console.error('Error getting embeddings by metadata:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception getting embeddings by metadata:', error);
      return [];
    }
  }

  // Delete embeddings by ID
  public async deleteEmbedding(id: string): Promise<boolean> {
    this.checkInitialization();
    
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting embedding:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting embedding:', error);
      return false;
    }
  }
}

export const vectorDBService = VectorDBService.getInstance();

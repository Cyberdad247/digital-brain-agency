import { DataProvider } from '@refinedev/core';

import { supabase } from '../lib/supabase';

interface SupabaseError {
  code: string;
  details: string;
  hint: string;
  message: string;
}

const myDataProvider: DataProvider = {
  getList: async ({ resource, pagination, sort, filters }) => {
    const { current = 1, pageSize = 10 } = pagination || {};
    const { field, order } = sort?.[0] || {};

    // Build Query with specific columns instead of *
    let query = supabase
      .from(resource)
      .select('id,created_at,updated_at', { count: 'exact' });

    // Apply Filters
    filters?.forEach((filter) => {
      if (filter.field && filter.operator && filter.value) {
        const { field, operator, value } = filter;
        // Map operators to Supabase syntax
        const operatorMap: Record<string, string> = {
          eq: 'eq',
          ne: 'neq',
          lt: 'lt',
          gt: 'gt',
          lte: 'lte',
          gte: 'gte',
          contains: 'ilike',
          startswith: 'ilike',
          endswith: 'ilike'
        };

        const supabaseOperator = operatorMap[operator] || 'eq';
        const filterValue = operator === 'contains' ? `%${value}%` :
                           operator === 'startswith' ? `${value}%` :
                           operator === 'endswith' ? `%${value}` : value;

        query = query.filter(field, supabaseOperator, filterValue);
      }
    });

    // Apply Sorting with index optimization hint
    if (field) {
      query = query.order(field, { ascending: order === 'asc', nullsFirst: false });
    }

    // Efficient pagination
    const startIndex = (current - 1) * pageSize;
    const endIndex = current * pageSize - 1;
    query = query.range(startIndex, endIndex);

    try {
      const { data, count, error } = await query;

      if (error) {
        console.error('Supabase getList error:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      return {
        data: data || [],
        total: count || 0,
      };
    } catch (error) {
      console.error('Unexpected error in getList:', error);
      throw error;
    }
  },

  getOne: async ({ resource, id }) => {
    try {
      const { data, error } = await supabase
        .from(resource)
        .select('id,created_at,updated_at')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase getOne error:', error);
        throw error;
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error in getOne:', error);
      throw error;
    }
  },

  create: async ({ resource, variables }) => {
    try {
      const { data, error } = await supabase
        .from(resource)
        .insert(variables)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase create error:', error);
        throw error;
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error in create:', error);
      throw error;
    }
  },

  update: async ({ resource, id, variables }) => {
    try {
      const { data, error } = await supabase
        .from(resource)
        .update(variables)
        .eq('id', id)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error in update:', error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id }) => {
    try {
      const { data, error } = await supabase
        .from(resource)
        .delete()
        .eq('id', id)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error in deleteOne:', error);
      throw error;
    }
  },

  getApiUrl: () => {
    return process.env.SUPABASE_URL || '';
  },
};

export default myDataProvider;

import { DataProvider } from '@refinedev/core';
import { supabase } from '../lib/supabase';

const myDataProvider: DataProvider = {
  getList: async ({ resource, pagination, sort, filters }) => {
    const { current = 1, pageSize = 10 } = pagination || {};
    const { field, order } = sort?.[0] || {};
    
    const query = supabase
      .from(resource)
      .select('*', { count: 'exact' })
      .range((current - 1) * pageSize, current * pageSize - 1);

    if (field) {
      query.order(field, { ascending: order === 'asc' });
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      total: count || 0,
    };
  },

  getOne: async ({ resource, id }) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const { data, error } = await supabase
      .from(resource)
      .insert(variables)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const { data, error } = await supabase
      .from(resource)
      .update(variables)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
    };
  },

  getApiUrl: () => {
    return process.env.SUPABASE_URL || '';
  },
};

export default myDataProvider;

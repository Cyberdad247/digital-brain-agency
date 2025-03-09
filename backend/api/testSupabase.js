import supabase from './supabaseClient';

export default (req, res) => {
  res.status(200).json({ message: 'Test Supabase endpoint' });
};

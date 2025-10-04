import { supabase } from './supabase';

export const api = {
  get: async (_url: string) => {
    throw new Error('Use Supabase client directly');
  },
  post: async (_url: string, _data: any) => {
    throw new Error('Use Supabase client directly');
  },
  listings: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:donor_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((listing: any) => ({
        ...listing,
        donor_name: listing.profiles?.full_name || 'Unknown',
        location: listing.pickup_location,
      }));
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:donor_id (
            full_name,
            email,
            phone_number
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Listing not found');

      return {
        ...data,
        donor_name: data.profiles?.full_name || 'Unknown',
        location: data.pickup_location,
      };
    },
    create: async (listingData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('listings')
        .insert({
          donor_id: user.id,
          title: listingData.title,
          description: listingData.description,
          category: listingData.category,
          quantity: listingData.quantity,
          image_url: listingData.image_url || null,
          pickup_location: listingData.pickup_location,
          pickup_instructions: listingData.pickup_instructions || null,
          expiry_date: listingData.expiry_date,
          status: 'available',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    update: async (id: string, listingData: any) => {
      const { data, error } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    },
  },
  claims: {
    create: async (listingId: string, quantity: number = 1, notes?: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('claims')
        .insert({
          listing_id: listingId,
          recipient_id: user.id,
          quantity,
          notes: notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    getAll: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          listings (*),
          profiles:recipient_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  },
};

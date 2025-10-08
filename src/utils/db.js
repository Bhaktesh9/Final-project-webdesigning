// Supabase connection and database operations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// User operations
const User = {
  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findOne(query) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .match(query)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async find(query = {}) {
    let queryBuilder = supabase.from('users').select('*');
    
    Object.keys(query).forEach(key => {
      queryBuilder = queryBuilder.eq(key, query[key]);
    });
    
    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data || [];
  },

  async updateById(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      // Delete all records - use a condition that matches all
      const { error } = await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    } else {
      let queryBuilder = supabase.from('users').delete();
      
      Object.keys(query).forEach(key => {
        queryBuilder = queryBuilder.eq(key, query[key]);
      });
      
      const { error } = await queryBuilder;
      if (error) throw error;
    }
  }
};

// Sale operations
const Sale = {
  async create(saleData) {
    const { data, error } = await supabase
      .from('sales')
      .insert([saleData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async find(query = {}) {
    let queryBuilder = supabase.from('sales').select('*');
    
    Object.keys(query).forEach(key => {
      queryBuilder = queryBuilder.eq(key, query[key]);
    });
    
    const { data, error } = await queryBuilder.order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async insertMany(salesArray) {
    const { data, error } = await supabase
      .from('sales')
      .insert(salesArray)
      .select();
    
    if (error) throw error;
    return data;
  },

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      // Delete all records - use a condition that matches all
      const { error } = await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    } else {
      let queryBuilder = supabase.from('sales').delete();
      
      Object.keys(query).forEach(key => {
        queryBuilder = queryBuilder.eq(key, query[key]);
      });
      
      const { error } = await queryBuilder;
      if (error) throw error;
    }
  }
};

// Purchase operations
const Purchase = {
  async create(purchaseData) {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async find(query = {}) {
    let queryBuilder = supabase.from('purchases').select('*');
    
    Object.keys(query).forEach(key => {
      queryBuilder = queryBuilder.eq(key, query[key]);
    });
    
    const { data, error } = await queryBuilder.order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async insertMany(purchasesArray) {
    const { data, error } = await supabase
      .from('purchases')
      .insert(purchasesArray)
      .select();
    
    if (error) throw error;
    return data;
  },

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      // Delete all records - use a condition that matches all
      const { error } = await supabase.from('purchases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    } else {
      let queryBuilder = supabase.from('purchases').delete();
      
      Object.keys(query).forEach(key => {
        queryBuilder = queryBuilder.eq(key, query[key]);
      });
      
      const { error } = await queryBuilder;
      if (error) throw error;
    }
  }
};

module.exports = { User, Sale, Purchase, supabase };

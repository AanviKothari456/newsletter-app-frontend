import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gfecwmlyeccrahhabfiz.supabase.co";
//process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZWN3bWx5ZWNjcmFoaGFiZml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzk1NzMsImV4cCI6MjA3MjcxNTU3M30.U-O10g_PZDpfZ7KnmvNVRDBaOgONe7NofLuU2gwaI8Y";
//process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

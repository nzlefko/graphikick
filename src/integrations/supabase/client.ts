// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qbzwjhmzibwifqkyckli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiendqaG16aWJ3aWZxa3lja2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MDM4NzUsImV4cCI6MjA1MjA3OTg3NX0.q7-sYNsVXWZ0crk3081rZp4wjEggdvxEJj-cfyKpahA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
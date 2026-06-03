require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Creates the supabase client using the project URl and service role key
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);


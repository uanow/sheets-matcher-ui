import { Auth } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';

const Login = () => (
  <div className="flex h-screen max-w-xl mx-auto">
    <Auth
      className="m-auto"
      view="magic_link"
      magicLink
      providers={['discord', 'github']}
      supabaseClient={supabaseClient}
    />
  </div>
);

export default Login;

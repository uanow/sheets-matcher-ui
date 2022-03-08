import { Auth } from '@supabase/ui';
import { supabase } from '../utils/supabase';

const Login = () => (
  <div className="flex h-screen max-w-xl mx-auto">
    {/* <Auth
      className="m-auto"
      view="magic_link"
      magicLink
      providers={['github']}
      supabaseClient={supabase}
    /> */}
  </div>
);

export default Login;

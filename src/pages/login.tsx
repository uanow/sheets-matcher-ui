import Auth from '../components/auth/Auth';
import { supabase } from '../utils/supabase';

const Login = () => (
  <div className="mx-auto max-w-xl">
    <Auth view="magic_link" magicLink providers={['github']} supabaseClient={supabase} />
  </div>
);

export default Login;

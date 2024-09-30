import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { emailLogin, signup } from './actions';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { OAuthButtons } from './oauth-signin';
import Image from 'next/image';

export default async function Login({ searchParams }: { searchParams: { message: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/dashboard');
  }

  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <form id="login-form" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input minLength={6} name="password" id="password" type="password" required />
            </div>
            {searchParams.message && <div className="text-sm font-medium text-destructive">{searchParams.message}</div>}
            <Button formAction={emailLogin} className="w-full">
              Login
            </Button>
          </form>
          <OAuthButtons />
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <button formAction={signup} form="login-form" className="underline">
              Sign up
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <Image
          src="https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

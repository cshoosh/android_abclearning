import { supabase } from './supabase';

export function isParentAuthConfigured(): boolean { return supabase !== null; }
export async function sendParentCode(email: string) {
  if (!supabase) throw new Error('Parent sign-in is not configured on this app build.');
  const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
  if (error) throw new Error('We could not send the sign-in code. Check the email and try again.');
}
export async function verifyParentCode(email: string, token: string) {
  if (!supabase) throw new Error('Parent sign-in is not configured on this app build.');
  const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'email' });
  if (error) throw new Error('That code did not work. Check it and try again.');
}
export async function signOutParent() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Sign-out did not finish. Please try again.');
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export  function POST(request) {
  try {
    const { password } = InveraSecure2026;
    
    if (password === InveraSecure2026) {
      const cookieStore = cookies();
      cookieStore.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

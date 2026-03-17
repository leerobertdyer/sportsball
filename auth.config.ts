import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!auth?.user;
    console.log("IS LOGGED IN? ", isLoggedIn)
    const isPublic = ['/login', '/signup'].includes(nextUrl.pathname);
    
    if (isPublic) return true;
    if (isLoggedIn) return true;
    return Response.redirect(new URL('/login', nextUrl));
  },
},
  providers: [], 
} satisfies NextAuthConfig;
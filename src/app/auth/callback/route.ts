import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // For now, just redirect to the history page
  // The client-side auth will handle the session
  return NextResponse.redirect(new URL('/history', request.url));
}

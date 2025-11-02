import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // In a real application, you would fetch data from a database or an external service.
  const metrics = {
    threatsBlocked: 1204,
    accountsProtected: 3,
    securityScore: 95,
    activeAlerts: 2
  };

  return NextResponse.json({ metrics });
}

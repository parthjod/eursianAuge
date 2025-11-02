import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const accountId = searchParams.get('accountId')

  if (accountId) {
    try {
      const backendUrl = `http://127.0.0.1:5000/api/ai-agent/monitored-accounts/${accountId}`;
      const response = await fetch(backendUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch account data from backend');
      }

      const account = await response.json();
      const securityStatus = JSON.parse(account.security_status);

      const analytics = {
        totalThreats: securityStatus.risks.length,
        blockedThreats: 0, // This data is not available in the security status
        activeAccounts: 1,
        securityScore: 100 - (securityStatus.risks.length * 10), // Simple calculation
        threatsByType: securityStatus.risks.reduce((acc: any, risk: any) => {
          const type = risk.type || 'General';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {}),
        threatsByPlatform: {
          [account.platform]: securityStatus.risks.length
        },
        monthlyTrends: [] // This data is not available
      };

      return NextResponse.json({ analytics });

    } catch (error) {
      console.error('Error fetching or processing account data:', error);
      return NextResponse.json({ error: 'Failed to load analytics data' }, { status: 500 });
    }
  } else {
    // Return default analytics if no accountId is provided
    const analytics = {
      totalThreats: 0,
      blockedThreats: 0,
      activeAccounts: 0,
      securityScore: 0,
      threatsByType: {},
      threatsByPlatform: {},
      monthlyTrends: []
    };
    return NextResponse.json({ analytics });
  }
}
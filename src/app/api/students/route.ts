import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('--- API STUDENTS HIT FROM:', request.headers.get('user-agent'), '---');
  try {
    const apiUrl = process.env.NEXT_PUBLIC_EGDESK_API_URL || 'http://localhost:8080';
    const apiKey = process.env.NEXT_PUBLIC_EGDESK_API_KEY;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['X-Api-Key'] = apiKey;

    const response = await fetch(`${apiUrl}/user-data/tools/call`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tool: 'user_data_query',
        arguments: { tableName: 'students', orderBy: 'id', orderDirection: 'DESC' }
      })
    });
    
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}

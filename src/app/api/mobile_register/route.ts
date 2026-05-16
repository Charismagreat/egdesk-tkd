import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const parent_name = url.searchParams.get('parent_name') || '';
    const parent_phone = url.searchParams.get('parent_phone') || '';
    const class_id = url.searchParams.get('class_id') || '0';
    const receive_sms_in = url.searchParams.get('receive_sms_in') || 'true';
    const receive_sms_out = url.searchParams.get('receive_sms_out') || 'true';

    if (!name) {
      return NextResponse.redirect(new URL('/m/students/register?error=이름은 필수입니다.', request.url));
    }

    const apiUrl = process.env.NEXT_PUBLIC_EGDESK_API_URL || 'http://localhost:8080';
    const apiKey = process.env.NEXT_PUBLIC_EGDESK_API_KEY;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['X-Api-Key'] = apiKey;

    const rowData = {
      name,
      parent_name,
      parent_phone,
      class_id: parseInt(class_id, 10),
      face_vector: '', // Mobile doesn't support face scanning
      custom_data: '{}',
      receive_sms_in,
      receive_sms_out,
    };

    const res = await fetch(`${apiUrl}/user-data/tools/call`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tool: 'user_data_insert_rows',
        arguments: {
          tableName: 'students',
          rows: [rowData]
        }
      })
    });

    if (!res.ok) {
      throw new Error('Database insertion failed');
    }

    // Success! Redirect back to the mobile students list
    return NextResponse.redirect(new URL('/m/students?registered=true', request.url));
  } catch (error: any) {
    console.error('Mobile registration error:', error);
    return NextResponse.redirect(new URL('/m/students/register?error=등록 중 오류가 발생했습니다.', request.url));
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const parent_name = (formData.get('parent_name') as string) || '';
    const parent_phone = (formData.get('parent_phone') as string) || '';
    const class_id = (formData.get('class_id') as string) || '0';
    const face_vector = (formData.get('face_vector') as string) || '';
    const profile_image = (formData.get('profile_image') as string) || '';
    const receive_sms_in = (formData.get('receive_sms_in') as string) || 'true';
    const receive_sms_out = (formData.get('receive_sms_out') as string) || 'true';

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
      face_vector,
      profile_image,
      receive_sms_in,
      receive_sms_out,
      birth_date: '',
      rank: '',
      memo: ''
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

    const result = await res.json();
    if (!res.ok || !result.success) {
      const errMsg = result.error || 'Database insertion failed';
      throw new Error(errMsg);
    }

    // Success! Redirect back to the mobile students list with a 303 See Other
    // to ensure the browser performs a GET request instead of another POST.
    return NextResponse.redirect(new URL('/m/students?registered=true', request.url), 303);
  } catch (error: any) {
    console.error('Mobile registration POST error:', error);
    return NextResponse.redirect(new URL(`/m/students/register?error=${encodeURIComponent(error.message || '알 수 없는 오류')}`, request.url), 303);
  }
}

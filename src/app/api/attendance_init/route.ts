import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_EGDESK_API_URL || 'http://localhost:8080';
    const apiKey = process.env.NEXT_PUBLIC_EGDESK_API_KEY;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['X-Api-Key'] = apiKey;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Helper to call MCP tools via HTTP POST from the server
    const callMcp = async (tool: string, args: any) => {
      const res = await fetch(`${apiUrl}/user-data/tools/call`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool, arguments: args })
      });
      const data = await res.json();
      if (data && data.result && data.result.content) {
        const parsed = JSON.parse(data.result.content[0].text);
        return parsed.data || parsed.rows || parsed;
      }
      return null;
    };

    const [students, countData, logData, settingsData] = await Promise.all([
      callMcp('user_data_query', { tableName: 'students' }),
      callMcp('user_data_execute_sql', { sql: `SELECT COUNT(*) as count FROM attendance_logs WHERE timestamp LIKE '${todayStr}%' AND type = 'IN'` }),
      callMcp('user_data_execute_sql', { sql: `SELECT student_id, timestamp, type FROM attendance_logs WHERE timestamp LIKE '${todayStr}%' ORDER BY timestamp DESC LIMIT 5` }),
      callMcp('user_data_query', { tableName: 'tkd_system_settings' }).catch(() => null)
    ]);

    return NextResponse.json({
      students: students || [],
      count: countData?.[0]?.count || 0,
      logs: logData || [],
      settings: settingsData || []
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}

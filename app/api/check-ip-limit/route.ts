import { NextRequest, NextResponse } from 'next/server';

// In-memory store (Vercel serverless için yeterli, günlük sıfırlanır)
const ipRegistry = new Map<string, { count: number; date: string }>();

function getToday(): string {
  return new Date().toISOString().split('T')[0]; // "2026-05-02"
}

export async function POST(req: NextRequest) {
  try {
    // IP adresini al
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

    const today = getToday();
    const record = ipRegistry.get(ip);

    if (record && record.date === today) {
      if (record.count >= 2) {
        return NextResponse.json(
          { allowed: false, error: 'Günlük kayıt limitine ulaştınız. Yarın tekrar deneyin.' },
          { status: 429 }
        );
      }
      ipRegistry.set(ip, { count: record.count + 1, date: today });
    } else {
      ipRegistry.set(ip, { count: 1, date: today });
    }

    return NextResponse.json({ allowed: true });
  } catch {
    return NextResponse.json({ allowed: true }); // Hata durumunda geçir
  }
}

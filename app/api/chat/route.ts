export async function POST(req: Request) {
  const { message } = await req.json();

  // ponytail: hardcoded stub — swap for real backend when ready
  const response = `وعليكم السلام ورحمة الله وبركاته. لقد استلمت سؤالك: "${message}". سيتم ربط النظام الحقيقي قريباً.`;

  return Response.json({ response });
}

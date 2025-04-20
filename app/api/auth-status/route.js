import { cookies } from "next/headers";

export async function GET() {


  const cCookie = await cookies()
  const hasCookie = cCookie.has("imgenh"); 
  
  return Response.json({ isAuthenticated: hasCookie });
}

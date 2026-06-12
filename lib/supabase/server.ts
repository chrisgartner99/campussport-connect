import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase-Client für Server-Komponenten, Server Actions und
 * Route Handler. Pro Request neu erstellen, nicht cachen.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll aus einer Server-Komponente aufgerufen – Cookies
            // können dort nicht geschrieben werden. Unkritisch, solange
            // die Session in Middleware/Route Handlern erneuert wird.
          }
        },
      },
    }
  );
}

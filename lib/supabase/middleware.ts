import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Routen, die nur mit Login erreichbar sind. */
const PROTECTED_PATHS = [
  "/meine-treffen",
  "/freunde",
  "/chat",
  "/treffen/neu",
  "/onboarding",
];

/** Routen, die eingeloggte Nutzer nicht mehr brauchen. */
const AUTH_PATHS = ["/login", "/registrieren"];

/**
 * Erneuert die Supabase-Session (Token-Refresh über Cookies) und setzt
 * die Routen-Schutzregeln um. Muss in middleware.ts aufgerufen werden.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Wichtig: zwischen createServerClient und getUser keinen weiteren
  // Code ausführen, sonst kann der Token-Refresh fehlschlagen.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  // Aktualisierte Auth-Cookies auch bei Redirects mitgeben.
  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => response.cookies.set(cookie));
    return response;
  };

  if (!user && isProtected) {
    return redirectTo("/login");
  }

  if (user && AUTH_PATHS.includes(path)) {
    return redirectTo("/treffen");
  }

  // Eingeloggt, aber noch kein Profil angelegt → erst Onboarding.
  if (user && isProtected && path !== "/onboarding") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) {
      return redirectTo("/onboarding");
    }
  }

  return supabaseResponse;
}

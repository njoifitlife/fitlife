import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PAID_PREFIXES = [
  "/workouts",
  "/nutrition",
  "/progress",
  "/community",
  "/challenges",
  "/bone-health",
];

const APP_PREFIXES = [
  "/dashboard",
  "/assessment",
  "/safety-acknowledgment",
  "/settings",
  "/admin",
  "/pricing",
  ...PAID_PREFIXES,
];

function matchesPrefix(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/forgot-password") || path.startsWith("/reset-password");
  const isAppRoute = matchesPrefix(path, APP_PREFIXES);
  const isPaidRoute = matchesPrefix(path, PAID_PREFIXES);

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && isPaidRoute) {
    const { data } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .limit(1)
      .single();

    if (!data) {
      const url = request.nextUrl.clone();
      url.pathname = "/pricing";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

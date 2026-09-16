"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
// import { apiKeyPlugin } from "@/lib/auth/api-key-plugin";
import { adminPlugin } from "@/lib/auth/admin-plugin";
// import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin";
// import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin";
// import { multiSessionPlugin } from "@/lib/auth/multi-session-plugin";
// import { organizationPlugin } from "@/lib/auth/organization-plugin";
// import { passkeyPlugin } from "@/lib/auth/passkey-plugin";
// import { themePlugin } from "@/lib/auth/theme-plugin";
// import { usernamePlugin } from "@/lib/auth/username-plugin";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        emailAndPassword={{ requireEmailVerification: false }}
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        plugins={
          [
            adminPlugin(),
            // usernamePlugin({
            // usernamePrefix: "@",
            // localization: { usernamePlaceholder: "username" },
            // }),
            // magicLinkPlugin(),
            // passkeyPlugin(),
            // apiKeyPlugin({ organization: true }),
            // themePlugin({ useTheme }),
            // multiSessionPlugin(),
            // deleteUserPlugin(),
            // organizationPlugin({
            // slugPrefix: "@",
            // slug,
            // }),
          ]
        }
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

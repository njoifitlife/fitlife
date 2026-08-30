"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Settings className="h-7 w-7" />
          </div>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Manage your account, subscription, and preferences.
          </p>
          <form action={signOut}>
            <Button variant="outline" className="w-full" type="submit">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  createFileRoute,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  Leaf,
  LockKeyholeIcon,
  SettingsIcon,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import z from "zod";

const settingSearchSchema = z.object({
  page: z.string().optional(),
  back: z.string().optional(),
});

export const Route = createFileRoute("/(misc)/setting/")({
  component: SettingPage,
  validateSearch: (search) => settingSearchSchema.parse(search),
});

const menuItems = [
  {
    id: "general",
    label: "General",
    icon: SettingsIcon,
  },
  {
    id: "personalization",
    label: "Personalization",
    icon: Leaf,
  },
  {
    id: "security",
    label: "Security",
    icon: LockKeyholeIcon,
  },
  {
    id: "account",
    label: "Account",
    icon: UserCircle,
  },
];

function isSafePath(path: string | undefined): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

function SettingPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const { back, page: active } = useSearch({ from: "/(misc)/setting/" });

  function handleBack() {
    if (isSafePath(back)) {
      router.history.push(back);
    } else {
      router.history.back();
    }
  }

  return (
    <div className="flex items-center justify-center h-dvh w-full bg-muted/40 p-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2 border-b">
          <Button size="icon-lg" variant="ghost" onClick={handleBack}>
            <ArrowLeftIcon />
          </Button>

          <CardTitle className="text-lg font-semibold">Settings</CardTitle>
        </CardHeader>

        <div className="flex min-h-[420px]">
          <div className="w-60 border-r bg-muted/20 p-2 flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() =>
                    navigate({ to: ".", search: { page: item.id, back } })
                  }
                  className={cn(
                    "justify-start gap-2 font-medium",
                    isActive && "bg-muted",
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex-1 py-4 px-6">
            <CardContent className="p-0">
              {active === "general" && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">General</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your general application settings.
                  </p>
                </div>
              )}

              {active === "personalization" && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Personalization</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize theme and appearance.
                  </p>
                </div>
              )}

              {active === "security" && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your password and authentication settings.
                  </p>
                </div>
              )}

              {active === "account" && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Account</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account information.
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

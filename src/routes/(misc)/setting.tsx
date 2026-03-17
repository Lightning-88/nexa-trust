import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  createFileRoute,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  Leaf,
  LockKeyholeIcon,
  SettingsIcon,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import z from 'zod'

const settingSearchSchema = z.object({
  page: z.string().optional(),
  back: z.string().optional(),
})

export const Route = createFileRoute('/(misc)/setting')({
  component: SettingPage,
  validateSearch: (search) => settingSearchSchema.parse(search),
})

const menuItems = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'personalization', label: 'Personalization', icon: Leaf },
  { id: 'security', label: 'Security', icon: LockKeyholeIcon },
  { id: 'account', label: 'Account', icon: UserCircle },
]

function isSafePath(path: string | undefined): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//')
}

function SettingPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const { back, page: active } = useSearch({ from: '/(misc)/setting' })

  function handleBack() {
    if (isSafePath(back)) {
      router.history.push(back)
    } else {
      router.history.back()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-dvh w-full bg-muted/40 p-4 md:p-8">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl gap-0 py-0 overflow-hidden">
        <div className="flex flex-row items-center gap-2 p-2 border-b">
          <Button size="icon-lg" variant="ghost" onClick={handleBack}>
            <ArrowLeftIcon />
          </Button>

          <CardTitle className="text-lg font-semibold">Settings</CardTitle>
        </div>

        <div className="flex flex-col md:flex-row min-h-[420px]">
          <div className="border-b md:border-b-0 md:border-r bg-muted/20 md:w-60">
            <div className="flex overflow-x-auto p-2 gap-1 md:hidden">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = active === item.id

                return (
                  <Button
                    key={item.id}
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      navigate({ to: '.', search: { page: item.id, back } })
                    }
                    className={cn(
                      'flex items-center gap-2 whitespace-nowrap',
                      isActive && 'bg-muted',
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Button>
                )
              })}
            </div>

            <div className="hidden md:flex flex-col p-2 gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = active === item.id

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() =>
                      navigate({ to: '.', search: { page: item.id, back } })
                    }
                    className={cn(
                      'justify-start gap-2 font-medium',
                      isActive && 'bg-muted',
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 py-4 px-4">
            <CardContent className="p-0">
              {active === 'general' && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">General</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your general application settings.
                  </p>
                </div>
              )}

              {active === 'personalization' && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Personalization</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize theme and appearance.
                  </p>
                </div>
              )}

              {active === 'security' && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your password and authentication settings.
                  </p>
                </div>
              )}

              {active === 'account' && (
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
  )
}

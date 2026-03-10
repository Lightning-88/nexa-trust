import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Plus, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { NavUser } from "./nav-user";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getChatsServer } from "@/feature/chat/functions";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
}) {
  const getChats = useServerFn(getChatsServer);

  const { data: chats, isPending } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b h-16 justify-center">
        <Button asChild>
          <Link to="/dashboard">
            <Plus size={16} />
            New Chat
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <p className="px-2 py-1 text-xs text-muted-foreground">
            Recent Chats
          </p>

          <SidebarMenu>
            {isPending ? (
              <SidebarMenuItem>
                <SidebarMenuButton>Loading...</SidebarMenuButton>
              </SidebarMenuItem>
            ) : !chats || chats.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton>
                  {"You don't have any chats"}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link to="/c/$chatId" params={{ chatId: chat.id }}>
                      <MessageSquare size={16} />
                      <span>{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-3 py-2 sticky bottom-0">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

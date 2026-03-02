"use client";

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
import Link from "next/link";
import { useEffect, useState } from "react";

type ChatData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string | null;
};

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
  const [chats, setChats] = useState<ChatData[]>([]);

  useEffect(() => {
    const getListChats = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/chat`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const { data } = await response.json();
      setChats(data.chat);
    };

    getListChats();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b h-16 justify-center">
        <Button asChild>
          <Link href="/dashboard">
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
            {!chats || chats.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton>
                  {"You don't have any chats"}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/c/${chat.id}`}>
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

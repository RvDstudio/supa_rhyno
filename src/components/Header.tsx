import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();

  console.log(user)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-8">
  
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <div className="">
          <ThemeToggle />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          {user ? (
            <Link href="/account">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url || "/images/placeholder.svg"} alt="User Avatar" />
                <AvatarFallback>
                  <img src="/images/default.png" alt="Fallback Avatar" />
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

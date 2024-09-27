import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
            <path d="M22 21H7" />
            <path d="m5 11 9 9" />
          </svg>
          <span className="text-xl font-bold text-blue-600">RhynoStarter</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Insights</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Messages</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Scheduled</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Integrations</a></li>
          </ul>
        </nav>
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
            <Link href="/private">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt="User Avatar" />
                <AvatarFallback>
                  <img src="/images/fallback-image.png" alt="Fallback Avatar" />
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

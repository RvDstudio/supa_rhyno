"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Redirect or handle sign-out success
      router.push("/login"); // Redirect to login page or other destination
    } else {
      console.error("Error signing out:", error);
    }
  };

  const getProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user, getProfile]);
  // Function to handle avatar upload
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Update avatar_url in state and database
      setAvatarUrl(filePath);
      await updateProfile({ fullname, username, website, avatar_url: filePath });
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile({
    username,
    fullname,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    if (!user?.id) return;

    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#f7f7f7] dark:bg-[#171717] h-screen">
      <div className="bg-white dark:bg-[#252525] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e]">
        <div className="flex">
          <Card className="w-[42rem] bg-transparent p-0 space-y-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">


                {avatarUrl && (
                  <Image
                    src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data?.publicUrl || "/images/default.png"}
                    alt="Avatar"
                    width={100}
                    height={100}
                  />
                )}
                <label htmlFor="avatar">Avatar</label>
                <input
                  className="bg-[#171717]"
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />

              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value="" disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fullname" className="mr-4 ">Full Name</Label>
                <input
                  className="px-4 py-1 rounded items-center"
                  id="fullName"
                  type="text"
                  value={fullname || ''}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username" className="mr-4  ">Username</Label>
                <input
                  className="px-4 py-1 rounded items-center"
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="mr-4 ">Website</Label>
                <input
                  className="px-4 py-1 rounded items-center"
                  id="website"
                  type="url"
                  value={website || ''}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() =>
                updateProfile({ fullname, username, website, avatar_url: avatarUrl })
              } disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign out
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6 flex-1">
            <Card className="bg-transparent p-0 space-y-0 w-full">
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-2">
                    <Badge variant="secondary">New Post</Badge>
                    <span>You published a new blog post</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge variant="secondary">Comment</Badge>
                    <span>You received a new comment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge variant="secondary">Like</Badge>
                    <span>Your post received 10 likes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-transparent p-0 space-y-0 w-full">
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt>Posts</dt>
                    <dd className="font-semibold">23</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Followers</dt>
                    <dd className="font-semibold">1,234</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Following</dt>
                    <dd className="font-semibold">567</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

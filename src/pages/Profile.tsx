import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/constants/categories';
import {
  Plus, Edit2, Trash2, LogOut, Camera, BookOpen,
  Heart, Calendar, Tag, Pencil, X, Check,
} from 'lucide-react';

interface Caption {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  user_id: string;
  created_at: string;
}

const Profile = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [captionDialogOpen, setCaptionDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [newCaption, setNewCaption] = useState({ title: '', content: '', category: '' });
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { user, userProfile, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('[Profile] render — user:', user?.email ?? 'none', 'userProfile:', userProfile, 'captions:', captions.length);

  useEffect(() => {
    document.title = 'My Profile — CaptionCrafter';
  }, []);

  useEffect(() => {
    console.log('[Profile] user effect — user:', user?.id ?? 'none');
    if (!user) {
      console.log('[Profile] no user — redirecting to home');
      toast({ title: 'Sign in required', description: 'Please sign in to view your profile.' });
      navigate('/', { replace: true });
      return;
    }
    fetchUserCaptions();
  }, [user, navigate]);

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.display_name || userProfile.name || '');
    }
  }, [userProfile]);

  const fetchUserCaptions = async () => {
    if (!user) return;
    console.log('[Profile] fetchUserCaptions — userId:', user.id);

    const { data, error } = await supabase
      .from('captions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    console.log('[Profile] captions fetch result — count:', data?.length ?? 0, 'error:', error);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    const rows = data || [];
    setCaptions(rows);

    if (rows.length > 0) {
      const ids = rows.map((c) => c.id);
      const { count } = await supabase
        .from('likes')
        .select('id', { count: 'exact', head: true })
        .in('caption_id', ids);
      setTotalLikes(count ?? 0);
    } else {
      setTotalLikes(0);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    const { error } = await supabase.storage.from('captions').upload(path, file, { upsert: true });
    if (error) {
      toast({ title: 'Upload Error', description: error.message, variant: 'destructive' });
      return null;
    }
    const { data } = supabase.storage.from('captions').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      let avatarUrl = userProfile?.avatar_url ?? null;

      if (editAvatarFile) {
        const ext = editAvatarFile.name.split('.').pop();
        const url = await uploadFile(editAvatarFile, `avatars/${user.id}.${ext}`);
        if (!url) { setProfileLoading(false); return; }
        avatarUrl = url;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ display_name: editName.trim(), avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshUser();
      setEditProfileOpen(false);
      setEditAvatarFile(null);
      setEditAvatarPreview(null);
      toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatarFile(file);
    setEditAvatarPreview(URL.createObjectURL(file));
  };

  const handleCaptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCaptionLoading(true);

    let imageUrl: string | null = editingCaption?.image_url || null;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const url = await uploadFile(imageFile, `${user.id}-${Date.now()}.${ext}`);
      if (!url) { setCaptionLoading(false); return; }
      imageUrl = url;
    }

    const payload = {
      title: newCaption.title,
      content: newCaption.content,
      category: newCaption.category || null,
      image_url: imageUrl,
      user_id: user.id,
    };

    const { error } = editingCaption
      ? await supabase.from('captions').update(payload).eq('id', editingCaption.id)
      : await supabase.from('captions').insert(payload);

    setCaptionLoading(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }

    toast({ title: 'Success', description: editingCaption ? 'Caption updated.' : 'Caption created.' });
    setCaptionDialogOpen(false);
    setNewCaption({ title: '', content: '', category: '' });
    setEditingCaption(null);
    setImageFile(null);
    fetchUserCaptions();
  };

  const handleEditCaption = (caption: Caption) => {
    setEditingCaption(caption);
    setNewCaption({ title: caption.title, content: caption.content, category: caption.category || '' });
    setCaptionDialogOpen(true);
  };

  const handleDeleteCaption = async (id: string) => {
    const { error } = await supabase.from('captions').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Deleted', description: 'Caption removed.' });
    fetchUserCaptions();
  };

  if (!user) return null;

  const displayName = userProfile?.display_name || userProfile?.name || user.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-16">
        <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500" />

        {/* Profile card overlapping banner */}
        <div className="container mx-auto max-w-4xl px-4">
          <div className="relative -mt-20 bg-card rounded-2xl shadow-xl border border-border p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">

              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
                  <AvatarImage src={userProfile?.avatar_url ?? undefined} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name + email + stats */}
              <div className="flex-1 text-center sm:text-left pb-1">
                <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                <p className="text-muted-foreground text-sm">{user.email}</p>

                <div className="flex gap-6 mt-3 justify-center sm:justify-start">
                  <div className="flex items-center gap-1.5 text-sm">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">{captions.length}</span>
                    <span className="text-muted-foreground">Captions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="font-semibold">{totalLikes}</span>
                    <span className="text-muted-foreground">Likes</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => setEditProfileOpen(true)}>
                  <Pencil className="h-4 w-4 mr-1.5" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Captions section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-foreground">My Captions</h2>
              <Button
                size="sm"
                onClick={() => {
                  setEditingCaption(null);
                  setNewCaption({ title: '', content: '', category: '' });
                  setImageFile(null);
                  setCaptionDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Upload Caption
              </Button>
            </div>

            {captions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No captions yet</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Start sharing your creativity with the world.
                </p>
                <Button size="sm" onClick={() => setCaptionDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Upload your first caption
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {captions.map((caption) => (
                  <Card key={caption.id} className="group relative overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {caption.image_url && (
                      <div className="h-36 overflow-hidden">
                        <img src={caption.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground leading-tight line-clamp-1">{caption.title}</h3>
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEditCaption(caption)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete caption?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{caption.title}" will be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDeleteCaption(caption.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {caption.category && (
                        <div className="flex items-center gap-1 mb-2">
                          <Tag className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {caption.category}
                          </span>
                        </div>
                      )}

                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{caption.content}</p>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                        <Calendar className="h-3 w-3" />
                        {new Date(caption.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Avatar picker */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-2 ring-border">
                  <AvatarImage src={editAvatarPreview ?? userProfile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>
              {editAvatarFile && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  {editAvatarFile.name}
                  <button onClick={() => { setEditAvatarFile(null); setEditAvatarPreview(null); }}>
                    <X className="h-3 w-3 text-muted-foreground ml-1" />
                  </button>
                </p>
              )}
              <p className="text-xs text-muted-foreground">Click the camera icon to change your photo</p>
            </div>

            {/* Display name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Display Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your display name"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user.email ?? ''} disabled className="opacity-60" />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveProfile} disabled={profileLoading}>
                {profileLoading ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload / Edit Caption Dialog */}
      <Dialog open={captionDialogOpen} onOpenChange={setCaptionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCaption ? 'Edit Caption' : 'Upload New Caption'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCaptionSubmit} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="caption-title">Title</Label>
              <Input
                id="caption-title"
                value={newCaption.title}
                onChange={(e) => setNewCaption({ ...newCaption, title: e.target.value })}
                placeholder="Give it a title"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="caption-content">Caption Text</Label>
              <Textarea
                id="caption-content"
                value={newCaption.content}
                onChange={(e) => setNewCaption({ ...newCaption, content: e.target.value })}
                placeholder="Write your caption…"
                required
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={newCaption.category}
                onValueChange={(value) => setNewCaption({ ...newCaption, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="caption-image">Background Image (optional)</Label>
              <Input
                id="caption-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setCaptionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={captionLoading}>
                {captionLoading ? 'Saving…' : editingCaption ? 'Update Caption' : 'Upload Caption'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

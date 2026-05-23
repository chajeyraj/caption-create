import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/constants/categories';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Caption {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  user_id: string;
  created_at: string;
  profiles?: {
    display_name: string;
    email: string;
  };
}

interface Profile {
  id: string;
  display_name: string;
  email: string;
  user_id: string;
}

const Admin = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [newCaption, setNewCaption] = useState({ title: '', content: '', category: '' });
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Admin — CaptionCrafter';
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast({
        title: 'Access Denied',
        description: "You don't have admin privileges.",
        variant: 'destructive',
      });
      return;
    }

    fetchData();
  }, [user, isAdmin, navigate, toast]);

  const fetchData = async () => {
    const [{ data: captionsData }, { data: profilesData }] = await Promise.all([
      supabase.from('captions').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('display_name'),
    ]);

    const profilesMap = new Map<string, Profile>();
    profilesData?.forEach((p) => profilesMap.set(p.user_id, p));

    const captionsWithProfiles = captionsData?.map((caption) => {
      const profile = profilesMap.get(caption.user_id);
      return {
        ...caption,
        profiles: profile
          ? { display_name: profile.display_name || profile.email, email: profile.email }
          : undefined,
      };
    });

    setCaptions(captionsWithProfiles || []);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('captions')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      return null;
    }

    const { data } = supabase.storage.from('captions').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    let imageUrl = editingCaption?.image_url || '';
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) {
        setLoading(false);
        return;
      }
      imageUrl = uploaded;
    }

    const captionData = {
      title: newCaption.title,
      content: newCaption.content,
      category: newCaption.category || null,
      image_url: imageUrl || null,
      user_id: user.id,
    };

    let success = false;

    if (editingCaption) {
      const { error } = await supabase
        .from('captions')
        .update(captionData)
        .eq('id', editingCaption.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Caption updated successfully.' });
        success = true;
      }
    } else {
      const { error } = await supabase.from('captions').insert(captionData);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Caption created successfully.' });
        success = true;
      }
    }

    setLoading(false);

    if (success) {
      setDialogOpen(false);
      setNewCaption({ title: '', content: '', category: '' });
      setEditingCaption(null);
      setImageFile(null);
      fetchData();
    }
  };

  const handleEdit = (caption: Caption) => {
    setEditingCaption(caption);
    setNewCaption({
      title: caption.title,
      content: caption.content,
      category: caption.category || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('captions').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Caption deleted successfully.' });
      fetchData();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCaption(null);
                    setNewCaption({ title: '', content: '', category: '' });
                    setImageFile(null);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Caption
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingCaption ? 'Edit Caption' : 'Upload New Caption'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newCaption.title}
                      onChange={(e) => setNewCaption({ ...newCaption, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Caption Text</Label>
                    <Textarea
                      id="content"
                      value={newCaption.content}
                      onChange={(e) => setNewCaption({ ...newCaption, content: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newCaption.category}
                      onValueChange={(value) => setNewCaption({ ...newCaption, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Saving...' : editingCaption ? 'Update Caption' : 'Upload Caption'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Captions Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {captions.map((caption) => (
                    <TableRow key={caption.id}>
                      <TableCell className="font-medium">{caption.title}</TableCell>
                      <TableCell>
                        {caption.profiles?.display_name || caption.profiles?.email}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{caption.content}</TableCell>
                      <TableCell>
                        {caption.category ? (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {caption.category}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(caption.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(caption)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete caption?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{caption.title}". This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(caption.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

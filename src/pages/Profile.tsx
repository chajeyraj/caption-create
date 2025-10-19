import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Upload, LogOut } from 'lucide-react';

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
  const [newCaption, setNewCaption] = useState({ title: '', content: '', category: '' });
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ['Motivational', 'Success', 'Inspiration', 'Love', 'Friendship', 'Funny', 'Wisdom', 'Life', 'தமிழ்', 'සිංහල', '中文', 'हिन्दी'];

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchUserCaptions();
  }, [user, navigate]);

  const fetchUserCaptions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('captions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setCaptions(data || []);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('captions')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload Error",
        description: uploadError.message,
        variant: "destructive"
      });
      return null;
    }

    const { data } = supabase.storage
      .from('captions')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    let imageUrl = editingCaption?.image_url || '';
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }

    const captionData = {
      title: newCaption.title,
      content: newCaption.content,
      category: newCaption.category || null,
      image_url: imageUrl || null,
      user_id: user.id
    };

    if (editingCaption) {
      const { error } = await supabase
        .from('captions')
        .update(captionData)
        .eq('id', editingCaption.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Caption updated successfully."
        });
      }
    } else {
      const { error } = await supabase
        .from('captions')
        .insert(captionData);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Caption created successfully."
        });
      }
    }

    setLoading(false);
    setDialogOpen(false);
    setNewCaption({ title: '', content: '', category: '' });
    setEditingCaption(null);
    setImageFile(null);
    fetchUserCaptions();
  };

  const handleEdit = (caption: Caption) => {
    setEditingCaption(caption);
    setNewCaption({
      title: caption.title,
      content: caption.content,
      category: caption.category || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('captions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Caption deleted successfully."
      });
      fetchUserCaptions();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {userProfile?.name || user?.email?.split('@')[0] || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" onClick={() => {
                    setEditingCaption(null);
                    setNewCaption({ title: '', content: '', category: '' });
                    setImageFile(null);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Caption
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCaption ? 'Edit Caption' : 'Upload New Caption'}
                    </DialogTitle>
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
                      <Select value={newCaption.category} onValueChange={(value) => setNewCaption({ ...newCaption, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
          </div>

          {/* User's Captions */}
          <Card>
            <CardHeader>
              <CardTitle>My Captions ({captions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {captions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't uploaded any captions yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click the "Upload Caption" button to get started!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {captions.map((caption) => (
                    <div key={caption.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{caption.title}</h3>
                          {caption.category && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {caption.category}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(caption)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(caption.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {caption.content}
                      </p>
                      {caption.image_url && (
                        <img 
                          src={caption.image_url} 
                          alt="Caption background" 
                          className="w-full h-32 object-cover rounded mt-2"
                        />
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(caption.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Logout Button */}
          <div className="mt-8 flex justify-center">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              aria-label="Logout"
              className="w-full sm:w-auto mb-2.5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
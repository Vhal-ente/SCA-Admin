import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PostModal, Post } from "@/components/modals/PostModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const News = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "New Tournament Season Announced",
      content: "We're excited to announce the start of Season 5! Register now to compete for amazing prizes.",
      category: "announcement",
      author: "Admin",
      date: "2024-03-15",
      status: "published",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      title: "CODM Championship Results",
      content: "Team Alpha wins the CODM Championship with an incredible performance in the finals!",
      category: "result",
      author: "Tournament Admin",
      date: "2024-03-10",
      status: "published",
    },
    {
      id: 3,
      title: "Platform Update v2.0",
      content: "New features including improved matchmaking, team management, and more!",
      category: "update",
      author: "Dev Team",
      date: "2024-03-05",
      status: "draft",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleAddPost = () => {
    setSelectedPost(null);
    setModalOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleSavePost = (postData: Omit<Post, "id" | "date"> & { id?: number }) => {
    if (postData.id) {
      setPosts(posts.map((p) => (p.id === postData.id ? { ...p, ...postData } as Post : p)));
      toast({ title: "Post Updated", description: "Post has been updated successfully." });
    } else {
      const newPost: Post = {
        ...postData,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
      };
      setPosts([newPost, ...posts]);
      toast({ title: "Post Created", description: "New post has been created successfully." });
    }
  };

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      toast({ title: "Post Deleted", description: "Post has been removed successfully." });
      setDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "announcement":
        return "bg-primary/20 text-primary border-primary/50";
      case "tournament":
        return "bg-accent/20 text-accent border-accent/50";
      case "update":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "result":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "feature":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">News & Updates</h1>
          <p className="text-sm md:text-base text-muted-foreground">Publish announcements and tournament results</p>
        </div>
        <Button 
          onClick={handleAddPost}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="p-8 bg-gradient-card border-border text-center">
          <p className="text-muted-foreground">No posts yet. Create your first post!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="bg-gradient-card border-border hover:border-primary transition-all duration-300 overflow-hidden flex flex-col"
            >
              {post.image && (
                <div className="h-40 md:h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  <Badge 
                    variant={post.status === "published" ? "default" : "outline"}
                    className={post.status === "published" 
                      ? "bg-green-500/20 text-green-500 border-green-500/50" 
                      : ""
                    }
                  >
                    {post.status}
                  </Badge>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditPost(post)}
                    className="flex-1 gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeletePost(post)}
                    className="text-destructive hover:text-destructive gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <PostModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        post={selectedPost}
        onSave={handleSavePost}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default News;

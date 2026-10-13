import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Eye, Plus, Star, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PostModal, type Post, type PostCategory } from "@/components/modals/PostModal";
import { api, type ApiArticle } from "@/lib/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// The API keeps paragraphs as a list and dates as UTC timestamps; the form
// edits plain text and a local date.
const toPost = (article: ApiArticle): Post => ({
  id: article.id, title: article.title, excerpt: article.excerpt, content: article.content.join("\n\n"),
  category: article.category, author: article.authorName, status: article.status,
  date: article.publishedAt ? localDay(article.publishedAt) : new Date().toISOString().slice(0, 10),
  image: article.imageUrl, featured: article.featured,
});

const localDay = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const toPayload = (post: Omit<Post, "id">) => ({
  title: post.title, excerpt: post.excerpt, category: post.category, authorName: post.author,
  content: post.content.split(/\n\s*\n/), imageUrl: post.image || "", featured: Boolean(post.featured),
  status: post.status, publishedAt: post.date ? new Date(`${post.date}T09:00:00`).toISOString() : "",
});

const categories: { value: "all" | PostCategory; label: string }[] = [
  { value: "all", label: "All" }, { value: "tournament", label: "Tournaments" }, { value: "league", label: "Leagues" },
  { value: "partnership", label: "Partnerships" }, { value: "community", label: "Community" },
  { value: "announcement", label: "Announcements" }, { value: "esports", label: "Esports" },
];

const prettyDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));

export default function News() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<"all" | PostCategory>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const load = useCallback(async () => {
    try {
      const { articles } = await api.get<{ articles: ApiArticle[] }>("/admin/news");
      setPosts(articles.map(toPost));
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const featuredPosts = useMemo(() => posts.filter((post) => post.featured), [posts]);
  const visiblePosts = useMemo(() => posts.filter((post) => !post.featured && (filter === "all" || post.category === filter)), [filter, posts]);

  const openCreate = () => { setSelectedPost(null); setModalOpen(true); };
  const openEdit = (post: Post) => { setSelectedPost(post); setModalOpen(true); };

  const savePost = async ({ id, ...data }: Omit<Post, "id"> & { id?: string }) => {
    try {
      if (id) await api.patch(`/admin/news/${id}`, toPayload(data));
      else await api.post("/admin/news", toPayload(data));
      const scheduled = data.status === "published" && new Date(`${data.date}T09:00:00`) > new Date();
      toast({ title: data.status !== "published" ? "Draft saved" : scheduled ? "Post scheduled" : "Post published", description: data.title });
      await load();
      return true;
    } catch (error) {
      toast({ title: "Could not save post", description: (error as Error).message, variant: "destructive" });
      return false;
    }
  };

  const deletePost = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/admin/news/${postToDelete.id}`);
      toast({ title: "Post deleted", description: `${postToDelete.title} was removed.` });
      await load();
    } catch (error) {
      toast({ title: "Could not delete post", description: (error as Error).message, variant: "destructive" });
    } finally {
      setPostToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="sca-eyebrow mb-3">SCA Journal</p><h1 className="text-4xl font-semibold tracking-tight md:text-5xl">News &amp; Updates</h1><p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">Manage the featured story and publish tournament, league, partnership, announcement, and community updates.</p></div>
          <button onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"><Plus className="h-5 w-5" /> Create post</button>
        </header>

        {loading && <p className="py-10 text-sm text-muted-foreground">Loading posts…</p>}
        {loadError && <div className="mt-8 border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">{loadError} <button onClick={() => { setLoading(true); load(); }} className="ml-3 underline">Try again</button></div>}

        {featuredPosts.length > 0 && (
          <section className="py-8">
            <div className="mb-4 flex items-center justify-between"><div><p className="sca-eyebrow">Featured news</p><p className="mt-1 text-xs text-muted-foreground">Highlighted stories displayed at the top of the public news page.</p></div><span className="border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">{featuredPosts.length} featured</span></div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredPosts.map((featured) => (
                <article key={featured.id} className="group flex min-h-[460px] flex-col overflow-hidden border border-primary/35 bg-card transition-colors hover:border-primary">
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">{featured.image ? <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center text-muted-foreground">No featured image</div>}</div>
                  <div className="flex flex-1 flex-col p-6"><div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{featured.category}</span><span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"><Star className="h-3.5 w-3.5 fill-primary" /> Featured</span><span className={`ml-auto border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${featured.status === "published" ? "border-emerald-500/30 text-emerald-500" : "border-amber-500/30 text-amber-500"}`}>{featured.status}</span></div><h2 className="mt-5 text-xl font-semibold leading-snug tracking-tight">{featured.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{featured.excerpt}</p><div className="mt-auto border-t border-border pt-5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" />{prettyDate(featured.date)} · {featured.author}</div><div className="mt-5 flex gap-2"><button onClick={() => openEdit(featured)} className="flex h-10 flex-1 items-center justify-center gap-2 border border-border text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary"><Edit3 className="h-4 w-4" /> Edit</button><button aria-label={`Delete ${featured.title}`} onClick={() => setPostToDelete(featured)} className="h-10 border border-destructive/30 px-3 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button></div></div></div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-border py-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="sca-eyebrow mb-2">From the arena</p><h2 className="text-3xl font-semibold tracking-tight">Latest news</h2></div><div className="flex max-w-full gap-2 overflow-x-auto pb-1">{categories.map((category) => <button key={category.value} onClick={() => setFilter(category.value)} className={`min-w-fit border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider ${filter === category.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>{category.label}</button>)}</div></div>

          {visiblePosts.length ? <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visiblePosts.map((post) => (
            <article key={post.id} className="group flex min-h-[460px] flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary/45">
              <div className="aspect-[16/9] overflow-hidden bg-secondary">{post.image ? <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No article image</div>}</div>
              <div className="flex flex-1 flex-col p-6"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{post.category}</span><span className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${post.status === "published" ? "border-emerald-500/30 text-emerald-500" : "border-amber-500/30 text-amber-500"}`}>{post.status}</span></div><h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p><div className="mt-auto border-t border-border pt-5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" />{prettyDate(post.date)}</div><div className="mt-5 flex gap-2"><button onClick={() => openEdit(post)} className="flex h-10 flex-1 items-center justify-center gap-2 border border-border text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary"><Edit3 className="h-4 w-4" /> Edit</button><button aria-label={`Delete ${post.title}`} onClick={() => setPostToDelete(post)} className="h-10 border border-destructive/30 px-3 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button></div></div></div>
            </article>
          ))}</div> : <div className="mt-7 border border-dashed border-border bg-card py-16 text-center"><Eye className="mx-auto h-9 w-9 text-primary" /><h3 className="mt-4 text-lg font-semibold">No posts in this category</h3><p className="mt-2 text-sm text-muted-foreground">Choose another filter or create a new post.</p></div>}
        </section>
      </div>

      <PostModal open={modalOpen} onOpenChange={setModalOpen} post={selectedPost} onSave={savePost} />
      <AlertDialog open={Boolean(postToDelete)} onOpenChange={(open) => !open && setPostToDelete(null)}><AlertDialogContent className="rounded-sm border-border bg-card text-foreground"><AlertDialogHeader><AlertDialogTitle>Delete news post?</AlertDialogTitle><AlertDialogDescription>This permanently removes “{postToDelete?.title}” from the news workspace.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel><AlertDialogAction onClick={deletePost} className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete post</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

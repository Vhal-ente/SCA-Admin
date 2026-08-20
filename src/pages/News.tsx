import { useMemo, useState } from "react";
import { CalendarDays, Edit3, Eye, Plus, Star, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PostModal, type Post, type PostCategory } from "@/components/modals/PostModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const initialPosts: Post[] = [
  { id: 1, title: "SCA Announces the Next Path of Legends Tournament", excerpt: "Get ready for another round of competitive gaming as players battle for rankings, prizes, and a place among SCA’s top competitors.", content: "Registration is opening for the next Path of Legends tournament. Full competition details, eligibility, and the match calendar will be published shortly.", category: "tournament", author: "SCA Editorial", date: "2026-08-12", status: "published", featured: true, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&h=800&fit=crop" },
  { id: 2, title: "Academius Games Season One Is Now Live", excerpt: "A new league season gives rising teams a consistent stage to compete, improve, and earn recognition.", content: "Academius Games begins its first season with registered teams competing across a complete league calendar.", category: "league", author: "League Desk", date: "2026-08-08", status: "published", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=520&fit=crop" },
  { id: 3, title: "SCA and HyperX Expand Their Tournament Partnership", excerpt: "The partnership will support more community tournaments and stronger competitive experiences for SCA players.", content: "SCA and HyperX are expanding their collaboration across upcoming competitions and player programs.", category: "partnership", author: "Partnerships Team", date: "2026-08-02", status: "published", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=520&fit=crop" },
  { id: 4, title: "SCA Community Night Returns This Month", excerpt: "Join players, organizers, and creators for friendly matches, challenges, and community highlights.", content: "Community Night returns with open play sessions, creator matchups, and community awards.", category: "community", author: "Community Team", date: "2026-07-27", status: "published", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=520&fit=crop" },
  { id: 5, title: "An Update to SCA’s Fair Play Standards", excerpt: "Clearer competition standards help protect players and keep every SCA event fair and enjoyable.", content: "Our updated fair play standards clarify participant conduct, reporting, and match-review procedures.", category: "announcement", author: "SCA Operations", date: "2026-07-21", status: "draft", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=900&h=520&fit=crop" },
];

const categories: { value: "all" | PostCategory; label: string }[] = [
  { value: "all", label: "All" }, { value: "tournament", label: "Tournaments" }, { value: "league", label: "Leagues" },
  { value: "partnership", label: "Partnerships" }, { value: "community", label: "Community" },
  { value: "announcement", label: "Announcements" }, { value: "esports", label: "Esports" },
];

const prettyDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));

export default function News() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<"all" | PostCategory>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const featuredPosts = useMemo(() => posts.filter((post) => post.featured), [posts]);
  const visiblePosts = useMemo(() => posts.filter((post) => !post.featured && (filter === "all" || post.category === filter)), [filter, posts]);

  const openCreate = () => { setSelectedPost(null); setModalOpen(true); };
  const openEdit = (post: Post) => { setSelectedPost(post); setModalOpen(true); };

  const savePost = (data: Omit<Post, "id"> & { id?: number }) => {
    let savedTitle = data.title;
    setPosts((current) => {
      if (data.id) return current.map((post) => post.id === data.id ? { ...post, ...data, id: post.id } : post);
      return [{ ...data, id: Date.now() }, ...current];
    });
    toast({ title: data.status === "published" ? "Post published" : "Draft saved", description: `${savedTitle} is ready in the news workspace.` });
  };

  const deletePost = () => {
    if (!postToDelete) return;
    setPosts((current) => current.filter((post) => post.id !== postToDelete.id));
    toast({ title: "Post deleted", description: `${postToDelete.title} was removed.` });
    setPostToDelete(null);
  };

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="sca-eyebrow mb-3">SCA Journal</p><h1 className="text-4xl font-semibold tracking-tight md:text-5xl">News &amp; Updates</h1><p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">Manage the featured story and publish tournament, league, partnership, announcement, and community updates.</p></div>
          <button onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"><Plus className="h-5 w-5" /> Create post</button>
        </header>

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

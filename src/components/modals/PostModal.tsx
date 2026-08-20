import { useEffect, useState } from "react";
import { CalendarDays, ImageIcon, Star, Upload, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export type PostCategory = "tournament" | "league" | "partnership" | "community" | "announcement" | "esports";

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  author: string;
  date: string;
  status: "draft" | "published";
  image?: string;
  featured?: boolean;
}

interface PostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSave: (post: Omit<Post, "id"> & { id?: number }) => void;
}

const categories: { value: PostCategory; label: string }[] = [
  { value: "tournament", label: "Tournament" },
  { value: "league", label: "League" },
  { value: "partnership", label: "Partnership" },
  { value: "community", label: "Community" },
  { value: "announcement", label: "Announcement" },
  { value: "esports", label: "Esports" },
];

const fieldClass = "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

export function PostModal({ open, onOpenChange, post, onSave }: PostModalProps) {
  const [formData, setFormData] = useState<Omit<Post, "id">>({
    title: "", excerpt: "", content: "", category: "announcement", author: "", date: new Date().toISOString().slice(0, 10), status: "draft", image: "", featured: false,
  });

  useEffect(() => {
    setFormData(post ? {
      title: post.title, excerpt: post.excerpt || post.content, content: post.content,
      category: post.category, author: post.author, date: post.date, status: post.status,
      image: post.image || "", featured: Boolean(post.featured),
    } : {
      title: "", excerpt: "", content: "", category: "announcement", author: "",
      date: new Date().toISOString().slice(0, 10), status: "draft", image: "", featured: false,
    });
  }, [post, open]);

  const uploadImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((current) => ({ ...current, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = submitter?.value === "published" ? "published" : "draft";
    onSave({ ...(post ? { id: post.id } : {}), ...formData, status });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] max-w-4xl overflow-y-auto rounded-sm border-border bg-card p-0 text-foreground sm:max-w-4xl [&>button]:hidden">
        <header className="flex items-start justify-between border-b border-border p-6 md:p-8">
          <div>
            <p className="sca-eyebrow mb-2">SCA Journal</p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{post ? "Edit news post" : "Create news post"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Prepare the article card and content shown on the public News &amp; Updates page.</p>
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="border border-border p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </header>

        <form onSubmit={submit} className="space-y-7 p-6 md:p-8">
          <section className="grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Headline</span><input required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} placeholder="Enter the public article headline" className={fieldClass} /></label>
            <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</span><select value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value as PostCategory })} className={`${fieldClass} theme-native-select`}>{categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
            <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Author</span><input required value={formData.author} onChange={(event) => setFormData({ ...formData, author: event.target.value })} placeholder="Author or editorial team" className={fieldClass} /></label>
            <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Card summary</span><textarea required maxLength={220} value={formData.excerpt} onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })} placeholder="A short summary displayed on the featured story and latest-news cards." className={`${fieldClass} min-h-24 resize-y`} /><span className="mt-1 block text-right text-[10px] text-muted-foreground">{formData.excerpt.length}/220</span></label>
            <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Article content</span><textarea required value={formData.content} onChange={(event) => setFormData({ ...formData, content: event.target.value })} placeholder="Write the complete article body..." className={`${fieldClass} min-h-52 resize-y`} /></label>
          </section>

          <section className="border border-border bg-background p-5">
            <p className="sca-eyebrow mb-2">Featured media</p>
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              <div className="space-y-3">
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Image URL</span><input value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} placeholder="https://..." className={fieldClass} /></label>
                <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border px-4 py-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary"><Upload className="h-4 w-4" /> Upload image<input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadImage(event.target.files?.[0])} /></label>
                <p className="text-xs text-muted-foreground">Use a wide 16:9 image. Featured stories use a larger crop on the frontend.</p>
              </div>
              <div className="flex aspect-video items-center justify-center overflow-hidden border border-border bg-card">
                {formData.image ? <img src={formData.image} alt="Article preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-9 w-9 text-muted-foreground" />}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Publish date</span><span className="relative block"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input type="date" required value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} className={`${fieldClass} pl-11`} /></span></label>
            <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Publication status</span><select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value as Post["status"] })} className={`${fieldClass} theme-native-select`}><option value="draft">Draft</option><option value="published">Published</option></select></label>
            <button type="button" role="switch" aria-checked={formData.featured} onClick={() => setFormData({ ...formData, featured: !formData.featured })} className={`mt-6 flex min-h-12 items-center gap-3 border px-4 text-left ${formData.featured ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"}`}><Star className={`h-5 w-5 ${formData.featured ? "fill-current" : ""}`} /><span><span className="block text-sm font-semibold">Featured story</span><span className="block text-[10px]">Highlight in the featured news section</span></span></button>
          </section>

          <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => onOpenChange(false)} className="h-12 border border-border px-6 text-sm font-bold text-muted-foreground hover:text-foreground">Cancel</button>
            <button type="submit" value="draft" className="h-12 border border-primary/40 px-6 text-sm font-bold text-primary hover:bg-primary/10">Save as draft</button>
            <button type="submit" value="published" className="h-12 bg-primary px-7 text-sm font-bold text-primary-foreground hover:bg-primary/90">Publish post</button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

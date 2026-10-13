import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SAVE_DELAY_MS = 800;

export type SaveState = "loading" | "saved" | "saving" | "error";

// useSiteContent keeps a console-edited page document in sync with the API:
// it loads the stored document over the defaults, then saves each change a
// moment after editing stops.
export function useSiteContent<T extends object>(key: "website" | "shogun", defaults: T) {
  const { toast } = useToast();
  const [state, setState] = useState<T>(defaults);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const loaded = useRef(false);
  const skipNextSave = useRef(true);

  useEffect(() => {
    let cancelled = false;
    api.get<{ value: Partial<T> }>(`/admin/content/${key}`)
      .then(({ value }) => {
        if (cancelled) return;
        skipNextSave.current = true;
        setState(current => ({ ...current, ...value }));
        loaded.current = true;
        setSaveState("saved");
      })
      .catch(error => {
        if (cancelled) return;
        setSaveState("error");
        toast({ title: "Could not load content", description: (error as Error).message, variant: "destructive" });
      });
    return () => { cancelled = true; };
  }, [key, toast]);

  useEffect(() => {
    // Nothing is saved before the stored document arrives, or for the load itself.
    if (!loaded.current) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setSaveState("saving");
    const timer = window.setTimeout(async () => {
      try {
        await api.put(`/admin/content/${key}`, { value: state });
        setSaveState("saved");
      } catch (error) {
        setSaveState("error");
        toast({ title: "Could not save content", description: (error as Error).message, variant: "destructive" });
      }
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [key, state, toast]);

  return [state, setState, saveState] as const;
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateApiKey, hashApiKey } from "@/lib/api-keys";
import { CopyButton } from "@/components/copy-button";
import { KeyRound, Plus, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export function ApiKeysPanel({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<{ id: string; plaintext: string } | null>(null);

  const keysQ = useQuery({
    queryKey: ["api_keys", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_keys")
        .select("id, name, prefix, last_used_at, revoked_at, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ApiKey[];
    },
  });

  const revokeM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("api_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["api_keys", userId] });
      toast.success("Key revoked");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not revoke key"),
  });

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const { plaintext, prefix } = generateApiKey();
      const hashed_key = await hashApiKey(plaintext);
      const { data, error } = await supabase
        .from("api_keys")
        .insert({ user_id: userId, name: name.trim(), prefix, hashed_key })
        .select("id")
        .single();
      if (error) throw error;
      setRevealed({ id: data.id, plaintext });
      setName("");
      qc.invalidateQueries({ queryKey: ["api_keys", userId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create key");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-primary" />
        <div className="font-semibold">API keys</div>
        <span className="text-xs text-muted-foreground font-mono ml-auto">
          {keysQ.data?.length ?? 0} key{(keysQ.data?.length ?? 0) === 1 ? "" : "s"}
        </span>
      </div>

      <form onSubmit={onCreate} className="px-5 py-4 border-b border-border grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name (e.g. Production server)"
          maxLength={64}
          className="px-3 py-2 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
        />
        <button
          disabled={creating || !name.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          New key
        </button>
      </form>

      {revealed && (
        <div className="px-5 py-4 border-b border-border bg-warning/5">
          <div className="flex items-start gap-2 text-xs">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground mb-1">Copy this key now — it won't be shown again.</div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md bg-code-bg px-3 py-2 border border-code-border">
                <code className="font-mono text-[11px] break-all">{revealed.plaintext}</code>
                <CopyButton value={revealed.plaintext} />
              </div>
              <button
                onClick={() => setRevealed(null)}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                I've saved it
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {keysQ.isLoading && (
          <div className="p-5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {keysQ.data?.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No API keys yet. Create one above to authenticate server-to-server requests.
          </div>
        )}
        {(keysQ.data ?? []).map((k, i) => (
          <div
            key={k.id}
            className={`px-5 py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{k.name}</span>
                {k.revoked_at && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-destructive/15 text-destructive ring-1 ring-destructive/30">
                    revoked
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {k.prefix}…  ·  created {new Date(k.created_at).toLocaleDateString()}
                {k.last_used_at && <>  ·  last used {new Date(k.last_used_at).toLocaleDateString()}</>}
              </div>
            </div>
            {!k.revoked_at && (
              <button
                onClick={() => {
                  if (confirm(`Revoke "${k.name}"? Apps using it will lose access.`)) revokeM.mutate(k.id);
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                aria-label={`Revoke ${k.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" /> Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

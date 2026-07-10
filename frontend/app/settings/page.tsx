"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function SettingsPage() {
  const router = useRouter();
  const [banner, setBanner] = useState<File | null>(null);
  const [columns, setColumns] = useState(
    Array.from({ length: 4 }, () => ({ image: null as File | null, text: "" }))
  );
  const [status, setStatus] = useState("");

  const updateColumn = (i: number, patch: Partial<{ image: File | null; text: string }>) => {
    setColumns(columns.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  };

  const save = async () => {
    setStatus("Enregistrement...");
    const formData = new FormData();
    if (banner) formData.append("banner", banner);
    columns.forEach((col, i) => {
      if (col.image) formData.append(`col${i + 1}_image`, col.image);
      formData.append(`col${i + 1}_text`, col.text);
    });

    try {
      const res = await fetch(`${API}/api/config/`, { method: "PUT", body: formData });
      if (!res.ok) throw new Error();
      router.push("/preview");
    } catch {
      setStatus("Erreur : vérifiez que le backend est lancé.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Remplir les champs pour avoir un preview du site</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="banner">Photo du banner</Label>
          <Input
            id="banner"
            type="file"
            accept="image/*"
            onChange={(e) => setBanner(e.target.files?.[0] ?? null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter 4 images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <p className="text-sm font-medium">Colonne {i + 1}</p>
                  <div className="space-y-1">
                    <Label htmlFor={`img-${i}`}>Image</Label>
                    <Input
                      id={`img-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateColumn(i, { image: e.target.files?.[0] ?? null })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`text-${i}`}>Texte</Label>
                    <Input
                      id={`text-${i}`}
                      type="text"
                      placeholder={`Texte de la colonne ${i + 1}`}
                      value={columns[i].text}
                      onChange={(e) => updateColumn(i, { text: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={save}>Enregistrer le design</Button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </div>
    </main>
  );
}
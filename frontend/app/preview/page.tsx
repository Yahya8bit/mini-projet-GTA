"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

type SiteConfig = {
  banner: string | null;
  col1_image: string | null; col1_text: string;
  col2_image: string | null; col2_text: string;
  col3_image: string | null; col3_text: string;
  col4_image: string | null; col4_text: string;
};

export default function PreviewPage() {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/config/`)
      .then((res) => res.json())
      .then(setConfig)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="p-6">Impossible de charger la configuration.</p>;
  if (!config) return <p className="p-6 text-muted-foreground">Chargement...</p>;

  const banner = config.banner;

  const columns = [1, 2, 3, 4].map((i) => ({
    image: config[`col${i}_image` as keyof SiteConfig] as string | null,
    text: config[`col${i}_text` as keyof SiteConfig] as string,
  }));

  return (
    <main>
      {/* Barre d'action */}
      <div className="flex justify-end p-4 border-b">
        <Button variant="outline" onClick={() => router.push("/settings")}>
          ← Modifier le design
        </Button>
      </div>

      {/* Section 1 : Banner */}
      <div className="relative h-64 bg-muted flex items-center justify-center overflow-hidden">
        {banner ? (
          <Image src={banner} alt="Banner" fill className="object-cover" />
        ) : (
          <p className="text-muted-foreground">Aucun banner configuré</p>
        )}
      </div>

      {/* Section 2 : 4 colonnes */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        {columns.map((col, i) => {
          const img = col.image;
          return (
            <Card key={i} className="overflow-hidden">
              {img ? (
                <div className="relative w-full h-40">
                  <Image src={img} alt={`Colonne ${i + 1}`} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-40 bg-muted" />
              )}
              <CardContent className="pt-4">
                <p className="text-sm">{col.text || `Colonne ${i + 1}`}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
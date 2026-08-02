import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex max-w-2xl flex-col items-center text-center gap-6">
        <img 
          src={logoAsset.url} 
          alt="Orange News Carajás" 
          className="w-full max-w-sm h-auto"
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Portal de Notícias
        </h1>
        <p className="text-xl text-muted-foreground">
          A região em pauta. A notícia em movimento.
        </p>
      </div>
    </div>
  );
}

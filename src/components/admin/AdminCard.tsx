import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  icon?: any;
}

export function AdminCard({ title, children, className, headerAction, icon: Icon }: AdminCardProps) {
  return (
    <Card className={cn("bg-brand-dark border-white/5 shadow-premium overflow-hidden", className)}>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white/70 italic">
              {title}
            </CardTitle>
          </div>
          {headerAction}
        </CardHeader>
      )}
      <CardContent className={cn("p-6", !title && "pt-6")}>
        {children}
      </CardContent>
    </Card>
  );
}

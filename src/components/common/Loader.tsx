import React from "react";

export const Loader: React.FC<{ fullScreen?: boolean; text?: string }> = ({
  fullScreen = false,
  text = "Загрузка..."
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-noir-bg text-gold-primary">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-gold-primary/20 animate-ping"></div>
          <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-gold-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-serif text-xl font-bold text-gold-primary">
            H
          </div>
        </div>
        <p className="font-serif text-sm tracking-widest uppercase text-gold-light/80 animate-pulse">
          HADIDJA ATELIER
        </p>
        <span className="text-xs text-muted-foreground mt-1">{text}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-gold-primary">
      <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-gold-primary animate-spin mb-2"></div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-border bg-card/50">
      {icon && <div className="text-gold-primary mb-4">{icon}</div>}
      <h3 className="text-lg font-serif font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

"use client";

import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface AuthFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormLayout({
  title,
  description,
  children,
  footer,
}: AuthFormLayoutProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card className="border-[var(--color-cyan-100)] bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-[var(--color-navy-900)]">{title}</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
        </CardHeader>
        {children}
      </Card>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}

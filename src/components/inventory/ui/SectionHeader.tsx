
import React from "react";

interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h3 className="text-sm font-medium mb-2">{title}</h3>
  );
}

import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy tracking-tight">{title}</h1>
      </div>
      <Card className="min-h-[400px] flex items-center justify-center bg-gray-50/50 border-dashed border-2">
        <CardContent className="text-center">
          <p className="text-gray-500 font-medium">{title} Module</p>
          <p className="text-sm text-gray-400 mt-1">Pending backend integration</p>
        </CardContent>
      </Card>
    </div>
  );
}

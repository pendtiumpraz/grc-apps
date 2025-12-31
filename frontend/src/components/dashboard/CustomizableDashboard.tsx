'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Eye, EyeOff, Maximize2, RotateCcw } from 'lucide-react';
import { useDragDrop, Widget } from '@/hooks/useDragDrop';

interface CustomizableDashboardProps {
  widgets?: Widget[];
  onWidgetSave?: (widgets: Widget[]) => void;
}

const defaultWidgets: Widget[] = [
  { id: 'stats-1', title: 'Total Risks', type: 'stats', size: 'small', position: 0, visible: true },
  { id: 'stats-2', title: 'Open Vulnerabilities', type: 'stats', size: 'small', position: 1, visible: true },
  { id: 'stats-3', title: 'Compliance Score', type: 'stats', size: 'small', position: 2, visible: true },
  { id: 'stats-4', title: 'Pending Actions', type: 'stats', size: 'small', position: 3, visible: true },
  { id: 'chart-1', title: 'Risk Trend', type: 'chart', size: 'medium', position: 4, visible: true },
  { id: 'chart-2', title: 'Compliance Overview', type: 'chart', size: 'medium', position: 5, visible: true },
  { id: 'list-1', title: 'Recent Activities', type: 'list', size: 'large', position: 6, visible: true },
  { id: 'list-2', title: 'Upcoming Deadlines', type: 'list', size: 'large', position: 7, visible: true },
];

export function CustomizableDashboard({ widgets: initialWidgets, onWidgetSave }: CustomizableDashboardProps) {
  const {
    widgets,
    draggingWidget,
    moveWidget,
    toggleWidgetVisibility,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    resetWidgets,
  } = useDragDrop({
    initialWidgets: initialWidgets || defaultWidgets,
    onSave: onWidgetSave,
  });

  const [isEditing, setIsEditing] = useState(false);

  const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.position - b.position);
  const hiddenWidgets = widgets.filter(w => !w.visible);

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-2';
      case 'large': return 'col-span-3';
      default: return 'col-span-1';
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <div className="p-4">
            <h3 className="text-gray-400 text-sm mb-2">{widget.title}</h3>
            <p className="text-3xl font-bold text-white">42</p>
            <p className="text-green-400 text-sm mt-1">+5 from last week</p>
          </div>
        );
      case 'chart':
        return (
          <div className="p-4">
            <h3 className="text-gray-400 text-sm mb-4">{widget.title}</h3>
            <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Chart placeholder</p>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="p-4">
            <h3 className="text-gray-400 text-sm mb-4">{widget.title}</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <p className="text-gray-300 text-sm">Activity item {i}</p>
                  <p className="text-gray-500 text-xs ml-auto">2h ago</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm">Customize your dashboard layout</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetWidgets}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditing ? 'Done' : 'Customize'}
          </Button>
        </div>
      </div>

      {/* Hidden Widgets */}
      {hiddenWidgets.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-700">
          <div className="p-4">
            <h3 className="text-gray-400 text-sm mb-3">Hidden Widgets ({hiddenWidgets.length})</h3>
            <div className="flex flex-wrap gap-2">
              {hiddenWidgets.map((widget) => (
                <Button
                  key={widget.id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {widget.title}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleWidgets.map((widget, index) => (
          <Card
            key={widget.id}
            draggable={isEditing}
            onDragStart={() => handleDragStart(widget.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              const dragIndex = widgets.findIndex(w => w.id === draggingWidget);
              const dropIndex = widgets.findIndex(w => w.id === widget.id);
              if (dragIndex !== -1 && dropIndex !== -1) {
                moveWidget(dragIndex, dropIndex);
              }
            }}
            className={`bg-gray-900 border-gray-700 transition-all ${
              isEditing ? 'cursor-move hover:border-cyan-500/50' : ''
            } ${draggingWidget === widget.id ? 'opacity-50 border-cyan-500' : ''}`}
          >
            <div className="relative">
              {/* Widget Header */}
              {isEditing && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <EyeOff className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Widget Content */}
              {renderWidgetContent(widget)}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <div className="p-12 text-center">
            <p className="text-gray-400">No widgets visible. Add widgets to customize your dashboard.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

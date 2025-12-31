import { useState, useCallback } from 'react';

export interface Widget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'list' | 'custom';
  size: 'small' | 'medium' | 'large';
  position: number;
  visible: boolean;
}

interface UseDragDropProps {
  initialWidgets: Widget[];
  onSave?: (widgets: Widget[]) => void;
}

export function useDragDrop({ initialWidgets, onSave }: UseDragDropProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [draggingWidget, setDraggingWidget] = useState<string | null>(null);

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    setWidgets((prevWidgets) => {
      const newWidgets = [...prevWidgets];
      const draggedWidget = newWidgets[dragIndex];
      
      // Remove from old position
      newWidgets.splice(dragIndex, 1);
      
      // Insert at new position
      newWidgets.splice(hoverIndex, 0, draggedWidget);
      
      // Update positions
      return newWidgets.map((widget, index) => ({
        ...widget,
        position: index,
      }));
    });
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  }, []);

  const handleDragStart = useCallback((widgetId: string) => {
    setDraggingWidget(widgetId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingWidget(null);
    onSave?.(widgets);
  }, [widgets, onSave]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetWidgets = useCallback(() => {
    setWidgets(initialWidgets);
  }, [initialWidgets]);

  return {
    widgets,
    draggingWidget,
    moveWidget,
    toggleWidgetVisibility,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    resetWidgets,
  };
}

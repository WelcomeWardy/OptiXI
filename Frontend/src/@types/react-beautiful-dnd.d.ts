declare module 'react-beautiful-dnd' {
    import * as React from 'react';
    export interface DropResult {
        draggableId: string;
        type: string;
        source: { droppableId: string; index: number };
        destination: { droppableId: string; index: number } | null;
        reason: 'DROP' | 'CANCEL';
        mode: 'FLUID' | 'SNAP';
        combine?: any;
    }
    export const DragDropContext: React.ComponentType<any>;
    export const Droppable: React.ComponentType<any>;
    export const Draggable: React.ComponentType<any>;
}

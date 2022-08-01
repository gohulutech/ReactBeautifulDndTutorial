import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "@atlaskit/css-reset";
import { DragDropContext } from "react-beautiful-dnd";
import initialData from "./initial-data";
import Column from "./column";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const App = () => {
  const [columnOrder, setColumnOrder] = useState(initialData.columnOrder);
  const [columns, setColumns] = useState(initialData.columns);
  const [homeIndex, setHomeIndex] = useState(null);

  const onDragStart = (start) => {
    const initialIndex = columnOrder.indexOf(start.source.droppableId);

    setHomeIndex(initialIndex);
  };

  const onDragEnd = (result) => {
    setHomeIndex(null);
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const column = columns[source.droppableId];
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...column, taskIds: newTaskIds };

      const newColumns = { ...columns, [newColumn.id]: newColumn };
      setColumns(newColumns);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newColums = {
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    };
    setColumns(newColums);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Container>
        {columnOrder.map((columnId, index) => {
          const column = columns[columnId];
          const tasks = column.taskIds.map(
            (taskId) => initialData.tasks[taskId]
          );

          const isDropDisabled = index < homeIndex;

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              isDropDisabled={isDropDisabled}
            />
          );
        })}
      </Container>
    </DragDropContext>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);

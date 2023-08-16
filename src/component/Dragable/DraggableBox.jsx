import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Rnd } from "react-rnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ItemTypes } from "./ItemTypes";
import { Box } from "./Box";
import cx from "classnames";

export const DraggableBox = ({
  index,
  component,
  id,
  title,
  parent,
  layouts,
  canvasWidth,
  currentLayout,
  inCanvas,
  className,
  isSelectedComponent,
  mode,
  readOnly,
  draggingStatusChanged,
  hoveredComponent,
  setSelectedComponent,
  onDragStop,
  onComponentClick,
  allComponents,
  onResizeStop,
}) => {
  const [isResizing, setResizing] = useState(false);
  const [isDragging2, setDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);
  const [mouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    setMouseOver(hoveredComponent === id);
  }, [hoveredComponent]);
  //   const currentState = useCurrentState();

  useEffect(() => {
    if (draggingStatusChanged) {
      draggingStatusChanged(isDragging2);
    }

    if (isDragging2 && !isSelectedComponent) {
      setSelectedComponent(id, component);
    }
  }, [isDragging2]);

  const defaultData = {
    top: 100,
    left: 0,
    width: 445,
    height: 500,
  };
  const NO_OF_GRIDS = 43;
  const layoutData = inCanvas
    ? layouts[currentLayout] || defaultData
    : defaultData;

  const gridWidth = canvasWidth / NO_OF_GRIDS;
  const width = (canvasWidth * layoutData.width) / NO_OF_GRIDS;

  const style = {
    display: "inline-block",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px",
  };

  const resizerClasses = {
    topRight: "top-right",
    bottomRight: "bottom-right",
    bottomLeft: "bottom-left",
    topLeft: "top-left",
  };

  const resizerStyles = {
    topRight: {
      width: "8px",
      height: "8px",
      right: "-4px",
      top: "-4px",
    },
    bottomRight: {
      width: "8px",
      height: "8px",
      right: "-4px",
      bottom: "-4px",
    },
    bottomLeft: {
      width: "8px",
      height: "8px",
      left: "-4px",
      bottom: "-4px",
    },
    topLeft: {
      width: "8px",
      height: "8px",
      left: "-4px",
      top: "-4px",
    },
  };

  const getStyles = (isDragging, isSelectedComponent) => {
    return {
      position: "absolute",
      zIndex: isSelectedComponent ? 2 : 1,
      // IE fallback: hide the real node using CSS when dragging
      // because IE will ignore our custom "empty image" drag preview.
      opacity: isDragging ? 0 : 1,
    };
  };
  // useDrag hook from rnd
  const [{ isDragging }, drag, preview] = useDrag(() => {
    // console.log("USER", component);
    return {
      type: ItemTypes.BOX,
      item: {
        id,
        title,
        component,
        parent,
        layouts,
        canvasWidth,
        currentLayout,
      },
      collect: (moniter) => {
        return {
          isDragging: moniter.isDragging(),
        };
      },
    };
  }, [
    id,
    title,
    component,
    index,
    parent,
    layouts,
    canvasWidth,
    currentLayout,
  ]);

  let _refProps = {};

  if (mode === "edit" && canDrag) {
    _refProps = {
      ref: drag,
    };
  }

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [isDragging]);

  const changeCanDrag = (newState) => {
    setCanDrag(newState);
  };

  const style2 = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
    top: "90px",
    left: "10px",
  };

  return (
    <div
      className="text-center align-items-center clearfix mb-2 col-md-4"
      // className={
      //   inCanvas
      //     ? ""
      //     : cx("text-center align-items-center clearfix mb-2", {
      //         "col-md-4": component.component !== "KanbanBoard",
      //         "d-none": component.component === "KanbanBoard",
      //       })
      // }
    >
      {inCanvas ? (
        <div
          // className={cx(`draggable-box widget-${id}`, {
          //   [className]: !!className,
          //   "draggable-box-in-editor": mode === "edit",
          // })}
          onMouseEnter={(e) => console.log("mouse eneter in dragrabble box")}
          onMouseLeave={() => console.log("mouseLeave")}
          style={getStyles(isDragging, isSelectedComponent)}
        >
          <h1>This is icanvas</h1>
          <Rnd
            style={{ ...style }}
            resizeGrid={[gridWidth, 10]}
            dragGrid={[gridWidth, 10]}
            size={{
              width: width,
              height: layoutData.height,
            }}
            position={{
              x: layoutData ? (layoutData.left * canvasWidth) / 100 : 0,
              y: layoutData ? layoutData.top : 0,
            }}
            defaultSize={{}}
            className={`resizer ${
              mouseOver || isResizing || isDragging2 || isSelectedComponent
                ? "resizer-active"
                : ""
            } `}
            onResize={() => setResizing(true)}
            onDrag={(e) => {
              e.preventDefault();
              e.stopImmediatePropagation();
              if (!isDragging2) {
                setDragging(true);
              }
            }}
            resizeHandleClasses={
              isSelectedComponent || mouseOver ? resizerClasses : {}
            }
            resizeHandleStyles={resizerStyles}
            enableResizing={mode === "edit" && !readOnly}
            disableDragging={mode !== "edit" || readOnly}
            onDragStop={(e, direction) => {
              setDragging(false);
              onDragStop(e, id, direction, currentLayout, layoutData);
            }}
            onResizeStop={(e, direction, ref, d, position) => {
              setResizing(false);
              onResizeStop(id, e, direction, ref, d, position);
            }}
            bounds={parent !== undefined ? `#canvas-${parent}` : ".real-canvas"}
            cancel={`div.table-responsive.jet-data-table, div.calendar-widget, div.text-input, .textarea, .map-widget, .range-slider, .kanban-container, div.real-canvas`}
            widgetId={id}
          >
            <div
              ref={preview}
              role="DraggableBox"
              style={isResizing ? { opacity: 0.5 } : { opacity: 1 }}
            >
              {mode === "edit" &&
                !readOnly &&
                (mouseOver || isSelectedComponent) &&
                !isResizing && <h1>ConfigHandle</h1>}
              <Box
                component={component}
                id={id}
                inCanvas={inCanvas}
                mode={mode}
                width={width}
                height={layoutData.height - 4}
                changeCanDrag={changeCanDrag}
                onComponentClick={onComponentClick}
                allComponents={allComponents}
              />
            </div>
          </Rnd>
        </div>
      ) : (
        <>
          {/* <Rnd
            style={style2}
            default={{
              x: 0,
              y: 0,
              width: 100,
              height: 100,
            }}
          >
            Rnd
          </Rnd> */}
          <div
            ref={drag}
            role="DraggableBox"
            className="draggable-box"
            style={{ height: "100%" }}
          >
            <Box component={component} id={id} isCanvas={inCanvas} />
          </div>
        </>
      )}
    </div>
  );
};

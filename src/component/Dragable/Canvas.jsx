import React, {
  createRef,
  useEffect,
  useReducer,
  useState,
  useRef,
} from "react";
import { EditorContextWrapper } from "./EditorContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComponentManager } from "./ComponentManager";
import { componentTypes } from "../Widgetsmanager/components";
import { Container } from "./Container";
import { CustomDraggerLayer } from "./CustomDraggerLayer";
import { isEqual } from "lodash";
import { v4 as uuid } from "uuid";
// import config from "config";
// import { produce } from "immer";

// const { produce } = require("immer");

const defaultDefinition = {
  showViewerNavigation: true,
  homePageId: 1,
  pages: {
    1: {
      components: {},
      handle: "home",
      name: "Home",
    },
  },
  globalSettings: {
    hideHeader: false,
    appInMaintenance: false,
    canvasMaxWidth: 1292,
    canvasMaxWidthType: "px",
    canvasMaxHeight: 2400,
    canvasBackgroundColor: "#edeff5",
    backgroundFxQuery: "",
  },
};

export const Canvas = () => {
  const canvasContainerRef = createRef();
  const selectionRef = createRef();
  const [isDragging, setIsDragging] = useState(false);
  const [appDefinition, setAppDefinition] = useState(defaultDefinition);

  // const appDefinition = defaultDefinition;
  // const [appDefinition,set]

  const getCanvasWidth = () => {
    const canvasBoundingRect = document
      .getElementsByClassName("canvas-area")[0]
      .getBoundingClientRect();
    return canvasBoundingRect?.width;
  };

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  };

  const previous = usePrevious(appDefinition);

  useEffect(() => {
    console.log("previeosu ststate", previous);
  }, [previous]);

  const appDefinitionChanged = (newDefinition, opts = {}) => {
    let currentPageId = this.state.currentPageId;
    if (isEqual(appDefinition, newDefinition)) return;
    // if (config.ENABLE_MULTIPLAYER_EDITING && !opts.skipYmapUpdate) {
    //   this.props.ymap?.set("appDef", {
    //     newDefinition,
    //     editingVersionId: this.props.editingVersion?.id,
    //   });
    // }

    if (opts?.versionChanged) {
      currentPageId = newDefinition.homePageId;

      setAppDefinition({ ...newDefinition });
      // this.setState(
      //   {
      //     isSaving: true,
      //     currentPageId: currentPageId,
      //     appDefinition: newDefinition,
      //     appDefinitionLocalVersion: uuid(),
      //   },
      //   () => {
      //     if (!opts.skipAutoSave) this.autoSave();
      //     this.switchPage(currentPageId);
      //   }
      // );
      return;
    }

    // produce(
    //   this.state.appDefinition,
    //   (draft) => {
    //     draft.pages[currentPageId].components =
    //       newDefinition.pages[currentPageId]?.components ?? {};
    //   },
    //   this.handleAddPatch
    // );

    setAppDefinition({ ...newDefinition });
    // this.setState(
    //   {
    //     isSaving: true,
    //     appDefinition: newDefinition,
    //     appDefinitionLocalVersion: uuid(),
    //   },
    //   () => {
    //     if (!opts.skipAutoSave) this.autoSave();
    //   }
    // );
  };

  return (
    <>
      <div>Canvas</div>
      <div className="editor wrapper">
        <EditorContextWrapper>
          <DndProvider backend={HTML5Backend}>
            <div className="sub-section">
              {/* Need to check for reactselecto */}
              {/* EnterScreen with Side Bar */}
              <div
                className={`main main-editor-canvas `}
                id="main-editor-canvas"
              >
                <div
                  className="canvas-container align-items-center"
                  style={{
                    transform: `scale(1.0)`,
                    // borderLeft:
                    //   (this.state.editorMarginLeft
                    //     ? this.state.editorMarginLeft - 1
                    //     : this.state.editorMarginLeft) +
                    //   `px solid ${this.computeCanvasBackgroundColor()}`,
                    height: "80%",
                    background: "#f4f6fa",
                  }}
                  onMouseUp={(e) => {
                    console.log("on Mouse Up con", e);
                    // if (["real-canvas", "modal"].includes(e.target.className)) {
                    //   this.setState({
                    //     selectedComponents: [],
                    //     currentSidebarTab: 2,
                    //     hoveredComponent: false,
                    //   });
                    // }
                  }}
                  ref={canvasContainerRef}
                  onScroll={() => {
                    selectionRef.current.checkScroll();
                  }}
                >
                  <>
                    <div
                      className="canvas-area"
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: "translateZ(0)",
                        backgroundColor: "#edeff5",
                      }}
                    >
                      {true && (
                        <>
                          <Container
                            canvasWidth={getCanvasWidth}
                            // socket={socket}
                            appDefinition={appDefinition}
                            appDefinitionChanged={appDefinitionChanged}
                            snapToGrid={true}
                            // darkMode={this.props.darkMode}
                            mode={"edit"}
                            // zoomLevel={zoomLevel}
                            // deviceWindowWidth={deviceWindowWidth}
                            // selectedComponents={selectedComponents}
                            // appLoading={isLoading}
                            // onEvent={handleEvent}
                            // onComponentOptionChanged={
                            //   handleOnComponentOptionChanged
                            // }
                            // onComponentOptionsChanged={
                            //   handleOnComponentOptionsChanged
                            // }
                            // setSelectedComponent={setSelectedComponent}
                            // handleUndo={handleUndo}
                            // handleRedo={handleRedo}
                            // removeComponent={removeComponent}
                            // onComponentClick={handleComponentClick}
                            // onComponentHover={handleComponentHover}
                            // hoveredComponent={hoveredComponent}
                            // sideBarDebugger={sideBarDebugger}
                            // currentPageId={.state.currentPageId}
                          />
                          <CustomDraggerLayer
                            snapToGrid={true}
                            canvasWidth={getCanvasWidth}
                            onDragging={(isDragging) =>
                              setIsDragging(isDragging)
                            }
                          />
                        </>
                      )}
                    </div>
                  </>
                </div>
              </div>
              <div className="editor-sidebar">
                <ComponentManager componentTypes={componentTypes} />
              </div>
            </div>
          </DndProvider>
        </EditorContextWrapper>
      </div>
    </>
  );
};

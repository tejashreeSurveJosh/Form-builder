import React from "react";
import { v4 as uuid } from "uuid";
import { componentTypes } from "../Widgetsmanager/components";
import { isEqual } from "lodash";
import { EditorContextWrapper } from "./EditorContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComponentManager } from "./ComponentManager";
import { Container } from "./Container";
import { CustomDraggerLayer } from "./CustomDraggerLayer";

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    // resetAllStores();
    // const appId = this.props.params.id;
    // useEditorStore.getState().actions.setIsEditorActive(true);
    // const { socket } = createWebsocketConnection(appId);

    this.renameQueryNameId = React.createRef();

    // this.socket = socket;

    const defaultPageId = uuid();

    this.subscription = null;

    this.defaultDefinition = {
      showViewerNavigation: true,
      homePageId: defaultPageId,
      pages: {
        [defaultPageId]: {
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
        canvasBackgroundColor: props.darkMode ? "#2f3c4c" : "#edeff5",
        backgroundFxQuery: "",
      },
    };

    this.dataSourceModalRef = React.createRef();
    this.canvasContainerRef = React.createRef();
    this.selectionRef = React.createRef();
    this.selectionDragRef = React.createRef();
    this.queryManagerPreferences =
      JSON.parse(localStorage.getItem("queryManagerPreferences")) ?? {};
    this.state = {
      currentUser: {},
      app: {},
      allComponentTypes: componentTypes,
      isLoading: true,
      users: null,
      // appId,
      showLeftSidebar: true,
      zoomLevel: 1.0,
      deviceWindowWidth: 450,
      appDefinition: this.defaultDefinition,
      apps: [],
      queryConfirmationList: [],
      isSourceSelected: false,
      isSaving: false,
      isUnsavedQueriesAvailable: false,
      selectionInProgress: false,
      scrollOptions: {},
      currentPageId: defaultPageId,
      pages: {},
      draftQuery: null,
      selectedDataSource: null,
    };

    // this.autoSave = debounce(this.saveEditingVersion, 3000);
    // this.realtimeSave = debounce(this.appDefinitionChanged, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.appDefinition, this.state.appDefinition)) {
      console.log("compuete compenent state");
      //   computeComponentState(
      //     this,
      //     this.state.appDefinition.pages[this.state.currentPageId]?.components
      //   );
    }

    if (!isEqual(prevState.editorMarginLeft, this.state.editorMarginLeft)) {
      this.canvasContainerRef.current.scrollLeft += this.state.editorMarginLeft;
    }
  }

  filterComponents = (event) => {
    const searchText = event.currentTarget.value;
    let filteredComponents = this.state.allComponentTypes;

    if (searchText !== "") {
      filteredComponents = this.state.allComponentTypes.filter(
        (e) => e.name.toLowerCase() === searchText.toLowerCase()
      );
    }

    this.setState({ componentTypes: filteredComponents });
  };

  appDefinitionChanged = (newDefinition, opts = {}) => {
    let currentPageId = this.state.currentPageId;
    if (isEqual(this.state.appDefinition, newDefinition)) return;
    // if (config.ENABLE_MULTIPLAYER_EDITING && !opts.skipYmapUpdate) {
    //   this.props.ymap?.set("appDef", {
    //     newDefinition,
    //     editingVersionId: this.props.editingVersion?.id,
    //   });
    // }

    if (opts?.versionChanged) {
      currentPageId = newDefinition.homePageId;

      this.setState(
        {
          isSaving: true,
          currentPageId: currentPageId,
          appDefinition: newDefinition,
          appDefinitionLocalVersion: uuid(),
        },
        () => {
          if (!opts.skipAutoSave) this.autoSave();
          this.switchPage(currentPageId);
        }
      );
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
    this.setState(
      {
        isSaving: true,
        appDefinition: newDefinition,
        appDefinitionLocalVersion: uuid(),
      },
      () => {
        if (!opts.skipAutoSave) this.autoSave();
      }
    );
  };

  componentDefinitionChanged = (componentDefinition) => {
    // if (this.props.isVersionReleased) {
    //   useAppVersionStore.getState().actions.enableReleasedVersionPopupState();
    //   return;
    // }
    let _self = this;
    const currentPageId = this.state.currentPageId;

    if (
      this.state.appDefinition?.pages[currentPageId].components[
        componentDefinition.id
      ]
    ) {
      //   const newDefinition = {
      //     appDefinition: produce(this.state.appDefinition, (draft) => {
      //       draft.pages[currentPageId].components[
      //         componentDefinition.id
      //       ].component = componentDefinition.component;
      //     }),
      //   };
      //   produce(
      //     this.state.appDefinition,
      //     (draft) => {
      //       draft.pages[currentPageId].components[
      //         componentDefinition.id
      //       ].component = componentDefinition.component;
      //     },
      //     this.handleAddPatch
      //   );
      //   setStateAsync(_self, newDefinition).then(() => {
      //     computeComponentState(
      //       _self,
      //       _self.state.appDefinition.pages[currentPageId].components
      //     );
      //     this.setState({ isSaving: true, appDefinitionLocalVersion: uuid() });
      //     this.autoSave();
      //     this.props.ymap?.set("appDef", {
      //       newDefinition: newDefinition.appDefinition,
      //       editingVersionId: this.props.editingVersion?.id,
      //     });
      //   });
    }
  };

  setSelectedComponent = (id, component, multiSelect = false) => {
    if (this.state.selectedComponents.length === 0 || !multiSelect) {
      this.switchSidebarTab(1);
    } else {
      this.switchSidebarTab(2);
    }

    const isAlreadySelected = this.state.selectedComponents.find(
      (component) => component.id === id
    );

    if (!isAlreadySelected) {
      this.setState((prevState) => {
        return {
          selectedComponents: [
            ...(multiSelect ? prevState.selectedComponents : []),
            { id, component },
          ],
        };
      });
    }
  };

  // getCanvasWidth = () => {
  //   const canvasBoundingRect2 =
  //     document.getElementsByClassName("canvas-area")[0];

  //   console.log(canvasBoundingRect2);
  //   const canvasBoundingRect = document
  //     .getElementsByClassName("canvas-area")[0]
  //     .getBoundingClientRect();
  //   return canvasBoundingRect?.width;
  // };

  handleComponentClick = (id, component) => {
    this.setState({
      selectedComponent: { id, component },
    });
    this.switchSidebarTab(1);
  };

  handleComponentHover = (id) => {
    if (this.state.selectionInProgress) return;
    this.setState({
      hoveredComponent: id,
    });
  };

  onAreaSelectionStart = (e) => {
    const isMultiSelect =
      e.inputEvent.shiftKey || this.state.selectedComponents.length > 0;
    this.setState((prevState) => {
      return {
        selectionInProgress: true,
        selectedComponents: [
          ...(isMultiSelect ? prevState.selectedComponents : []),
        ],
      };
    });
  };

  onAreaSelection = (e) => {
    e.added.forEach((el) => {
      el.classList.add("resizer-select");
    });
    if (this.state.selectionInProgress) {
      e.removed.forEach((el) => {
        el.classList.remove("resizer-select");
      });
    }
  };

  onAreaSelectionEnd = (e) => {
    const currentPageId = this.state.currentPageId;
    this.setState({ selectionInProgress: false });
    e.selected.forEach((el, index) => {
      const id = el.getAttribute("widgetid");
      const component =
        this.state.appDefinition.pages[currentPageId].components[id].component;
      const isMultiSelect = e.inputEvent.shiftKey || (!e.isClick && index != 0);
      this.setSelectedComponent(id, component, isMultiSelect);
    });
  };

  onAreaSelectionDragStart = (e) => {
    if (e.inputEvent.target.getAttribute("id") !== "real-canvas") {
      this.selectionDragRef.current = true;
    } else {
      this.selectionDragRef.current = false;
    }
  };

  onAreaSelectionDrag = (e) => {
    if (this.selectionDragRef.current) {
      e.stop();
      this.state.selectionInProgress &&
        this.setState({ selectionInProgress: false });
    }
  };

  onAreaSelectionDragEnd = () => {
    this.selectionDragRef.current = false;
    this.state.selectionInProgress &&
      this.setState({ selectionInProgress: false });
  };

  updateHomePage = (pageId) => {
    this.setState(
      {
        isSaving: true,
        appDefinition: {
          ...this.state.appDefinition,
          homePageId: pageId,
        },
        appDefinitionLocalVersion: uuid(),
      },
      () => {
        this.autoSave();
      }
    );
  };

  render() {
    const {
      currentSidebarTab,
      selectedComponents = [],
      appDefinition,
      // appId,
      slug,
      app,
      showLeftSidebar,
      isLoading,
      zoomLevel,
      deviceWindowWidth,
      apps,
      defaultComponentStateComputed,
      hoveredComponent,
      queryConfirmationList,
    } = this.state;
    const currentState = this.props?.currentState;

    return (
      <div className="editor wrapper">
        <EditorContextWrapper>
          <DndProvider backend={HTML5Backend}>
            <div className="sub-section">
              {/* Need to check for reactselecto */}
              {/* EnterScreen with Side Bar */}
              <div
                className={`main main-editor-canvas ${
                  this.state.isQueryPaneDragging || this.state.isDragging
                    ? "hide-scrollbar"
                    : ""
                }`}
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
                    height: "60%",
                    background: "#f4f6fa",
                  }}
                  onMouseUp={(e) => {
                    console.log("on Mouse Up con", e);
                    if (["real-canvas", "modal"].includes(e.target.className)) {
                      this.setState({
                        selectedComponents: [],
                        currentSidebarTab: 2,
                        hoveredComponent: false,
                      });
                    }
                  }}
                  ref={this.canvasContainerRef}
                  onScroll={
                    () => console.log("scrol")
                    //                 {
                    //     selectionRef.current.checkScroll();
                    //   }
                  }
                >
                  <div style={{ minWidth: `calc((100vw - 300px) - 48px)` }}>
                    <div
                      className="canvas-area"
                      style={{
                        width: "100%",
                        transform: "translateZ(0)",
                        backgroundColor: "#edeff5",
                      }}
                    >
                      {true && (
                        <>
                          <Container
                            // canvasWidth={this.getCanvasWidth()}
                            // socket={socket}
                            appDefinition={appDefinition}
                            appDefinitionChanged={this.appDefinitionChanged}
                            snapToGrid={true}
                            // darkMode={this.props.darkMode}
                            mode={"edit"}
                            zoomLevel={zoomLevel}
                            deviceWindowWidth={deviceWindowWidth}
                            selectedComponents={selectedComponents}
                            appLoading={isLoading}
                            onEvent={this.handleEvent}
                            onComponentOptionChanged={
                              this.handleOnComponentOptionChanged
                            }
                            onComponentOptionsChanged={
                              this.handleOnComponentOptionsChanged
                            }
                            setSelectedComponent={this.setSelectedComponent}
                            handleUndo={this.handleUndo}
                            handleRedo={this.handleRedo}
                            removeComponent={this.removeComponent}
                            onComponentClick={this.handleComponentClick}
                            onComponentHover={this.handleComponentHover}
                            hoveredComponent={hoveredComponent}
                            sideBarDebugger={this.sideBarDebugger}
                            currentPageId={this.state.currentPageId}
                          />
                          <CustomDraggerLayer
                            snapToGrid={true}
                            // canvasWidth={this.getCanvasWidth()}
                            onDragging={(isDragging) =>
                              this.setState({ isDragging })
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="editor-sidebar">
                <ComponentManager componentTypes={componentTypes} />
              </div>
            </div>
          </DndProvider>
        </EditorContextWrapper>
      </div>
    );
  }
}

// const withStore = (Component) => (props) => {
//   const { showComments, currentLayout } = useEditorStore(
//     (state) => ({
//       showComments: state?.showComments,
//       currentLayout: state?.currentLayout,
//     }),
//     shallow
//   );
//   const { isVersionReleased, editingVersion } = useAppVersionStore(
//     (state) => ({
//       isVersionReleased: state.isVersionReleased,
//       editingVersion: state.editingVersion,
//     }),
//     shallow
//   );

//   const currentState = useCurrentState();

//   return (
//     <Component
//       {...props}
//       isVersionReleased={isVersionReleased}
//       editingVersion={editingVersion}
//       currentState={currentState}
//       showComments={showComments}
//       currentLayout={currentLayout}
//     />
//   );
// };

// export const Editor = withTranslation()(withRouter(withStore(EditorComponent)));

export default EditorComponent;

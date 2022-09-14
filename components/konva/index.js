import React, { Component } from "react";
import { Stage, Layer, Line, Image, Circle } from "react-konva";

class URLImage extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);
  }
  handleLoad = () => {
    this.setState({
      image: this.image
    });
  };
  render() {
    return (
      <Image
        width={this.props.width}
        height={this.props.height}
        y={this.props.y}
        x={this.props.x}
        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
      />
    );
  }
}

class App extends Component {
  state = {
    points: [[134, 384],
    [201, 212],
    [310, 211],
    [411, 337],
    [298, 463]],
    curMousePos: [0, 0],
    isMouseOverStartPoint: false,
    isFinished: true
  };

  getMousePos = stage => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  handleClick = event => {
    const {
      state: { points, isMouseOverStartPoint, isFinished },
      getMousePos
    } = this;
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) {
      this.setState({
        isFinished: true
      });
    } else {
      this.setState({
        points: [...points, mousePos]
      });
    }
  };
  handleMouseMove = event => {
    const { getMousePos } = this;
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    this.setState({
      curMousePos: mousePos
    });
  };
  handleMouseOverStartPoint = event => {
    if (this.state.isFinished || this.state.points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    this.setState({
      isMouseOverStartPoint: true
    });
  };
  handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    this.setState({
      isMouseOverStartPoint: false
    });
  };
  handleDragStartPoint = event => {
    console.log("start", event);
  };
  handleDragEndPoint = event => {
    const points = this.state.points;
    const index = event.target.index - 1;
    console.log(event.target);
    const pos = [event.target.attrs.x, event.target.attrs.y];
    console.log("move", event);
    console.log(pos);
    this.setState({
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)]
    });
  };
  handleDragOutPoint = event => {
    console.log("end", event);
  };

  render() {
    const {
      state: { points, isFinished, curMousePos },
      handleClick,
      handleMouseMove,
      handleMouseOverStartPoint,
      handleMouseOutStartPoint,
      handleDragStartPoint,
      handleDragMovePoint,
      handleDragEndPoint
    } = this;

    const flattenedPoints = points
      .concat(isFinished ? [] : curMousePos)
      .reduce((a, b) => a.concat(b), []);

    console.log('flattenedPoints', points)
    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}

      >
        <Layer>
          <URLImage width={window.innerWidth} height={window.innerHeight - 48} src="https://konvajs.org/assets/yoda.jpg" y={110} />
          <Line
            points={flattenedPoints}
            stroke="black"
            fill='#00D2FF'
            strokeWidth={5}
            closed={isFinished}
          />
          {points.map((point, index) => {
            const width = 6;
            const x = point[0]
            const y = point[1]
            const startPointAttr =
              index === 0
                ? {
                  hitStrokeWidth: 12,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint
                }
                : null;
            return (
              <Circle
                key={index}
                x={x}
                y={y}
                width={width}
                height={width}
                fill="white"
                stroke="black"
                strokeWidth={3}
                onDragStart={handleDragStartPoint}
                onDragEnd={handleDragEndPoint}
                draggable
                {...startPointAttr}

              />
            );
          })}

        </Layer>
      </Stage>
    );
  }
}

export default App
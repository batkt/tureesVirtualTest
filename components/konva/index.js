import { ClearOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { Component } from "react";
import { Stage, Layer, Line, Image, Circle } from "react-konva";
import { url } from "services/uilchilgee";

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
    points: this.props.points || [],
    curMousePos: [0, 0],
    isMouseOverStartPoint: !!this.props.points?.length || false,
    isFinished: !!this.props.points?.length || false
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
  handleDragEndPoint = (event, index) => {
    const points = this.state.points;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    points[index] = pos
    this.setState({
      points: [...points]
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
      handleDragEndPoint,
      props
    } = this;

    const flattenedPoints = points
      .concat(isFinished ? [] : curMousePos)
      .reduce((a, b) => a.concat(b), []);

    const barilga = props.baiguullaga?.barilguud?.find(a => a._id === props.barilgiinId)
    const plan = barilga?.davkharuud?.find(a => a.davkhar === props.davkhar)?.planZurag

    if (!plan)
      return (
        <div className="space-y-6" >
          <div className="flex justify-center pt-10 text-4xl text-gray-400 dark:text-red-100" >План зураг оруулаагүй байна
          </div>
          <div className="flex justify-center  ">
            <img
              src="https://media.istockphoto.com/vectors/house-plan-on-paper-with-ruler-and-pencil-thin-line-icon-interior-vector-id1282413344?k=20&m=1282413344&s=612x612&w=0&h=C_0ZmwrBoUW-AJo6_JYctTcWBEi5zj4pizoij_4gbf0="
              alt="no plan"
              width={"30%"}
              height={"30%"}
            />

          </div>

        </div>
      )

    return (
      <div>
        <Stage
          width={window.innerWidth - 50}
          height={window.innerHeight - 140}
          onMouseDown={handleClick}
          onMouseMove={handleMouseMove}

        >
          <Layer>
            <URLImage width={window.innerWidth - 50} height={window.innerHeight - 140} src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${plan}`} />

            <Line
              points={flattenedPoints}
              stroke="black"
              fill='#00D2FF'
              opacity={0.3}
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
                  onDragEnd={(e) => handleDragEndPoint(e, index)}
                  draggable
                  {...startPointAttr}
                />
              );
            })}
          </Layer>
        </Stage>

        <div className="flex space-x-3">
          <Button style={{ backgroundColor: "#209669", color: "#ffffff", }} onClick={() => props.onFinish && props.onFinish(this.state.points)}><SaveOutlined /> Хадгалах</Button>
          <Button onClick={() => this.setState({
            points: [],
            isFinished: false,
            isMouseOverStartPoint: false
          })} ><ClearOutlined />Шинээр зурах</Button>
        </div>
      </div>
    );
  }
}

export default App
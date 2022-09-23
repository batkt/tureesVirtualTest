import { ClearOutlined, SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo, useState } from "react";
import { Stage, Layer, Line, Image, Circle } from "react-konva";
import { url } from "services/uilchilgee";

export const undur = window.innerHeight - 155;
export const urgun = window.innerWidth - 50;

export function bairshilKhurvuuljAvakh(points) {
  const data =
    points?.map((mur) => {
      mur[0] = (mur[0] * urgun) / 1000;
      mur[1] = (mur[1] * undur) / 1000;
      return mur;
    }) || [];
  return JSON.parse(JSON.stringify(data));
}

function khurvuuljYavuulakh(points) {
  return (
    points?.map((mur) => {
      mur[0] = (mur[0] * 1000) / urgun;
      mur[1] = (mur[1] * 1000) / undur;
      return mur;
    }) || []
  );
}

class URLImage extends React.Component {
  state = {
    image: null,
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
      image: this.image,
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

function Drawer(props) {
  const [points, setPoints] = useState(
    bairshilKhurvuuljAvakh(props.points) || []
  );
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(true);
  const [isFinished, setIsFinished] = useState(true);

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  const handleClick = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) setIsFinished(true);
    else setPoints([...points, mousePos]);
  };

  const handleMouseMove = (event) => {
    const stage = event.target.getStage();
    if (isFinished) return;
    const mousePos = getMousePos(stage);
    setCurMousePos(mousePos);
  };
  const handleMouseOverStartPoint = (event) => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverStartPoint(true);
  };
  const handleMouseOutStartPoint = (event) => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverStartPoint(false);
  };
  const handleDragStartPoint = (event) => {
    console.log("start", event);
  };
  const handleDragEndPoint = (event, index) => {
    const pos = [event.target.attrs.x, event.target.attrs.y];
    points[index] = pos;
    setPoints([...points]);
  };

  const flattenedPoints = useMemo(() => {
    return points
      .concat(isFinished ? [] : curMousePos)
      .reduce((a, b) => a.concat(b), []);
  }, [isFinished, curMousePos, points]);

  const plan = useMemo(() => {
    const barilga = props.baiguullaga?.barilguud?.find(
      (a) => a._id === props.barilgiinId
    );
    return barilga?.davkharuud?.find((a) => a.davkhar === props.davkhar)
      ?.planZurag;
  }, [props]);

  if (!plan)
    return (
      <div className="space-y-6">
        <div className="flex justify-center pt-10 text-4xl text-gray-400 dark:text-red-100">
          План зураг оруулаагүй байна
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
    );

  return (
    <div>
      <Stage
        width={urgun}
        height={undur}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <URLImage
            width={urgun}
            height={undur}
            src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${plan}`}
          />

          <Line
            points={flattenedPoints}
            stroke="black"
            fill="#00D2FF"
            opacity={0.3}
            strokeWidth={5}
            closed={isFinished}
          />
          {points.map((point, index) => {
            const width = 6;
            const x = point[0];
            const y = point[1];

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
                onDblClick={() => setIsFinished(true)}
                draggable
                hitStrokeWidth={12}
                onMouseOver={
                  index === 0 ? handleMouseOverStartPoint : undefined
                }
                onMouseOut={index === 0 ? handleMouseOutStartPoint : undefined}
              />
            );
          })}
        </Layer>
      </Stage>

      <div className="flex space-x-3">
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() =>
            props.onFinish && props.onFinish(khurvuuljYavuulakh(points))
          }
        >
          <SaveOutlined /> Хадгалах
        </Button>
        <Button
          onClick={() => {
            setPoints([]);
            setIsFinished(false);
            setIsMouseOverStartPoint(false);
          }}
        >
          <ClearOutlined />
          Шинээр зурах
        </Button>
      </div>
    </div>
  );
}

export default Drawer;

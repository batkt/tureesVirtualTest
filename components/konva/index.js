import { ClearOutlined, SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import {
  Stage,
  Layer,
  Line,
  Image,
  Circle,
  Group,
  Rect,
  Text,
} from "react-konva";
import uilchilgee, { url } from "services/uilchilgee";

export const undur = window.innerHeight - 155 - 75;
export const urgun = window.innerWidth - 75;

export function bairshilKhurvuuljAvakh(points, gereeEsekh) {
  const data =
    points?.map((mur) => {
      mur[0] = (mur[0] * (!!gereeEsekh ? 650 : urgun)) / 1000;
      mur[1] = (mur[1] * (!!gereeEsekh ? 500 : undur)) / 1000;
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
    bairshilKhurvuuljAvakh(props.points, props?.talbaiGereendKharakh) || []
  );
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [talbainuud, setTalbainuud] = useState([]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(
    !!props.points || false
  );
  const [isFinished, setIsFinished] = useState(!!props.points || false);

  useEffect(() => {
    const barilga = props.baiguullaga?.barilguud?.find(
      (a) => a._id === props.barilgiinId
    );
    uilchilgee(props.token)
      .get("/talbai", {
        params: {
          query: {
            _id: { $nin: props._id },
            davkhar: props.davkhar,
            barilgiinId: barilga?._id,
            "bairshil.1": { $exists: true },
          },
          select: { bairshil: 1, _id: 1, idevkhiteiEsekh: 1, kod: 1 },
          khuudasniiKhemjee: 1000,
        },
      })
      .then(({ data }) => {
        data.jagsaalt.map(
          (mur) =>
            (mur.bairshil = bairshilKhurvuuljAvakh(
              mur.bairshil,
              props?.talbaiGereendKharakh
            ))
        );
        setTalbainuud(data.jagsaalt);
      });
  }, []);

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
    event.target.scale({ x: 2, y: 2 });
  };
  const handleDragEndPoint = (event, index) => {
    event.target.scale({ x: 1, y: 1 });
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
      <div className="space-y-6 ">
        <div className="flex justify-center pt-10 text-4xl text-gray-400 dark:text-red-100">
          {t("План зураг оруулаагүй байна")}
        </div>
        <div className="flex justify-center ">
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
    <div className="flex flex-col">
      <div className="flex justify-end space-x-3 pb-3 print:hidden">
        <div className="flex space-x-3 border-2 border-dashed p-1">
          <div className="h-5 w-5 border-2 bg-green-400"></div>
          <div> {t("Идэвхтэй")}</div>
        </div>
        <div className="flex space-x-3 border-2 border-dashed p-1">
          <div className="h-5 w-5 border-2 bg-red-400"></div>
          <div>{t("Идэвхгүй")} </div>
        </div>
      </div>
      <Stage
        width={!!props?.talbaiGereendKharakh ? 650 : urgun}
        height={!!props?.talbaiGereendKharakh ? 500 : undur}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <URLImage
            width={!!props?.talbaiGereendKharakh ? 650 : urgun}
            height={!!props?.talbaiGereendKharakh ? 500 : undur}
            src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${plan}`}
          />
          {talbainuud?.map((mur) => {
            const flattenedPoints = mur.bairshil.reduce(
              (a, b) => a.concat(b),
              []
            );
            return (
              <Line
                key={mur._id}
                points={flattenedPoints}
                stroke="black"
                fill={mur.idevkhiteiEsekh ? "lightgreen" : "red"}
                opacity={0.3}
                strokeWidth={5}
                closed={true}
              />
            );
          })}
          {talbainuud?.map((mur) => {
            const x =
              mur.bairshil?.reduce((a, b) => {
                return a + b[0];
              }, 0) / mur.bairshil.length;
            const y =
              mur.bairshil?.reduce((a, b) => {
                return a + b[1];
              }, 0) / mur.bairshil.length;
            return (
              <Group>
                <Rect
                  x={x - (mur.kod.length / 2) * 15}
                  y={y - 15}
                  width={50}
                  height={26}
                  fill="white"
                  stroke={1}
                  opacity={0.9}
                />
                <Text
                  key={mur._id + "text"}
                  x={x - (mur.kod.length / 2) * 10}
                  y={y - 15 / 2}
                  text={mur.kod}
                  fill={"black"}
                  fontSize={15}
                  align="center"
                />
              </Group>
            );
          })}
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
                key={`${index}circle`}
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
                strokeHitEnabled
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

      {!props?.talbaiGereendKharakh && (
        <div className="flex items-center justify-between space-x-3">
          <div className="space-x-3 space-y-2 ">
            <Button
              style={{ backgroundColor: "#209669", color: "#ffffff" }}
              onClick={() =>
                props.onFinish && props.onFinish(khurvuuljYavuulakh(points))
              }
            >
              <SaveOutlined /> {t("Хадгалах")}
            </Button>
            <Button
              onClick={() => {
                setPoints([]);
                setIsFinished(false);
                setIsMouseOverStartPoint(false);
              }}
            >
              <ClearOutlined className="pr-2 dark:text-white" />
              <p className="dark:text-white">{t("Шинээр зурах")}</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drawer;

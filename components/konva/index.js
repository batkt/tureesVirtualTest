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
  Path,
} from "react-konva";
import uilchilgee, { url } from "services/uilchilgee";

export const undur = window.innerHeight - 155 - 75;
export const urgun = window.innerWidth - 75;

export function bairshilKhurvuuljAvakh(points, gereeEsekh) {
  const data =
    points?.map((mur) => {
      return [
        (mur[0] * (!!gereeEsekh ? 650 : urgun)) / 1000,
        (mur[1] * (!!gereeEsekh ? 500 : undur)) / 1000,
      ];
    }) || [];
  return JSON.parse(JSON.stringify(data));
}

function khurvuuljYavuulakh(points) {
  return (
    points?.map((mur) => {
      return [(mur[0] * 1000) / urgun, (mur[1] * 1000) / undur];
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
  const isMultiple = props.talbaiGereendKharakh && Array.isArray(props.points?.[0]);
  const initialPoints = isMultiple
    ? props.points.map((p) => bairshilKhurvuuljAvakh(p, true))
    : bairshilKhurvuuljAvakh(props.points, props?.talbaiGereendKharakh) || [];

  const [points, setPoints] = useState(initialPoints);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [talbainuud, setTalbainuud] = useState([]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(
    !!props.points || false
  );
  const [isFinished, setIsFinished] = useState(!!props.points || false);
  const [imageError, setImageError] = useState(false);
  const [pointer, setPointer] = useState(null);

  useEffect(() => {
    const barilga = props.baiguullaga?.barilguud?.find(
      (a) => a._id === props.barilgiinId
    );
    uilchilgee(props.token)
      .get("/talbai", {
        params: {
          query: {
            _id: { $nin: Array.isArray(props._id) ? props._id : [props._id] },
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

  const zoomSettings = useMemo(() => {
    return { scale: 1, x: 0, y: 0 };
  }, [points, props?.talbaiGereendKharakh, isMultiple]);

  const plan = useMemo(() => {
    const barilga = props.baiguullaga?.barilguud?.find(
      (a) => a._id === props.barilgiinId
    );
    return barilga?.davkharuud?.find((a) => String(a.davkhar) === String(props.davkhar))
      ?.planZurag;
  }, [props]);

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
        scaleX={zoomSettings.scale}
        scaleY={zoomSettings.scale}
        x={zoomSettings.x}
        y={zoomSettings.y}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
        className="rounded-lg border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/50"
      >
        <Layer>
          {(!plan || imageError) && (
            <Group x={(!!props?.talbaiGereendKharakh ? 650 : urgun) / 2 - 100} y={(!!props?.talbaiGereendKharakh ? 500 : undur) / 2 - 100}>
              <Rect
                width={200}
                height={200}
                fill="white"
                cornerRadius={20}
                shadowBlur={10}
                shadowOpacity={0.1}
                opacity={0.5}
              />
              <Path
                data="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                fill="#94a3b8"
                scaleX={4}
                scaleY={4}
                x={50}
                y={50}
                opacity={0.2}
              />
              <Text
                text={imageError ? t("Ачаалахад алдаа гарлаа") : t("План зураг оруулаагүй")}
                width={200}
                y={160}
                align="center"
                fontSize={14}
                fill="#64748b"
              />
            </Group>
          )}
          {plan && !imageError && (
            <URLImage
              width={!!props?.talbaiGereendKharakh ? 650 : urgun}
              height={!!props?.talbaiGereendKharakh ? 500 : undur}
              src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${plan}`}
              onError={() => setImageError(true)}
            />
          )}
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
                fill={
                  pointer?._id === mur._id
                    ? mur.idevkhiteiEsekh
                      ? "#B7DC96"
                      : "pink"
                    : mur.idevkhiteiEsekh
                    ? "green"
                    : "red"
                }
                opacity={0.3}
                strokeWidth={2}
                hitStrokeWidth={20}
                closed={true}
                onMouseEnter={() => setPointer(mur)}
                onMouseLeave={() => setPointer(null)}
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
                <Group key={mur._id + "text"} listening={false}>
                  <Text
                    x={x - (mur.kod.length * 4) / 2}
                    y={y - 12 / 2}
                    text={mur.kod}
                    fill={"black"}
                    fontSize={11}
                    fontStyle="bold"
                    stroke="white"
                    strokeWidth={0.2}
                    align="center"
                    opacity={0.5}
                  />
                </Group>
              );
            })}
          {isMultiple ? (
            points.map((p, idx) => (
              <React.Fragment key={idx}>
                <Line
                  points={p.flat()}
                  stroke="#10b981"
                  lineJoin="round"
                  fill={
                    props.units?.[idx]?.idevkhiteiEsekh ? "#34d399" : "#ef4444"
                  }
                  opacity={0.85}
                  strokeWidth={3 / zoomSettings.scale}
                  shadowColor="#10b981"
                  shadowBlur={15}
                  shadowOpacity={0.8}
                  closed={true}
                />
                {/* Render label for the contract unit */}
                {props.units?.[idx] && (
                  <Group
                    listening={false}
                    x={
                      p.reduce((sum, pt) => sum + pt[0], 0) / p.length -
                      (props.units[idx].kod.length * 4) / 2 / zoomSettings.scale
                    }
                    y={p.reduce((sum, pt) => sum + pt[1], 0) / p.length - 12 / 2 / zoomSettings.scale}
                  >
                    <Text
                      text={props.units[idx].kod}
                      fill={"black"}
                      fontSize={11 / zoomSettings.scale}
                      fontStyle="bold"
                      stroke="white"
                      strokeWidth={0.2 / zoomSettings.scale}
                      align="center"
                    />
                  </Group>
                )}
              </React.Fragment>
            ))
          ) : (
            props.talbaiGereendKharakh &&
            props.units?.[0] && (
              <React.Fragment>
                <Line
                  points={points.flat()}
                  stroke="#10b981"
                  lineJoin="round"
                  fill={props.units[0].idevkhiteiEsekh ? "#34d399" : "#ef4444"}
                  opacity={0.85}
                  strokeWidth={3 / zoomSettings.scale}
                  shadowColor="#10b981"
                  shadowBlur={15}
                  shadowOpacity={0.8}
                  closed={true}
                />
                <Group
                  listening={false}
                  x={
                    points.reduce((sum, pt) => sum + pt[0], 0) / points.length -
                    (props.units[0].kod.length * 4) / 2 / zoomSettings.scale
                  }
                  y={
                    points.reduce((sum, pt) => sum + pt[1], 0) / points.length -
                    12 / 2 / zoomSettings.scale
                  }
                >
                  <Text
                    text={props.units[0].kod}
                    fill={"black"}
                    fontSize={11 / zoomSettings.scale}
                    fontStyle="bold"
                    stroke="white"
                    strokeWidth={0.2 / zoomSettings.scale}
                    align="center"
                  />
                </Group>
              </React.Fragment>
            )
          )}

          {!isMultiple && !props.talbaiGereendKharakh && points.length > 0 && (
            <Line
              points={flattenedPoints}
              stroke="#737185ff"
              lineJoin="round"
              fill={isFinished ? "#a6d2f5ff" : "transparent"}
              opacity={0.85}
              strokeWidth={3 / zoomSettings.scale}
              shadowColor="#6d6a7dff"
              shadowBlur={15}
              shadowOpacity={0.8}
              closed={isFinished}
            />
          )}

          {!isMultiple && points.map((point, index) => {
            const width = 6;
            const x = point[0];
            const y = point[1];

            return (
              <Circle
                key={`${index}circle`}
                x={x}
                y={y}
                width={width / zoomSettings.scale}
                height={width / zoomSettings.scale}
                fill="white"
                stroke="black"
                strokeWidth={1 / zoomSettings.scale}
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

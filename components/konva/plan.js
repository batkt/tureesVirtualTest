import useJagsaalt from "hooks/useJagsaalt";
import { t } from "i18next";
import _ from "lodash";
import React, { Component, useMemo } from "react";
import { Stage, Layer, Line, Image, Text, Group, Rect, Path } from "react-konva";
import { url } from "services/uilchilgee";
import { undur, urgun } from ".";

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

const select = {
  gereeniiDugaar: 1,
  ner: 1,
  mail: 1,
};

function ToolTip({ pointer, baiguullaga, token }) {
  const query = useMemo(() => {
    return {
      talbainIdnuud: { $in: [pointer?._id] },
      baiguullagiinId: baiguullaga._id,
      barilgiinId: pointer?.barilgiinId,
      tuluv: "1",
    };
  }, [pointer?._id, pointer?.barilgiinId, baiguullaga._id]);

  const gereeMedeelel = useJagsaalt(
    pointer?.kod && "/geree",
    query,
    undefined,
    select,
    undefined,
    token,
  );
  return (
    <Group>
      <Rect
        x={pointer.x + 15}
        y={pointer.y - 5}
        cornerRadius={15}
        width={pointer.idevkhiteiEsekh === true ? 260 : 200}
        height={pointer.idevkhiteiEsekh === true ? 123 : 85}
        fill={pointer.col}
        stroke={1}
        opacity={0.9}
      />

      <Text
        x={pointer.x + 30}
        y={pointer.y + 10}
        text={`${t("Талбайн Дугаар")}:`}
        fill={"black"}
        fontSize={15}
        fontStyle="bold"
        align="center"
      />
      <Text
        x={pointer.x + 155}
        y={pointer.y + 10}
        text={pointer.kod}
        fill={"black"}
        fontSize={15}
        align="left"
      />
      <Text
        x={pointer.x + 30}
        y={pointer.y + 30}
        text={`${t("Талбайн Хэмжээ")}:`}
        fill={"black"}
        fontSize={15}
        fontStyle="bold"
        align="center"
      />
      <Text
        x={pointer.x + 163}
        y={pointer.y + 30}
        text={pointer.talbainKhemjee}
        fill={"black"}
        fontSize={15}
        align="left"
      />
      <Text
        x={pointer.x + 30}
        y={pointer.y + 50}
        text={`${t("Талбайн үнэ")}:`}
        fill={"black"}
        fontSize={15}
        fontStyle="bold"
        align="center"
      />
      <Text
        x={pointer.x + 130}
        y={pointer.y + 50}
        text={pointer.talbainNiitUne}
        fill={"black"}
        fontSize={15}
        align="left"
      />
      {pointer.idevkhiteiEsekh === true && (
        <Text
          x={pointer.x + 31}
          y={pointer.y + 70}
          text={`${t("Гэрээний Дугаар")}:`}
          fill={"black"}
          fontSize={15}
          fontStyle="bold"
          align="center"
        />
      )}
      {pointer.idevkhiteiEsekh === true && (
        <Text
          x={pointer.x + 164}
          y={pointer.y + 70}
          text={_.get(gereeMedeelel, "jagsaalt.0.gereeniiDugaar")}
          fill={"black"}
          fontSize={15}
          align="center"
        />
      )}
      {pointer.idevkhiteiEsekh === true && (
        <Text
          x={pointer.x + 30}
          y={pointer.y + 90}
          text={`${t("Эзэмшигчийн нэр")}:`}
          fill={"black"}
          fontSize={15}
          fontStyle="bold"
          align="center"
        />
      )}
      {pointer.idevkhiteiEsekh === true && (
        <Text
          x={pointer.x + 172}
          y={pointer.y + 90}
          text={_.get(gereeMedeelel, "jagsaalt.0.ner")}
          fill={"black"}
          fontSize={15}
          align="center"
        />
      )}
    </Group>
  );
}

class App extends Component {
  state = {
    isMouseOverStartPoint: !!this.props.points?.length || false,
    isFinished: !!this.props.points?.length || false,
    imageError: false,
    pointer: null,
  };

  escDarakh = (e) => {
    if (e.key === "Escape") {
      this.props.destroy();
    }
  };
  componentDidMount() {
    document.addEventListener("keyup", this.escDarakh);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.escDarakh);
  }

  destroy() {
    this.props.destroy();
  }
  render() {
    const {
      state: { pointer, imageError },
      props,
    } = this;
    const talbainuud = props.talbainuud;

    return (
      <div className="flex flex-col">
        <div className="flex space-x-3">
          <div className="flex h-8 w-full items-end justify-end space-x-10 pb-1 ">
            <div className="flex">
              <div className="w-5 border-2 bg-green-300 " />
              <div className="pl-2 pr-10">{t("Идэвхтэй")}</div>
            </div>
            <div className="flex ">
              <div className="w-5 border-2 bg-red-400 " />
              <div className="pl-2">{t("Идэвхгүй")}</div>
            </div>
          </div>
        </div>

        <Stage width={urgun} height={undur} className="rounded-lg border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/50">
          <Layer>
            {(!props.plan || imageError) && (
              <Group x={urgun / 2 - 100} y={undur / 2 - 100}>
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
            {props.plan && !imageError && (
              <URLImage
                width={urgun}
                height={undur}
                src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${props.plan}`}
                onError={() => this.setState({ imageError: true })}
              />
            )}
            {talbainuud?.map((mur) => {
              const flattenedPoints = mur.bairshil.reduce(
                (a, b) => a.concat(b),
                [],
              );
              return (
                <Line
                  onMouseMove={(e) => {
                    this.setState({
                      pointer: {
                        col: "white",
                        _id: mur._id,
                        x: e.evt.layerX,
                        y: e.evt.layerY,
                        kod: mur.kod,
                        idevkhiteiEsekh: mur.idevkhiteiEsekh,
                        talbainNiitUne: mur.talbainNiitUne,
                        talbainKhemjee: mur.talbainKhemjee,
                        barilgiinId: mur.barilgiinId,
                      },
                    });
                  }}
                  onMouseLeave={(e) => {
                    this.setState({
                      pointer: undefined,
                    });
                  }}
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
                <Group key={mur._id + "text"}>
                  <Text
                    x={x - (mur.kod.length * 4) / 2}
                    y={y - 15 / 2}
                    fontStyle="bold"
                    text={mur.kod}
                    stroke="white"
                    strokeWidth={0.3}
                    fill={"black"}
                    fontSize={13}
                    align="center"
                  />
                </Group>
              );
            })}

            {pointer && (
              <ToolTip
                pointer={pointer}
                baiguullaga={props.baiguullaga}
                token={props.token}
              />
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;

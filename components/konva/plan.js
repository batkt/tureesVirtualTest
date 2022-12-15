import { Select, Form } from "antd";
import useJagsaalt from "hooks/useJagsaalt";
import _ from "lodash";
import React, { Component, useEffect, useMemo } from "react";
import { Stage, Layer, Line, Image, Text, Group, Rect } from "react-konva";
import uilchilgee, { url } from "services/uilchilgee";
import { bairshilKhurvuuljAvakh, undur, urgun } from ".";

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
  talbainKhemjee: 1,
  talbainNiitUne: 1,
};

function ToolTip({ pointer }) {
  const query = useMemo(() => {
    return {
      talbainIdnuud: pointer?._id,
    };
  }, [pointer?._id]);

  const gereeMedeelel = useJagsaalt(
    pointer?.kod && "/geree",
    query,
    undefined,
    select
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
        text={"Талбайн Дугаар:"}
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
        text={"Талбайн Хэмжээ:"}
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
        text={"Талбайн үнэ:"}
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
          text={"Гэрээний Дугаар:"}
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
          text={"Эзэмшигчийн нэр:"}
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
      state: { pointer },
      props,
    } = this;
    const talbainuud = props.talbainuud.filter(
      (mur) => mur.davkhar === props.davkhar
    );

    console.log(talbainuud);

    return (
      <div>
        <div className="flex space-x-3">
          <div className=" flex h-8 w-full  items-end justify-end space-x-10 pb-1 ">
            <div className="flex">
              <div className="w-5 border-2 bg-green-300 " />
              <div className="pr-10 pl-2">Идэвхтэй</div>
            </div>
            <div className="flex ">
              <div className="w-5 border-2 bg-red-400 " />
              <div className="pl-2">Идэвхгүй</div>
            </div>
          </div>
        </div>

        <Stage width={urgun} height={undur - 75}>
          <Layer>
            {props.plan && (
              <URLImage
                width={urgun}
                height={undur}
                src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${props.plan}`}
              />
            )}
            {talbainuud?.map((mur) => {
              const flattenedPoints = mur.bairshil.reduce(
                (a, b) => a.concat(b),
                []
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
                  <Rect
                    x={x - (mur.kod.length / 2) * 15}
                    y={y - 15}
                    width={65}
                    height={26}
                    fill="white"
                    stroke={1}
                    opacity={0.9}
                  />
                  <Text
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

            {pointer && <ToolTip pointer={pointer} />}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;

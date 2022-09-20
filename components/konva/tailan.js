import { Select, Form } from "antd";

import React, { Component } from "react";
import { Stage, Layer, Line, Image, Text, Circle, Group, Rect } from "react-konva";
import uilchilgee, { url } from "services/uilchilgee";
import { bairshilKhurvuuljAvakh, undur, urgun } from ".";

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
    isMouseOverStartPoint: !!this.props.points?.length || false,
    isFinished: !!this.props.points?.length || false
  };

  componentDidMount() {
    const barilga = this.props.baiguullaga?.barilguud?.find(a => a._id === this.props.barilgiinId)

    if (!barilga?.davkharuud[0] || !this.props.token)
      console.log('barilga algoo')
    else {
      this.setState({
        planZurag: barilga.davkharuud[0]?.planZurag
      })
      this.tailbaiAvya(barilga.davkharuud[0].davkhar, barilga)
    }
  }

  tailbaiAvya = (davkhar, barilga) => {
    uilchilgee(this.props.token).get('/talbai', { params: { query: { davkhar, barilgiinId: barilga?._id, "bairshil.1": { '$exists': true } }, select: { bairshil: 1, _id: 1, idevkhiteiEsekh: 1, kod: 1 }, khuudasniiKhemjee: 1000 } }).then(({ data }) => {

      data.jagsaalt.map(mur => mur.bairshil = bairshilKhurvuuljAvakh(mur.bairshil))
      this.setState({
        talbainuud: data.jagsaalt
      })
    })
  }
  render() {
    const {
      state: { planZurag, talbainuud },
      props
    } = this;
    const barilga = props.baiguullaga?.barilguud?.find(a => a._id === props.barilgiinId)

    return (
      <div>
        <div className="flex space-x-3">
          <Form.Item
            name="davkhar"
          >
            <Select
              placeholder="Давхар сонгох"
              onChange={(v, option) => {
                this.tailbaiAvya(option?.davkhar, barilga)
                this.setState({ planZurag: v })
              }}
              allowClear
            >
              {barilga?.davkharuud.map((a) => (
                <Select.Option key={a._id} value={a.planZurag} davkhar={a.davkhar}   >
                  {a.davkhar}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className=" items-end w-full pb-1  h-8 flex justify-end space-x-10 " >
            <div className="flex">
              <div className="border-2 w-5 bg-green-300 " />
              <div className="pr-10 pl-2">Идэвхгүй</div>
            </div>
            <div className="flex ">
              <div className="border-2 w-5 bg-red-400 " />
              <div className="pl-2">Идэвхтэй</div>
            </div>
          </div>
        </div>

        <Stage
          width={urgun}
          height={undur}
        >

          <Layer>
            {planZurag && <URLImage width={urgun} height={undur} src={`${url}/zuragAvya/plan/${props.baiguullaga._id}/${planZurag}`} />}
            {talbainuud?.map((mur) => {
              const flattenedPoints = mur.bairshil
                .reduce((a, b) => a.concat(b), []);
              return (
                <Line
                  key={mur._id}
                  points={flattenedPoints}
                  stroke="black"
                  fill={mur.idevkhiteiEsekh ? 'red' : 'lightgreen'}
                  opacity={0.3}
                  strokeWidth={5}
                  closed={true}
                />
              )
            }
            )}
            {talbainuud?.map((mur) => {
              const x = mur.bairshil?.reduce((a, b) => { return a + b[0] }, 0) / mur.bairshil.length
              const y = mur.bairshil?.reduce((a, b) => { return a + b[1] }, 0) / mur.bairshil.length
              return (
                <Group  >
                  <Rect x={x - (mur.kod.length / 2 * 15)} y={y - (15)} width={50} height={26} fill="white" stroke={1} opacity={0.9} />
                  <Text
                    key={mur._id + 'text'}
                    x={x - (mur.kod.length / 2 * 10)}
                    y={y - (15 / 2)}
                    text={mur.kod}
                    fill={'black'}
                    fontSize={15}
                    align="center"
                  />
                </Group>
              )
            })}
          </Layer>
        </Stage >


      </div >
    );
  }
}

export default App
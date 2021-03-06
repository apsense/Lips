import React from 'react';
import man from './photos/man.jpg';
import man2 from './photos/man2.jpg';
import man3 from './photos/man3.jpg';
import {LipsChanger} from './LipsChanger';
import {SketchPicker} from 'react-color';
import Slider from 'rc-slider';
import styled from "styled-components";
import 'rc-slider/assets/index.css';
import woman1 from './photos/face.jpeg';
import woman2 from './photos/woman2.jpg';
import woman3 from './photos/woman3.jpg';
import Gallery from "./Gallery";
import ru from "./translations/ru";
import en from "./translations/en";

const Container = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 1rem;
    display: flex;
    overflow-y: scroll;
    flex-direction: ${window.innerWidth < 1024 ? "column": "row"}
`;

const Tools = styled.div`
    width: ${window.innerWidth > 1024 ? "250px" : "100%"};
    display: flex;
    flex-direction: column;
`;

const InputTitle = styled.div`
    font-size: 20px;
    font-weight: 600;
`;

const ImgContainer = styled.div`
    display: flex;
    width:  ${window.innerWidth > 1024 ? "90%": "calc(100% - 1rem)"};
    min-height: ${window.innerWidth > 1024 ? "unset": "100%" };
    overflow: hidden;
    
    border: 2px solid #ebebeb;
    padding: 0.5rem;
    border-radius: 5px;
`;

const ErrorContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  
  
  font-size: 18px;
  color: #FFF;
  background-color: #AA1111;
  
  padding: 0.5rem 0;
`;

const UploadButtonWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  min-height: 3rem;

  .btn {
    width: 100%;
    border: 2px solid gray;
    color: gray;
    background-color: white;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 10px;
  }
  
  input[type=file] {
    display: none;
  }
`;

const InlineWrapper = styled.div`
  
  display: flex;
`;

const Button = styled.a`
  border-right: 1px solid #000;
  margin-right: 1rem;
  padding-right: 1rem;
  color: #003377;
  cursor: pointer;
  
  :first-child {
    padding-left: 0;
  };
  :last-child {
    padding: 0;
    margin: 0;
    border: none;
  };
`;

const defaultPhotos = [
  man, man2, man3, woman1, woman2, woman3
];

const presetColors = [
  "#001399",
  "#101399",
  "#201399",
  "#203399",
  "#206399",
  "#252122",
  "#656162",
  "#151112",
  "#050102",
  "#993366",
  "#4E1A35",
  "#5E1A35",
  "#6E1A35",
  "#7E1A35",
  "#8E1A35",
  "#AE1A35",
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.lipsChangerRef = 'changer';
    this.state = {
      img: props.img || man,
      color: {
        r: 255,
        g: 0,
        b: 0,
        a: 1
      },
      alpha: 0.5,
      lang: "ru",
      error: null
    }
  }
  async changeImage(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    this.refs[this.lipsChangerRef].updateImage(URL.createObjectURL(file));
  }
  async onChangeColor({rgb: color}) {
    this.setState({color});
    this.refs[this.lipsChangerRef].reDraw();
  }
  changeAlpha(alpha){
    this.setState({alpha});
    this.refs[this.lipsChangerRef].reDraw();
  }
  setError(error) {
    this.setState({error});
  }
  onSelectPhoto(img) {
    this.refs[this.lipsChangerRef].updateImage(img);
  }
  changeLang(lang) {
    this.setState({lang})
  }
  render() {
    const {img, color, alpha, error, lang} = this.state;
    const dictionary = lang === "ru" ? ru : en;
    const fileUpload = () => {
      const uploadInput = document.getElementById("photo-input");
      uploadInput.click();
    };

    return (
      <Container>
        <Tools>
          <UploadButtonWrapper>
            <button className="btn" onClick={fileUpload}>{dictionary.uploadPhoto}</button>
            <input id="photo-input" type="file" name="photo" accept="image/*,image/jpeg" onChange={this.changeImage.bind(this)}/>
          </UploadButtonWrapper>
          <InputTitle style={{marginTop: "2rem"}}>{dictionary.chooseColor}</InputTitle>
          <SketchPicker color={color} onChange={this.onChangeColor.bind(this)} presetColors={presetColors} disableAlpha={true}/>
          <InputTitle style={{marginTop: "2rem"}}>{dictionary.alpha} = ({alpha})</InputTitle>
          <Slider
            defaultValue={alpha}
            min={0}
            max={1}
            step={0.01}
            included={false}
            marks={{0: "0", 0.5: "0.5", 1: "1"}}
            onAfterChange={this.changeAlpha.bind(this)}
            style={{width: "90%"}}
          />
          <InputTitle style={{marginTop: "2rem"}}>{dictionary.defaultPhoto}</InputTitle>
          <Gallery photos={defaultPhotos} onSelect={this.onSelectPhoto.bind(this)} />
          <InputTitle style={{marginTop: "2rem"}}>{dictionary.chooseLang}</InputTitle>
          <InlineWrapper>
            <Button onClick={this.changeLang.bind(this, "ru")}>{dictionary.lang.ru}</Button>
            <Button onClick={this.changeLang.bind(this, "en")}>{dictionary.lang.en}</Button>
          </InlineWrapper>
        </Tools>
        <ImgContainer>
          <LipsChanger
            ref={this.lipsChangerRef} 
            src={img} 
            color={color}
            alpha={alpha}
            setError={this.setError.bind(this)}
          />
        </ImgContainer>
        {error && (
          <ErrorContainer id={"err-container"}>{dictionary.errors[error]}</ErrorContainer>
        )}
      </Container>
    );
  }
}

export default App;

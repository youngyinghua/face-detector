import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Logo from "./components/Logo/Logo";
import Register from "./components/Register/Register";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const initialState = {
  inputUrl: "",
  imgUrl: "",
  boxAreas: [],
  urlReady: false,
  route: "signin",
  isSignIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    entries: 0,
    joined: new Date(),
  },
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      inputUrl: "",
      imgUrl: "",
      boxAreas: [],
      urlReady: false,
      route: "signin",
      isSignIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        entries: 0,
        joined: new Date(),
      },
      //! if define boxAreas: {} when detecting multi faces, it will turn out boxAreas.map is not a function error.
      //! even the boxAreas appear to be an Array. Using for loop to store data to aother const,
      //! then map functon could be used. Or match data type in this.state at the first place!!!
      //! when detecting single face, {} works well.
    };
  }
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  getUrl = (event) => {
    this.setState({
      inputUrl: event.target.value,
      urlReady: false,
    });
  };

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({
        isSignIn: true,
      });
    } else if (route === "signout") {
      this.setState(initialState);
    }
    this.setState({
      route: route,
    });
  };

  getDetect = () => {
    this.setState({
      imgUrl: this.state.inputUrl,
      urlReady: true,
    });
    fetch("https://infinite-crag-07525.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: this.state.inputUrl,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const boundingregions = data.outputs[0].data.regions;
          const boundingBoxes = boundingregions.map(
            (region) => region.region_info.bounding_box
          );
          this.setState({ boxAreas: boundingBoxes });
          fetch("https://infinite-crag-07525.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              this.setState(Object.assign(this.state.user, { entries: data }));
            })
            .catch(console.log);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const {
      isSignIn,
      route,
      inputUrl,
      imgUrl,
      urlReady,
      boxAreas,
      user,
    } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <>
            <Logo />
            <Rank user={user} />
            <ImageLinkForm
              value={inputUrl}
              getDetect={this.getDetect}
              getUrl={this.getUrl}
            />
            <FaceRecognition
              imgUrl={imgUrl}
              boxAreas={boxAreas}
              urlReady={urlReady}
            />
          </>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;

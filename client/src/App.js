import React from 'react';
import ShortTermList from './ShortTermList.js';
import MediumTermList from './MediumTermList.js';
import LongTermList from './LongTermList.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import Button from 'react-bootstrap/Button'
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

//NEED TO FIGURE OUT HOW TO APPLY REFRESH TOKEN FOR DATA FETCH, CURRENTLY MANUALLY GENERATING NEW ACCESS TOKEN EVERY HOUR PER EXPIRATION.
const accessToken = 'BQCA0rlU0HzfAYEI8kZG1jTJ4qS7ySxZqHa_So085usSKtg5ofi5R6I6f_t0iYtJVUZBHHx8JtbRf6ZQpWFN20RcKCm8iCr1Z3K3-u_QxRcQ9V16u7Wo7QbVBrcLdSzcCc2ANneYmu5c8vfrgXyoBtx9lnwxam6FqNil9lgTi95V4kWed3kvqp6oP-YMHup367Kx5MVhJTC1HsWZy_f1';
const playlistToken = 'BQC_8KNl-lULEiiUrfd-ZGVmmxyZ24MJwyaofy6Gx8iALqkKjgzC6Yj15_NAuKD0M-5p-YRH6Hsn5aW40QHIzLTjSBFuHLVcJKbRP7GnpcNqORiTl0mUkaaFkjd_ccjYOcTHdkLfhT2SKQHMKgaFOMjHt9h3r819NveVv5dF7Y0af559DnACgmMZP_dusVu078LoY8nCQh144nvvbRKT';
class App extends React.Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      shortTermTrackData: [],
      mediumTermTrackData: [],
      longTermTrackData: [],
      activeTab: '',
    }
    this.createPlaylist = this.createPlaylist.bind(this);
    this.handleTab = this.handleTab.bind(this);
    this.getMyTopTracksLongTerm = this.getMyTopTracksLongTerm.bind(this);
    this.getMyTopTracksMediumTerm = this.getMyTopTracksMediumTerm.bind(this);
    this.getMyTopTracksShortTerm = this.getMyTopTracksShortTerm.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.getMyTopTracksShortTerm();
    this.getMyTopTracksMediumTerm();
    this.getMyTopTracksLongTerm();
  } 

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
  }

  getMyTopTracksShortTerm() {
    const that = this;
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', {headers: {"Authorization": `Bearer ${accessToken}`}})
    .then(function (response) {
      that.setState ({
        shortTermTrackData: response
      })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      that.setState({
        activeTab: 'shortTerm'
      })
    });
  }

  getMyTopTracksMediumTerm() {
    const that = this;
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {headers: {"Authorization": `Bearer ${accessToken}`}})
    .then(function (response) {
      that.setState ({
        mediumTermTrackData: response
      })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
    });
  }

  getMyTopTracksLongTerm() {
    const that = this;
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', {headers: {"Authorization": `Bearer ${accessToken}`}})
    .then(function (response) {
      that.setState ({
        longTermTrackData: response
      })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
    });
  }

  handleTab(key) {
    if (key === '1') {
      this.setState({ activeTab: 'shortTerm' })
    } else if (key === '2') {
      this.setState({ activeTab: 'mediumTerm' })
    } else if (key === '3') {
      this.setState({ activeTab: 'longTerm' })
    } 
  }

  // FINSIH IMPLEMENTING
  createPlaylist () {
    const tab = this.state.activeTab;
    if (tab === 'shortTerm') {
      const that = this;
      axios.post('https://api.spotify.com/v1/playlists/Your_Top_Songs(last_4_weeks)/tracks', {headers: {"Authorization": `Bearer ${playlistToken}`}})
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }

  handleScroll() {
    window.scroll({
      top: 560,
      behavior: 'smooth'
    });
  }

  render() {
    let list = 'CURRENTLY JUDGING YOUR MUSIC TASTE...';
    const tab = this.state.activeTab;
    const shortTermTracks = this.state.shortTermTrackData.data;
    const mediumTermTracks = this.state.mediumTermTrackData.data;
    const longTermTracks = this.state.longTermTrackData.data;
    const albumArt = this.state.nowPlaying.albumArt;
    const loggedIn = this.state.loggedIn;

    if (tab === 'shortTerm') {
      list = <ShortTermList data={shortTermTracks} />
    } else if (tab === 'mediumTerm') {
      list = <MediumTermList data={mediumTermTracks} />
    } else if (tab === 'longTerm') {
      list = <LongTermList data={longTermTracks} />
    }
    return (
      <div className="App">
        <Navbar fixed="top" class="navbar navbar-inverse navbar-fixed-top navbar-dark bg-dark">
          <div className="nav">
            {/* work on navbar */}
            <span><strong>BEAT SHARE</strong></span>
            <span className="playlist">
              {/* FINISH IMPLEMENTING */}
              <a id="playlistButton" href="https://open.spotify.com/playlist/0lXkQ5VGITG4FdiDkgoBoE" onClick={this.createPlaylist} >Create a playlist!</a>          
            </span>
            <span className="log">
              <a id="logButton" href='http://localhost:8888'>Logout</a>
            </span>
          </div>
        </Navbar>
        <br/>
        <br/>
        <div id="nowPlaying">
          <strong>Now Playing:  '{ this.state.nowPlaying.name }' </strong>
        </div>
        <div>
          {albumArt ? <img id="art" src={albumArt} style={{ height: 500 }}/> : null}
        </div>
        { loggedIn &&
          <button className="button" onClick={() => this.getNowPlaying()}>
            <strong>See what's playing</strong>
          </button>
        }
        <div className="container">
          <Tabs defaultActiveKey="1" className="nav-tabs" onSelect={this.handleTab} onClick={this.handleScroll}>
              { loggedIn &&
                <Tab eventKey="1" title="Last 4 weeks" className="Tab" >
                </Tab>
              }
              { loggedIn &&
                <Tab eventKey="2" title="Last 6 months" className="Tab">
                </Tab>
              }
              { this.state.loggedIn &&
                <Tab eventKey="3" title="Last couple years" className="Tab">
                </Tab>
              }
          </Tabs>
          <div className="list">
            {list}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

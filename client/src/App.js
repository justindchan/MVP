import React from 'react';
import ShortTermList from './ShortTermList.js';
import MediumTermList from './MediumTermList.js';
import LongTermList from './LongTermList.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import Button from 'react-bootstrap/Button'
import axios from 'axios';
import $ from 'jquery';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

//NEED TO FIGURE OUT HOW TO APPLY REFRESH TOKEN FOR DATA FETCH, CURRENTLY MANUALLY GENERATING NEW ACCESS TOKEN EVERY HOUR PER EXPIRATION.
let accessToken = '';

class App extends React.Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    accessToken = token;

    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      userId: '',
      shortTermTrackData: [],
      mediumTermTrackData: [],
      longTermTrackData: [],
      activeTab: '',
    }
    this.handleTab = this.handleTab.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getMyTopTracksLongTerm = this.getMyTopTracksLongTerm.bind(this);
    this.getMyTopTracksMediumTerm = this.getMyTopTracksMediumTerm.bind(this);
    this.getMyTopTracksShortTerm = this.getMyTopTracksShortTerm.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.makePlaylist = this.makePlaylist.bind(this);
  }
  
  componentDidMount() {
    this.getUserInfo();
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

  getUserInfo() {
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      this.setState({ userId: `${response.data.id}` })
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
    })
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
      .catch((response) => {
        console.log(response);
      })
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
  }

  getMyTopTracksShortTerm() {
    const that = this;
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": `application/json`
      }
    })
    .then(function (response) {
      that.setState ({ shortTermTrackData: response })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      that.setState({ activeTab: 'shortTerm' })
    });
  }

  getMyTopTracksMediumTerm() {
    const that = this;
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": `application/json`
      }
    })
    .then(function (response) {
      that.setState ({ mediumTermTrackData: response })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
    });
  }

  getMyTopTracksLongTerm() {
    const that = this;
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": `application/json`      
      }
    })
    .then(function (response) {
      that.setState ({ longTermTrackData: response })
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

  // FINSIH IMPLEMENTING (refactoring?)
  makePlaylist () {
    const shortTermTracks = this.state.shortTermTrackData.data;
    const mediumTermTracks = this.state.mediumTermTrackData.data;
    const longTermTracks = this.state.longTermTrackData.data;
    const userId = this.state.userId;
    const createUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
    let tab = this.state.activeTab;

    let shortTermUrisArr = [];
    shortTermTracks.items.map((track) => {shortTermUrisArr.push(track.uri)})
    let shortTermUris = {uris: shortTermUrisArr};
    
    let mediumTermUrisArr = [];
    mediumTermTracks.items.map((track) => {mediumTermUrisArr.push(track.uri)})
    let mediumTermUris = {uris: mediumTermUrisArr};

    let longTermUrisArr = [];
    longTermTracks.items.map((track) => {longTermUrisArr.push(track.uri)})
    let longTermUris = {uris: longTermUrisArr};

    if (tab === 'shortTerm') {
      const jsonData = {"name": "Your Favorite Songs Playlist (last 4 weeks)"};
      $.ajax({
        type: 'POST',
        url: createUrl,
        data: JSON.stringify(jsonData),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        success: function(playlistInfo) {
          console.log('Woo! :)');
          const playlistId = playlistInfo.id;
          const addUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
          $.ajax({
            type: 'POST',
            url: addUrl,
            data: JSON.stringify(shortTermUris),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            success: function(result) {
              window.location.href = playlistInfo.external_urls.spotify;
            },
            error: function() {
              console.log('Error! :((');
            }
          })
        },
        error: function() {
          console.log('Error! :(');
        }
      })
    } else if (tab === 'mediumTerm') {
      const jsonData = {"name": "Your Favorite Songs Playlist (last 6 months)"};
      $.ajax({
        type: 'POST',
        url: createUrl,
        data: JSON.stringify(jsonData),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        success: function(playlistInfo) {
          console.log('Woo! :)');
          const playlistId = playlistInfo.id;
          const addUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
          $.ajax({
            type: 'POST',
            url: addUrl,
            data: JSON.stringify(mediumTermUris),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            success: function(result) {
              window.location.href = playlistInfo.external_urls.spotify;
            },
            error: function() {
              console.log('Error! :((');
            }
          })
        },
        error: function() {
          console.log('Error! :(');
        }
      })
    } else if (tab === 'longTerm') {
      const jsonData = {"name": "Your Favorite Songs Playlist (last couple years)"};
      $.ajax({
        type: 'POST',
        url: createUrl,
        data: JSON.stringify(jsonData),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        success: function(playlistInfo) {
          console.log('Woo! :)');
          const playlistId = playlistInfo.id;
          const addUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
          $.ajax({
            type: 'POST',
            url: addUrl,
            data: JSON.stringify(longTermUris),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            success: function(result) {
              window.location.href = playlistInfo.external_urls.spotify;
            },
            error: function() {
              console.log('Error! :((');
            }
          })
        },
        error: function() {
          console.log('Error! :(');
        }
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
    let tab = this.state.activeTab;
    const shortTermTracks = this.state.shortTermTrackData.data;
    const mediumTermTracks = this.state.mediumTermTrackData.data;
    const longTermTracks = this.state.longTermTrackData.data;
    const albumArt = this.state.nowPlaying.albumArt;
    const loggedIn = this.state.loggedIn;
    const trackName = this.state.nowPlaying.name;

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
          <ul className="nav">
            {/* work on navbar */}
            <div className="logo">
              <li><strong>BEAT SHARE</strong></li>
              <li className="playlist">
                {/* FINISH IMPLEMENTING --href*/}
                <button className="playlistButton" onClick={this.makePlaylist}>Save as Spotify playlist!</button>          
              </li>
            </div>
            <li className="log">
              <button id="logButton" href='http://localhost:8888'>Logout</button>
            </li>
          </ul>
        </Navbar>
        <br/>
        <br/>
        <div id="nowPlaying">
          <strong>Now Playing:  '{ trackName }' </strong>
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
          <Tabs defaultActiveKey="1" className="tabs" onSelect={this.handleTab} onClick={this.handleScroll}>
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

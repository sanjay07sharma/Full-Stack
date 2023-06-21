/** @odoo-module **/

// import { registry } from "@web/core/registry";
const { Component, xml, mount, useState,useEffect, setup } = owl;
let audio = '';

class Player extends Component {
    static template = xml`
  <div style="position:absolute;bottom:0px">
    <h2 id="song-title">Song Title</h2>
    <div id="player-controls">
        <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
        <button id="play_btn" t-on-click="playThisSong">Play</button>
        <button id="stop-button" t-on-click="stopThisSong">Stop</button>
    </div>
  </div>`;
    playThisSong() {
      if (!audio) {
        return;
      }
      audio.play();
    }
    pauseThisSong() {
      if (!audio) {
        return;
      }
      audio.pause();
    }
    stopThisSong() {
      if (!audio) {
        return;
      }
      audio.pause();
      audio.currentTime = 0;
    }
  }

class SongItems extends Component {
    static template = xml`
  <div>
      <table>
          <t t-if="props.songitems[0]">
          <h2>Your Playlist</h2>
              <t t-foreach="props.songitems" t-as="song" t-key="song.id">
                  <tr>
                      <td>
                          <div>
                              <p id="song_name"><t t-out="song.name"/></p>
                              <button t-on-click="removeFromList" id="listadded" t-att-value="song.url">Remove</button>
                              <button t-attf-id="play-song-{{song.name}}" t-att-value="song.url" t-on-click="playThisSong">Play song</button>
                          </div>
                      </td>
                  </tr>
              </t>
          </t>
      </table>
  </div>
    `;

    removeFromList(ev) {
      const selectedSongUrl = ev.target.getAttribute('value');
      const selectedIndex = this.props.songitems.findIndex(song => song.url === selectedSongUrl);
      if (selectedIndex !== -1) {
        this.props.songitems.splice(selectedIndex, 1);
      }
    }

    playThisSong(ev) {
      // in case a audio is already playing stop it to play another.
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      const selectedSongUrl = ev.target.getAttribute('value');
      const selectedSong = this.props.songitems.find(song => song.url === selectedSongUrl);
      document.getElementById('song-title').textContent = selectedSong.name;
      audio = new Audio(selectedSongUrl);
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }

    static props = ['songitems']
}

class PlayList extends Component {
    static template = xml`
  <div style="float: right">
    <SongItems songitems="props.playlist"/>
  </div>
    `;

    static props = ['playlist'];
    static components = { SongItems };
}
/*The logic-less templating syntax used in this code is provided by the JavaScript library called "Template7".
It's a templating engine that allows you to generate HTML markup by embedding JavaScript expressions inside template strings.
The syntax uses double curly braces ({{}}) 
to delimit JavaScript expressions, and the expressions can contain variables, operators, and function calls.
The t-attf-id and t-on-click attributes are Template7-specific attributes that allow you to bind values and events to HTML elements.
The {{album.name}} expression inside the t-attf-id attribute references the name property of the album object passed as a parameter to the component.
Template7 also provides other features such as conditionals, loops, and helpers to make templating more flexible and powerfuL
*/
class MusicData extends Component {
    static template = xml`
    <div id="MusicList" style="float:left">
    <table>
      <t t-if="props.albumdata[0] and props.albumdata[0] !== 'Album not Found'">
        <tr>
          <td>
            <t t-foreach="props.albumdata[0]" t-as="album" t-key="album.id">
              <div>
                <p><t t-out="album.name"/></p>
                <button t-attf-id="{{album.name}}" t-on-click="openAlbum">Open Album</button>
              </div>
            </t>
          </td>
        </tr>
      </t>
      <t t-if="albumHasSong[0] or (props.musicdata[0])">
        <ul id="songConatiner">
          <t t-if="props.musicdata[0] !== 'Song not Found'">
            <h2>List of Songs</h2>
            <t t-foreach="props.musicdata[0]" t-as="song" t-key="song.id">
              <li>
                <p><t t-out="song.name"/></p>
                <button t-attf-id="add-song-{{song.id}}" t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
                <button t-attf-id="play-song-{{song.name}}" t-att-value="song.url" t-on-click="playSong">Play song</button>
              </li>
            </t>
          </t>
          <t t-if="albumHasSong[0] and props.albumdata[0] !== 'Album not Found'">
            <t t-foreach="albumHasSong[0]" t-as="song" t-key="song.id">
              <li>
                <p><t t-out="song.name"/></p>
                <button t-attf-id="add-song-{{song.id}}" t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
                <button t-attf-id="play-song-{{song.name}}" t-att-value="song.url" t-on-click="playSong">Play song</button>
              </li>
            </t>
          </t>
        </ul>
      </t>
    </table>
  </div>
    `;

    setup() {
        this.albumHasSong = useState([]);
    }

    async openAlbum(ev) {
        const selectedAlbumName = ev.target.getAttribute('id');
        const response = await fetch(`/music/fetch?album_name=${selectedAlbumName}`);
        const {result : newData} = await response.json();
        this.albumHasSong.pop(); // remove previously filled data if any
        this.albumHasSong.push(newData);
    }

    addSongToPlaylist(ev) {
        let musicInfo = this.albumHasSong[0] || this.props.musicdata[0];
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = musicInfo.find(song => song.url === selectedSongUrl);
        this.props.updateAddToPlayList(selectedSong); // this will update the data on root componenet which we will send to playlist component
    }

    playSong(ev) {
      // in case a audio is already playing stop it to play another.
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
        let musicInfo = this.albumHasSong[0] || this.props.musicdata[0];
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = musicInfo.find(song => song.url === selectedSongUrl);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.play();
    }

    static props = ['musicdata','albumdata', 'updateAddToPlayList'];
  }

class Search extends Component {
    static template = xml`
    <div>
      <div style="border:1px,solid,black;text-align:center">
            <input type="text" id="searchSong" placeholder="Search a music" value="Freedom"/>
            <button t-on-click="getMusic" id="SearchButton">Search</button>
      </div>
        <MusicData musicdata="searchData" albumdata="albumData" updateAddToPlayList="props.updateAddToPlayList"/>
    </div>
    `;
    setup() {
        this.searchData = useState([]); //state variables
        this.albumData = useState([]);
    }

    async getMusic() {
        const findSong = document.getElementById('searchSong').value;
        /*
        The Fetch API provides a JavaScript interface for accessing and manipulating parts of the protocol,
        such as requests and responses. It also provides a global fetch () method that provides an easy,
        logical way to fetch resources asynchronously across the network.
        This kind of functionality was previously achieved using XMLHttpRequest.
        more details on : https://developer.mozilla.org/en-US/docs/Web/API/Fetch
        */
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const {result : newData, albumdata: album}= await response.json();
        this.searchData.pop();
        this.albumData.pop();
        this.searchData.push(newData);
        this.albumData.push(album);
    }



    static components = { MusicData }

    static props = ['updateAddToPlayList'];
}

class RootStructure extends Component {

    // The template property defines the structure and content of the component using an XML-like syntax called JSX
    static template = xml `
  <style>
    body {
        margin: 0;
        padding: 0;
        height: 100vh;
    }
  </style>
  <div id="Container" style="position:relative;height:100%">
      <Search updateAddToPlayList="this.updateAddToPlayList"/>
      <PlayList playlist="addToPlaylist"/>
      <Player/>
  </div>`;
    
    setup(){
        this.addToPlaylist = useState([]);
    }

    //we will add songs individually , which needs to be updated everytime
    updateAddToPlayList = (newData) => {
        if (JSON.stringify(this.addToPlaylist).includes(JSON.stringify(newData))) {
            return;
        }
        this.addToPlaylist.push(newData);
    }

    static components = { Search, PlayList, Player };
}

window.onload = function() {
  mount(RootStructure, document.body);
};

// registry.category("actions").add("music_player_component_action", RootStructure);
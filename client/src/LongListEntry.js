import React from 'react';
import './LongListEntry.css';

const LongListEntry = (props) => {
  const artist = [];
  for (let i = 0; i < props.track.artists.length; i++) {
    artist.push(props.track.artists[i].name);
  }
  const index = props.index + 1;
  const track = props.track.name;
  const img = props.track.album.images[2].url;
  const album = props.track.album.name;
  return (
    <tr>
      <td> {index} </td>
      <td> 
        <strong>{track}</strong>
        <div className="artist">{artist.join(', ')} </div>
      </td>
      <td>
        <img width="64" src={img} />
      </td>
      <td>
        <div>{album}</div>
      </td>
    </tr>
  )
}

export default LongListEntry;
import React from 'react';
import './LongTermList.css';
import LongListEntry from './LongListEntry.js';

const LongTermList = (props) => {
  return (
    <table className="table" >
      <thead>
        <tr>
          <th id="indexHead"> # </th>
          <th id="trackHead"> Track </th>
          <th> </th>
          <th id="albumHead"> Album </th> 
        </tr>
      </thead>
      <tbody>
        {props.data.items.map((track, i) => <LongListEntry 
        key={i} 
        index={i}
        track={track} />)}
      </tbody>
    </table>
  )
}

export default LongTermList;
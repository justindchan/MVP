import React from 'react';
import './ShortTermList.css';
import ShortListEntry from './ShortListEntry.js';

const ShortTermList = (props) => {
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
        {props.data.items.map((track, i) => <ShortListEntry 
        key={i} 
        index={i}
        track={track} />)}
      </tbody>
    </table>
  )
}

export default ShortTermList;
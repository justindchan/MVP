import React from 'react';
import './MediumTermList.css';
import MediumListEntry from './MediumListEntry.js';

const MediumTermList = (props) => {
  console.log(props.data.items)
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
        {props.data.items.map((track, i) => <MediumListEntry 
        key={i} 
        index={i}
        track={track} />)}
      </tbody>
    </table>
  )
}

export default MediumTermList;
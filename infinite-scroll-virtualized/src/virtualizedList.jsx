import React, { useState, useEffect } from 'react';
import { loremIpsum } from 'lorem-ipsum';
import { List } from 'react-virtualized';

// virtual list logic: https://www.patterns.dev/posts/virtual-lists

/*

handleScroll checks the scroll position to determine when the user is close to the end of the list. When they are, it fetches more items.
This example uses a simulated API call (fetchData) that generates more items, but in a real-world scenario, you would replace this with an actual API call.
You might want to add logic to avoid multiple API calls if the user scrolls very fast or if the previous API call hasn't finished yet (e.g., by using a loading state).

*/

const initialRowCount = 100; // start with a smaller initial count
const fetchRowCount = 100; // number of items to fetch in each API call

function DemoInfiniteList() {
        const [list, setList] = useState([]);

        useEffect(() => {
                // Fetch initial set of data
                fetchData(initialRowCount);
        }, []);

        const fetchData = async (count) => {
                // Simulating an API call
                const newData = Array(count).fill().map((_, idx) => {
                        return {
                                id: list.length + idx,
                                name: 'dddxxx',
                                image: 'http://via.placeholder.com/40',
                                text: loremIpsum({
                                        count: 1,
                                        units: 'sentences',
                                        sentenceLowerBound: 4,
                                        sentenceUpperBound: 8
                                })
                        };
                });

                // Append new data to the list
                setList(prevList => [...prevList, ...newData]);
        };

        const handleScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
                // console.log(`scrollTop: ${scrollTop}, clientHeight: ${clientHeight}, scrollHeight: ${scrollHeight}`);
                if (scrollTop + clientHeight >= scrollHeight - 100) { // 100 is a threshold, can adjust based on requirements
                        console.log(`fetch another ${fetchRowCount} items, hahaha`);
                        fetchData(fetchRowCount);
                }
              };
            
              const renderRow = ({ index, key, style }) => (
                <div key={key} style={style} className="row">
                  {/* <div className="image">
                    <img src={list[index].image} alt="" />
                  </div> */}
                  <div className="content">
                    <div>{list[index].name}</div>
                    <div>{list[index].text}</div>
                  </div>
                </div>
              );
            
              return (
                <div className="App">
                  <div className="list">
                    <List
                      width={700}
                      height={600}
                      rowHeight={50}
                      rowRenderer={renderRow}
                      rowCount={list.length}
                      overscanRowCount={6}
                      onScroll={handleScroll} />
                  </div>
                </div>
              );
            
}

export default DemoInfiniteList;

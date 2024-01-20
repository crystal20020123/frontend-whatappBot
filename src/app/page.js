"use client"

import { useState, useEffect } from 'react';
import pages from './pages.css'
import axios from 'axios';
// const io = require('socket.io-client');
// const socket = io('http://localhost:4000', {
//     withCredentials: true,
//     extraHeaders: {
//         // 'sportsbook': 'header-content',
//         'x-current-user': "me",
//     },
// });
const api = axios.create({
  baseURL: "http://localhost:4000/api/",
  headers:
    { "Content-Type": 'application/json' }

})

const webSocket = new WebSocket('ws://localhost:4040/');
export default function Home() {
  const [csvData, setCsvData] = useState([]);
  const [selApp, setSelApp] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [customInfo, setCustomInfo] = useState({ name: '', phone: '', money: '' });
  const [conversation, setConversation] = useState([]);
  webSocket.onmessage = (event) => {
    console.log(event.data);
    setMessages([...messages, JSON.parse(event.data)])

  };
  // socket.on('message',(data) => console.log('socket data_____________', data))
  // Function to read CSV file and parse it
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map((row) => row.split(','));
        setCsvData(rows);
      };
      reader.readAsText(file);
    }
  };

  // Function to send selected row data to backend
  const handleRowClick = async (rowData) => {
    fetchConversation(rowData);
    setSelApp(rowData[1]);
    setCustomInfo({
      name: rowData[0],
      phone: rowData[1],
      money: rowData[3]
    });

    try {
      const response = await fetch('http://localhost:4000/api/row-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rowData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Process server response here
      const result = await response.json();
      console.log('Server response:', result);

      // Further actions based on server response can be added here

    } catch (error) {
      console.error('Error sending the row data:', error);
    }
  };

  const handleSendMessage = async () => {
    const messagePayload = {
      name: customInfo.name,
      phone: customInfo.phone,
      money: customInfo.money
    }
    try {
      const respond = await fetch('http://localhost:4000/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messagePayload })
      });

      if (!respond.ok) {
        throw new Error(`HTTP error! Status: ${respond.status}`);
      }

      const result = await respond.json();
      console.log("Server response:", result);

    } catch (error) {
      // console.error("Error Sending message")
    }
  };

  const fetchConversation = async (rowData) => {

    api.get(`/messages?whatsapp=${rowData[1]}`)
      .then(res => setMessages(res.data))
  };

  const TextAera = ({ text, type }) => {

    return (
      <div style={Object.assign({ backgroundColor: '#BCF0DA', padding: '15px', margin: '10px', borderRadius: '5px' }, type == false ? { marginRight: '60px' } : { marginLeft: "60px" })}>
        <p>{text}</p>
      </div>
    )
  }


  return (
    <div className='container' style={{ backgroundColor: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* <div style={{ marginTop: '20px' }} /> */}
      {/* <div className=' grid grid-cols-2 gap-4'> */}

      <div className='mt-12  flex flex-around space-x-4 items-center justify-between mr-12'>
        <div className="custom-file-upload">
          <input
            type="file"
            id="file-upload"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="custom-file-button bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            📂 Load CSV File
          </label>
        </div>
        <button type="button" className="h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSendMessage}>
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/></svg> */}
          📞
        </button>
      </div>
      <div className='mt-8 p-2 relative overflow-x-auto shadow-md sm:rounded-sm border-black-400  border-2 mx-8' style={{ borderRadius: "10%" }}>


        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ' style={{ marginTop: '20px' }}>
          {csvData.map((row, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedRow(row);
                handleRowClick(row);
              }}
              className="table-row  flex items-center hover:bg-gray-100 cursor-pointer"
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="table-cell flex items-center px-4 h-6 border-b border-gray-300"
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </table>
      </div>
      {/* </div> */}
      <div className='ml-80 mt-12 text-4xl font-bold dark:text-white'>Messages</div>
      {
        messages.map(val =>
          <TextAera type={val.type} text={val.content} />
        )
      }

    </div>

  );
}

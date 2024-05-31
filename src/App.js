import React, { useEffect, useState, useRef } from "react";
import axios from "axios"
import './App.css';
console.log(process.env)
const URL = process.env.REACT_APP_BACK_END_URL;
function App() {  
  const [messages, setMessages] = useState([]);
  const [enableFreeText, setEnableFreetext] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [assistantId, setAssistantId] = useState(undefined);
  const [threadId, setThreadId] = useState(undefined);
  const [isbuttonDisables, setIsButtonDisabled] = useState(false);
  const [meta, setMeta] = useState('');
  const updateMessagetext = (text) => {
    setInputValue(text);
    setEnableFreetext(true)
  };
  const bottomRef = useRef(null);
  useEffect(() => {
    // Scroll to the bottom of the container when the component mounts or messages update
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  const deleteAssistant = async () => {
    const url = `${URL}/assistant/delete`
    const response = await axios.post(url, {
      assistantId,
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credential: 'same-origin',
    }); 
    console.log(response)   
  }

  useEffect(() => {
    // This code runs when the component mounts

    return () => {
      const cleanup = async () => {
        console.log('Component is unmounting');
        await deleteAssistant();
      };

      cleanup();
    };
  }, []);

  const postMessage = async () => {
    setInputValue('');
    let url = URL;
    if (assistantId) {
      url = `${URL}/message`
    }
    const response = await axios.post(url, {
      message: inputValue,
      assistantId,
      threadId
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credential: 'same-origin',
    });    
    console.log(response.data)
    const data = response.data;
    setThreadId(data.threadId);
    setAssistantId(data.assistantId);
    const msg = data.data.map(msg => {
      return ({
        id: msg.id,
        type: msg.content[0].type,
        text: msg.content[0].text.value,
        by: msg.role
      })
    })
    console.log(msg)
    setMessages(msg.reverse());
    if (data.meta) {
      setMeta(data.meta)
    }
    setIsButtonDisabled(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('eeeeeeeeeeeeeeeeeeeeee')
      postMessage();
    }
  };

  return (
    <div className="container">
      <h1>Negotiation Bot</h1>
      <h6>We will be negotiating for macbook pro, and target price will be around 2500</h6>
      {!isbuttonDisables ? <div className="buttons-wrapper">
        <button disabled={isbuttonDisables} onClick={() => updateMessagetext(`Hi, I'm here to negotiate for macbook pro and my quoted price is 3300`)}>
          3300$
        </button>
        <button  disabled={isbuttonDisables} onClick={() => updateMessagetext(`Hi, I'm here to negotiate for macbook pro and my quoted price is 2800`)}>
          2800$
        </button >
        <button  disabled={isbuttonDisables} onClick={() => updateMessagetext(`Hi, I'm here to negotiate for macbook pro and my quoted price is 2600`)}>
          2600$
        </button>
      </div> : (
      <div className="info-wrapper">
        <span style={{ color: 'red' }}>{meta}</span>
      </div>)}
      <div className="chat-container">
        <div className="chat-wrapper" ref={bottomRef}>
          {messages.map(msg => {
            if (msg.by === 'user') {
              return (
                <div className='user-message'>
                  <span className='message-text'>
                    {msg.text}
                  </span>
                </div>
              )
            } else {
              return (
                <div className='bot-message'>
                  <span className='message-text'>
                    {msg.text}
                  </span>
                </div>
              )
            }
          })

          }
        </div>
        {enableFreeText && <div className="input-wrapper">
          <input 
          autoFocus
          onChange={(event) => {
            console.log(event.key);
            if (event.key === 'Enter') {
              postMessage()
            }
            setInputValue(event.target.value)
          }} 
          className="input" 
          value={inputValue} 
          onKeyDown={handleKeyDown}
          />
          <button onClick={async () => await postMessage()}>Submit</button>
        </div>}
      </div>
    </div>
  );
}

export default App;

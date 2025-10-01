import React, { use, useEffect, useRef, useState } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { Play } from 'lucide-react';
import { autocompletion } from "@codemirror/autocomplete";
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import axios from 'axios';
import { socketInit } from '../Socket';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import toast from 'react-hot-toast';
import ConnectedClients from '../Components/ConnectedClients';
import { IoMdExit } from "react-icons/io";

function Editor({userDetails}) {
  console.log("userDeatils In Editor:",userDetails);
  const themesOptions = { vscodeDark, githubDark, githubLight, }
  const [code, setCode] = useState("console.log('Hello Codox...');");
  const [output, setOutput] = useState('Your Output Here...');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('lang') || 'javascript');
  const [theme, setTheme] = useState(themesOptions[localStorage.getItem('theme')] || themesOptions['githubDark']);
const socketRef = useRef(null);
const reactNavigator = useNavigate();
const [connectedClients, setConnectedClients] = useState([]);
const naviagate = useNavigate();
const loaction = useLocation();
const {roomId} = useParams();
const editorRef = useRef(null);

useEffect(() => {
  console.log("Loaction state:", loaction.state);
  if(loaction.state === null) naviagate('/room-info');
}, []);

  useEffect(() => {
    const user_avatar = localStorage.getItem('user-avatar');
    const init = async () => {
         if (!user_avatar) {
      naviagate('/login');
      toast.error('Please Login First');
      return
    }
      socketRef.current = await socketInit();
console.log("Socket initialized:", socketRef.current);

socketRef.current.on('connect', () => console.log('socket connected',socketRef.current.id));

console.log("Before Calling Join-room Value Of Avatar: ",user_avatar)
socketRef.current.emit('join-room',{
  roomId:roomId,
  username:loaction?.state?.username,
  avatar:user_avatar||userDetails.avatar
});
socketRef.current.on('user-connected', ({username,id,connectedClientsData}) => {
  console.log('User connected:', username);
  toast.success('User connected: ' + username,{
    duration: 4000
  });
});

socketRef.current.on('connected-clients', (connectedClientsData) => {
  console.log('Connected clients:', connectedClientsData);
  setConnectedClients(connectedClientsData);
});
 globalThis.emitLanguageChange = function(lang) {
   socketRef.current.emit('lang-change', lang);
 }

 socketRef.current.on('language-changed', (lang) => {
   console.log('Language changed to:', lang);
   setSelectedLanguage(lang);
 });

 socketRef.current.on('code-updated', (code) => {
   console.log('Code changed to:', code);
   setCode(code);
 });

 socketRef.current.on('prev-code', (prevCode) => {
   console.log('Previous code:', prevCode);
   if(prevCode.trim()) setCode(prevCode);
 });


socketRef.current.on('user-disconnected', (username) => {
  console.log('User disconnected:', username);
  toast.error('User disconnected: ' + username,{
    duration: 5000
  });
  setConnectedClients((prevClients) => prevClients.filter((client) => client.username !== username));
});


socketRef.current.on('connect_error', (err) => handleErrors(err));
socketRef.current.on('connect_failed', (err) => handleErrors(err));

function handleErrors(e) {
console.log('socket error', e);
toast.error('Socket connection failed, try again later.',{
   toastId: toastId
});
reactNavigator('/');
            }
    }
    init();


    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    }
  },[]);



  const languageOptions = {
    javascript: javascript(),
    python: python(),
    java: java(),
  };

  const languages = {
    javascript: 93,
    python: 71,
    cpp: 54,
    java: 62,
    html: 60,
    css: 50,
  };

  useEffect(() => {
    if(selectedLanguage === 'javascript') setCode("console.log('Hello Codox...');");
    else if(selectedLanguage === 'python') setCode("print('Hello Codox...')");
    else if(selectedLanguage === 'java') setCode("System.out.println('Hello Codox...');");
  }, [selectedLanguage]);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    emitLanguageChange(lang);
    setSelectedLanguage(lang);
    localStorage.setItem('lang', lang);
    if(lang === 'javascript') setCode("console.log('Hello Codox...');");
    else if(lang === 'python') setCode("print('Hello Codox...')");
    else if(lang === 'java') setCode("System.out.println('Hello Codox...');");
  };

  const handleTheme = () => {
    if(theme === themesOptions['githubDark']){
      setTheme(themesOptions['githubLight']);
      localStorage.setItem('theme', 'githubLight');
    } else if(theme === themesOptions['githubLight']){
      setTheme(themesOptions['vscodeDark']);
      localStorage.setItem('theme', 'vscodeDark');
    } else {
      setTheme(themesOptions['githubDark']);
      localStorage.setItem('theme', 'githubDark');
    }
  };

  const handleCodeAPiCall = async () => {
    setOutput('Running...');
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: 'true', wait: 'false', fields: '*' },
      headers: {
        'x-rapidapi-key': '573d4e3d04mshad51e3c5761e080p1b1879jsnca58502e1c32',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        language_id: selectedLanguage === 'python' ? 70 : selectedLanguage === 'java' ? 91 : 63,
        source_code: btoa(code),
        stdin: btoa('Judge0')
      }
    };

    try {
      const response = await axios.request(options);
      const token = response.data.token;
      let result = null;
      do {
        await new Promise(r => setTimeout(r, 1000));
        const res = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
          params: { base64_encoded: 'true', fields: '*' },
          headers: {
            'x-rapidapi-key': '573d4e3d04mshad51e3c5761e080p1b1879jsnca58502e1c32',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
          }
        });
        result = res.data;
      } while (result.status.id <= 2);

      const out = result.stdout ? atob(result.stdout) : '';
      const err = result.stderr ? atob(result.stderr) : '';
      setOutput(out || err || 'No output');
    } catch (err) {
      setOutput(err?.response?.data?.stderr || 'Something went wrong...');
    }
  };
  function handleCodeChange(value){
    console.log("code changed...",value);
    if(!value.trim()) return;
    setCode(value);
    console.log("New code:",value);
    socketRef.current.emit('code-change', {value,roomId});
};//handleCodeChange


const handleCopyRoomId = () => {
  navigator.clipboard.writeText(roomId);
  toast.success('RoomId copied to clipboard.');
}


return (
  <div className="h-screen w-full flex flex-col items-center text-white overflow-hidden">
    
    {/* Toolbar */}
    <div className="w-[95%] md:w-[70%] mb-6 rounded-2xl bg-neutral-900/70 backdrop-blur-md flex flex-col sm:flex-row justify-center items-center gap-4 py-4 px-6 shadow-xl border border-neutral-700">
      
      <button
        onClick={handleCopyRoomId}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-md text-white font-semibold cursor-pointer hover:from-indigo-400 hover:to-indigo-600 transition-all"
      >
        Copy Room ID
      </button>

      <div className="bg-black/70 cursor-pointer rounded-xl text-white px-4 py-2 border border-zinc-600">
        <select
          onChange={handleLangChange}
          value={selectedLanguage}
          className="bg-black/80 text-white outline-none cursor-pointer"
        >
          <option value="javascript">Javascript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleCodeAPiCall}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-green-600 shadow-md text-black font-semibold flex items-center gap-x-2 hover:from-green-500 hover:to-green-700 transition-all"
        >
          <Play size={18}/> Run
        </button>

        <button
          onClick={handleTheme}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 shadow-md text-white font-semibold cursor-pointer hover:from-gray-600 hover:to-black transition-all"
        >
          Switch Theme
        </button>
      </div>
      <IoMdExit onClick={() => {
        window.confirm('Are you sure you want to leave Room?') && naviagate('/');
      }} className='text-xl md:text-3xl text-red-500 hover:text-red-400 cursor-pointer hover:scale-110 transition-all duration-100' />
    </div>

    {/* Main Section */}
    <div className="h-[85%] w-[95%] bg-neutral-900/80 rounded-2xl shadow-2xl backdrop-blur-xl border border-neutral-700 flex flex-col md:flex-row overflow-hidden">
      
      {/* Code Editor */}
 <div className="w-full md:w-[60%] h-[50%] md:h-full border-b md:border-b-0 md:border-r border-neutral-700 flex">
  <CodeMirror
    ref={editorRef}
    onChange={handleCodeChange}
    value={code}
    height="100%"
    theme={theme}
    className="flex-1"
    extensions={[languageOptions[selectedLanguage], autocompletion()]}
  />
</div>

      {/* Output + Clients */}
      <div className="w-full md:flex-1 h-[50%] md:h-full flex flex-col">
        
        {/* Output */}
     <div className="flex-1 w-full p-4 font-mono text-sm sm:text-base md:text-lg 
                text-green-400 bg-black/80 overflow-auto 
                border-b border-neutral-700 rounded-t-xl shadow-inner">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      Output
    </span>
    <button
      onClick={() => setOutput("")}
      className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/40 
                 rounded-md text-red-400 transition-all"
    >
      Clear
    </button>
  </div>

  {/* Console Output */}
  <pre className="whitespace-pre-wrap leading-relaxed">
    {output || "⚡ No output yet. Run your code!"}
  </pre>
</div>


        {/* Connected Clients */}
        <div className="w-full h-[40%] md:h-[30%] p-4 overflow-auto bg-black/40">
          <h2 className="text-lg text-center font-semibold text-blue-400 mb-4">Connected Clients</h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {connectedClients?.map((client) => (
              <ConnectedClients
                key={client.id}
                username={client.username}
                avatar={client.avatar}
                id={client.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Editor;
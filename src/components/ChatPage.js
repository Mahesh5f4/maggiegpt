import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Paper,
  InputBase,
  CssBaseline
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const chatMessageStyle = {
  mb: 2,
  p: 2,
  borderRadius: 2,
  maxWidth: '80%',
  wordWrap: 'break-word',
  display: 'block',
};

const userMessageStyle = {
  ...chatMessageStyle,
  bgcolor: '#e3f2fd',
  ml: 'auto',
};

const aiMessageStyle = {
  ...chatMessageStyle,
  bgcolor: '#f1f1f1',
  mr: 'auto',
};

const MarkdownWithCopy = ({ content }) => {
  const renderers = {
    code({ className, children }) {
      const language = className?.replace('language-', '') || 'javascript';
      const code = String(children).trim();

      const handleCopy = () => {
        navigator.clipboard.writeText(code);
      };

      return (
        <Box sx={{ position: 'relative', my: 2 }}>
          <Tooltip title="Copy code">
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <SyntaxHighlighter language={language} style={oneLight} wrapLongLines>
            {code}
          </SyntaxHighlighter>
        </Box>
      );
    }
  };

  return <ReactMarkdown components={renderers}>{content}</ReactMarkdown>;
};

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingInterval, setTypingInterval] = useState(null);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const chatRef = useRef(null);
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (token && !userName) {
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          const res = await axios.get('https://maggiegptbackend-1.onrender.com/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(res.data.name);
        } catch (err) {
          console.error('Failed to fetch user profile', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [token, userName]);

  useEffect(() => {
    if (token) {
      const fetchChatHistory = async () => {
        try {
          setLoading(true);
          const res = await axios.get('https://maggiegptbackend-1.onrender.com/api/chat/history', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChatHistory(res.data.chatHistory);
        } catch (err) {
          console.error('Failed to fetch chat history', err);
        } finally {
          setLoading(false);
        }
      };
      fetchChatHistory();
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Hi, how are you?' }]);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSynthesisSupported(false);
    }
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
      setTimeout(() => handleSendMessage(), 300);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const stopListening = () => {
    if (window.speechRecognition) {
      window.speechRecognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (!speechSynthesisSupported) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentUtterance(utterance);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);
    setIsTyping(true);
    setImageUrl(null);

    try {
      const response = await axios.post(
        'https://maggiegptbackend-1.onrender.com/api/chat',
        { prompt: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiReply = response.data.reply;
      const aiImage = response.data.imageUrl;

      let displayedText = '';
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < aiReply.length) {
          displayedText += aiReply.charAt(index);
          setChatHistory(prev => {
            const newHistory = [...prev];
            if (newHistory[newHistory.length - 1]?.role === 'ai') {
              newHistory[newHistory.length - 1].content = displayedText;
            } else {
              newHistory.push({ role: 'ai', content: displayedText });
            }
            return [...newHistory];
          });
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsSending(false);
          if (aiImage) setImageUrl(aiImage);
          speak(aiReply);
        }
      }, 2);

      setTypingInterval(typeInterval);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleStopResponse = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
      setIsTyping(false);
      setIsSending(false);
      if (currentUtterance) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentUtterance(null);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setImageUrl(null);
  };

  const scrollToTop = () => {
    chatRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5', background: 'linear-gradient(135deg, #f5f7fa, #e4e8eb)' }}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, fontFamily: '"Poppins", sans-serif', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', borderRadius: 2, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', p: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={4}>
          <Grid item>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00ADB5' }}>
              MaggieGPT
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Account settings">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircleIcon fontSize="large" sx={{ color: '#333' }} />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>Hello, {userName || 'User'}!</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Chat History</Typography>
          <Box>
            <Button size="small" onClick={handleNewChat}>New Chat</Button>
            <IconButton color="primary" onClick={scrollToTop}>
              <ArrowUpwardIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1000, m: 2 }}>
            <IconButton onClick={() => speak(chatHistory[chatHistory.length - 1]?.content)} disabled={!speechSynthesisSupported || !chatHistory.length}>
              {isSpeaking ? <VolumeOffIcon fontSize="large" /> : <VolumeUpIcon fontSize="large" />}
            </IconButton>
          </Box>

          <Box
            ref={chatRef}
            sx={{
              height: '60vh',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              mb: 2,
              backgroundColor: '#fff',
              scrollBehavior: 'smooth',
              mt: 6, // Add margin to avoid overlap with the speaker button
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress sx={{ color: '#00ADB5' }} />
              </Box>
            ) : (
              <>
                {chatHistory.map((msg, idx) => (
                  <Box key={idx} sx={msg.role === 'user' ? userMessageStyle : aiMessageStyle}>
                    <Typography sx={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal', color: msg.role === 'user' ? '#1976d2' : '#333', mb: 0.5 }}>
                      {msg.role === 'user' ? 'You:' : 'MaggieGPT:'}
                    </Typography>
                    {msg.role === 'ai' ? (
                      <>
                        <MarkdownWithCopy content={msg.content} />
                        {imageUrl && <img src={imageUrl} alt="Generated" style={{ width: '100%', maxWidth: '500px', marginTop: '16px' }} />}
                      </>
                    ) : (
                      <Typography sx={{ color: '#333' }}>{msg.content}</Typography>
                    )}
                  </Box>
                ))}
                {isTyping && (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontStyle: 'italic', color: '#666' }}>MaggieGPT is typing...</Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (isSending) {
              handleStopResponse();
            } else {
              handleSendMessage();
            }
          }}
          sx={{
            p: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
            boxShadow: '0 0 6px rgba(0,0,0,0.1)'
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton onClick={isListening ? stopListening : startListening} color="primary">
            {isListening ? <StopIcon /> : <MicIcon />}
          </IconButton>
          <IconButton type="submit" color="primary">
            {isSending ? <StopIcon /> : <SendIcon />}
          </IconButton>
          {isSending && (
            <Button onClick={handleStopResponse} color="secondary" variant="contained" sx={{ ml: 1 }}>
              Stop
            </Button>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;

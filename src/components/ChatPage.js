import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Button,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const scrollingTextStyle = {
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  animation: 'scrollText 10s linear infinite',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#1976d2',
  marginBottom: '16px',
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
          <SyntaxHighlighter language={language} style={oneDark} wrapLongLines>
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
  const [typingInterval, setTypingInterval] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5001/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
      } catch (error) {
        console.error('Failed to fetch user name', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && !userName) fetchUserProfile();
  }, [token, userName]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5001/api/chat/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatHistory(res.data.chatHistory);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchChatHistory();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Hi, how are you?' }]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    setImageUrl(null);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/chat',
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
          if (aiImage) {
            setImageUrl(aiImage);
          }
        }
      }, 2);

      setTypingInterval(typeInterval);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleStopChat = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
      setIsTyping(false);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f0f0f, #1f1f1f)'
      }}
    >
      <Container maxWidth="md" sx={{ mt: 4, fontFamily: '"Poppins", sans-serif', backgroundColor: 'rgba(30, 30, 30, 0.75)', color: '#fff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={4}>
          <Grid item>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#00ADB5', className: 'animated-text' }}>
              MaggieGPT
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Account settings">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircleIcon fontSize="large" sx={{ color: '#fff' }} />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>Hello, {userName || 'User'}!</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Grid>
        </Grid>

        <Box sx={scrollingTextStyle}>
          {loading ? 'Loading user info...' : `Hello, ${userName || 'there'}! How can I help you today?`}
        </Box>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Chat History</Typography>
          <IconButton color="primary" onClick={handleNewChat}>
            New Chat
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
            backgroundColor: '#333',
            scrollBehavior: 'smooth',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress sx={{ color: '#fff' }} />
            </Box>
          ) : (
            <>
              {chatHistory.map((msg, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal', color: msg.role === 'user' ? '#1976d2' : '#fff', mb: 0.5 }}>
                    {msg.role === 'user' ? 'You:' : 'MaggieGPT:'}
                  </Typography>
                  {msg.role === 'ai' ? (
                    <>
                      <MarkdownWithCopy content={msg.content} />
                      {imageUrl && <img src={imageUrl} alt="Generated" style={{ width: '100%', maxWidth: '500px', marginTop: '16px' }} />}
                    </>
                  ) : (
                    <Typography sx={{ color: '#fff' }}>{msg.content}</Typography>
                  )}
                </Box>
              ))}

              {isTyping && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'normal', color: '#555' }}>MaggieGPT is typing...</Typography>
                </Box>
              )}
            </>
          )}
        </Box>

        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={isMobile ? 9 : 10}>
            <TextField
              fullWidth
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: '#424242',
                color: '#fff',
                '& .MuiOutlinedInput-root': { backgroundColor: '#424242' },
              }}
            />
          </Grid>
          <Grid item xs={isMobile ? 3 : 2}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <IconButton color="primary" onClick={handleSendMessage} fullWidth>
                  <SendIcon />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={handleStopChat} sx={{ color: '#fff', backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#c62828' } }} fullWidth>
                  Stop
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatPage;

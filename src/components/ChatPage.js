import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Container,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ✅ Import global font in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />

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
  const chatRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/chat',
        { prompt: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiReply = response.data.reply;
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
        }
      }, 0); // faster typing

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, fontFamily: '"Poppins", sans-serif' }} // 👈 apply font here
    >
      <Typography variant="h4" align="center" gutterBottom>
        Chat with Bot
      </Typography>

      <Box
        ref={chatRef}
        sx={{
          height: '60vh',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 2,
          mb: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        {chatHistory.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontWeight: msg.role === 'user' ? 'bold' : 'normal',
                color: msg.role === 'user' ? '#1976d2' : '#000',
                mb: 0.5,
              }}
            >
              {msg.role === 'user' ? 'You:' : 'Bot:'}
            </Typography>

            {msg.role === 'ai' ? (
              <MarkdownWithCopy content={msg.content} />
            ) : (
              <Typography>{msg.content}</Typography>
            )}
          </Box>
        ))}
      </Box>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ChatPage;

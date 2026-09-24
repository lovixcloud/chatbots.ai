import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Widget } from './Widget';
import './index.css';
const params = new URLSearchParams(window.location.search);
const botId = params.get('botId') || 'acme-main-bot';
ReactDOM.createRoot(document.getElementById('chatbots-widget-root')).render(_jsx(React.StrictMode, { children: _jsx(Widget, { botId: botId }) }));

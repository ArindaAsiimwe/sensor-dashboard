import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://25fcl6x3ljgmdg6q7dn4qzvxki.appsync-api.eu-north-1.amazonaws.com/graphql',
      region: 'eu-north-1',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-mmvrbac4f5ebbkofhnbzkksrwa'
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



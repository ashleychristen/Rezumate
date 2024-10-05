// pages/_app.js

import '../styles/global.css'; // Import global CSS for color variables
import '../styles/Dashboard.module.css'; // Import any other styles needed

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

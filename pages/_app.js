import '@fortawesome/fontawesome-free/css/all.css';
import 'styles/globals.scss';
import 'styles/Header.scss';
import 'styles/pageLayout.scss';
import 'styles/Archieve.scss';
import { Space_Grotesk, PT_Mono, Manrope, Overpass } from 'next/font/google';
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { useState, useEffect } from 'react';
import Router from 'next/router';
import TopLoadingBar from 'react-top-loading-bar';
import Script from 'next/script';
import dynamic from 'next/dynamic'; // Import dynamic from 'next/dynamic'
const MobileErrorPage = dynamic(() => import('./MobileError')); // Dynamic import for client-side rendering
import { Analytics } from '@vercel/analytics/react';

const space = Space_Grotesk({ subsets: ['latin'] });
const manrope = Manrope({ subsets: ['latin'] });
const pt_mono = PT_Mono({ subsets: ['latin'], weight: ['400'] });
const overpass = Overpass({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = () => {
      setLoading(true);
      setProgress(0);
    };
    const done = () => {
      setLoading(false);
      setProgress(100);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', done);
    Router.events.on('routeChangeError', done);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', done);
      Router.events.off('routeChangeError', done);
    };
  }, []);

  const isBrowser = typeof window !== 'undefined'; // Check if running in the browser

  if (isBrowser) {
    const isMobileDevice = /Mobi/i.test(navigator.userAgent);

    if (isMobileDevice) {
      return <MobileErrorPage />;
    }
  }

  return (
    <>
      <TopLoadingBar
        color="#cf5a56"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        transitionTime={300}
        waitingTime={800}
        shadow={true}
      />
       <style jsx global>{`
        html, a, span, div, input, textarea, button, p, details, summary, h1, h2, h3, h4, h5, h6 {
          font-family: ${overpass.style.fontFamily};
        }

        .tn_text, .table tr th, .table tr td{
          font-family: ${overpass.style.fontFamily}
        }

        h1, h2, h3, h4, h5, h6{
          font-family: ${overpass.style.fontFamily};
          margin: 21px 0px;
        }

        .tn_textarea_code{
          font-family: ${overpass.style.fontFamily};
        }
        .list_category_title{
          font-family: ${overpass.style.fontFamily};
        }
        .list_item_title a{
          font-family: ${overpass.style.fontFamily};
        }
        textarea.code{
          font-family: ${overpass.style.fontFamily}
        }
        strong.colorMeta{
          font-family: ${overpass.style.fontFamily}
        }
      `}</style>
      <Component {...pageProps} />
      <Analytics />
      <Script src={`https://unpkg.com/boxicons@2.1.4/dist/boxicons.js`}/>
    </>
  )
}
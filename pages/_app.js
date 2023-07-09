import 'styles/globals.scss';
import 'styles/Header.scss';
import 'styles/pageLayout.scss';
import 'styles/Archieve.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Space_Grotesk, PT_Mono, Manrope } from 'next/font/google';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import TopLoadingBar from 'react-top-loading-bar';
import Script from 'next/script';
import MobileErrorPage from './MobileError';

const space = Space_Grotesk({ subsets: ['latin'] });
const manrope = Manrope({ subsets: ['latin'] });
const pt_mono = PT_Mono({ subsets: ['latin'], weight: ['400'] });

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

  const isMobileDevice = /Mobi/i.test(navigator.userAgent);

  if (isMobileDevice) {
    return <MobileErrorPage />;
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
          font-family: ${manrope.style.fontFamily};
        }

        h1, h2, h3, h4, h5, h6{
          font-family: ${space.style.fontFamily};
          margin: 21px 0px;
        }

        .tn_textarea_code{
          font-family: ${pt_mono.style.fontFamily};
        }
        .list_category_title{
          font-family: ${space.style.fontFamily};
        }
        .list_item_title a{
          font-family: ${manrope.style.fontFamily};
        }
        textarea.code{
          font-family: ${pt_mono.style.fontFamily}
        }
      `}</style>
      <Component {...pageProps} />
      <Script
      src={`pages/scripts/ripple.js`}
      />
    </>
  )
}
import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('tweet-mockup')) {
    Component = dynamic(() => import('components/social/tweet-mockup-generator.js'));
  } else if (id.includes('youtube-thumbnail-downloader')) {
    Component = dynamic(() => import('components/social/youtube-thumbnail-downloader.js'))
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

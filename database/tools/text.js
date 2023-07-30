import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('case-converter')) {
    Component = dynamic(() => import('components/text/case-converter.js'));
  } else if (id.includes('lorem-ipsum')) {
    Component = dynamic(() => import('components/text/lorem-ipsum-generator.js'));
  } else if (id.includes('word-counter')) {
    Component = dynamic(() => import('components/text/word-counter.js'))
  } else if (id.includes('whitespace-remover')){
    Component = dynamic(() => import('components/text/whitespace-remover.js'))
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

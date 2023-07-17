import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('case-converter')) {
    Component = dynamic(() => import('components/text/case-converter.js'));
  } else if (id.includes('lorem-ipsum')) {
    Component = dynamic(() => import('components/text/lorem-ipsum-generator.js'));
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

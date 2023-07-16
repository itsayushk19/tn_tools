import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('converter')) {
    Component = dynamic(() => import('components/color/converter.js'));
  } else if (id.includes('mixer')) {
    Component = dynamic(() => import('components/color/mixer'));
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

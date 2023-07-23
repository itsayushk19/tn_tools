import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('css-box-shadow-generator')) {
    Component = dynamic(() => import('components/css/css-box-shadow-generator.js'));
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('simple')) {
    Component = dynamic(() => import('components/calculators/simple.js'));
  } else if (id.includes('bar-graph')){
    Component = dynamic(() => import('components/calculators/bar-graph.js'))
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

import dynamic from 'next/dynamic';

const DynamicComponent = ({ id }) => {
  let Component;

  if (id.includes('password-generator')) {
    Component = dynamic(() => import('components/security/password-generator'));
  }

  return Component ? <Component id={id} /> : null;
};

export default DynamicComponent;

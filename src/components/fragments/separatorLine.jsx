'use client'

const Separator = ({ color, height, width }) => {
  return (
    <div className='flexr' style={{ backgroundColor: `${color}`, height: `${height}`, width: `${width}`, zIndex: '9' }}></div>
  );
};

export default Separator;


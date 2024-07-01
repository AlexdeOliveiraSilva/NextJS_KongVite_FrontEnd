'use client'

const Separator = ({ color, height, width }) => {
  return (
    <div className='flexr' style={{ backgroundColor: `${color}`, height: `${height}`, width: `${width}`, }}></div>
  );
};

export default Separator;


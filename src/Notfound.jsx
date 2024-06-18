import React from 'react';
import notfound from './assets/notfound.png';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div className='flex flex-col-reverse md:flex-row justify-around items-center p-4'>
      <div className='flex flex-col items-center justify-center p-6 rounded-lg md:mr-6 mt-24 text-center'>
        <h1 className='font-bold mb-2 text-yellow-600 text-2xl md:text-5xl'>YOU SEEM TO BE LOST!</h1>
        <p className='mt-8 font-semibold text-sm md:text-lg'>The page you're looking for isn't available.</p>
        <p className='mb-4 font-semibold text-sm md:text-lg'>Try searching again or use the Go Back button below.</p>
        <Link to="/">
          <button className='button1'>
            <span className="button_top"> Home
            </span>
          </button>
        </Link>
      </div>
      <div className='mt-6'>
        <img src={notfound} alt="Not Found" className=' h-[30vh] md:h-[75vh] max-w-sm rounded-lg mx-auto' />
      </div>
    </div>
  );
}

export default Notfound;

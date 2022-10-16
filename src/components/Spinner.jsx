import React from 'react';
import { MutatingDots }from 'react-loader-spinner';

const Spinner = ({ message }) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
        <MutatingDots 
            height="100"
            width="100"
            color="#88E2A7"
            secondaryColor= '#123465'
            radius='12.5'
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />

        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner
import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?abstract';

const notActiveButtonStyles = 'bg-primary mr-4 text-black font-bold p-2 px-5 rounded-full outline-none';
const activeButtonStyles = 'bg-sky-900 text-white font-bold p-2 px-5 rounded-full outline-none';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created') // Created or Saved
  const [activeButton, setActiveButton] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, [userId])

  useEffect(() => {
    if(text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery)
      .then((data) => {
        setPins(data);
      })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
      .then((data) => {
        setPins(data);
      })
    }
    const query = userQuery(userId);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, [text, userId])

  const logout = () => {
    localStorage.clear();

    navigate('/login');
  }

  if(!user) {
    return <Spinner message="Loading profile..."/>
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt='banner-pic'
            />
            <img
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover bg-white'
              src={user.image}
              alt='user-pic'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user._id && (
                //<googleLogout
                  // clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  /*render={(renderProps) => (
                    <button
                      type='button'
                      className='bg-white p-2 rounded-lg cursor-pointer outline-none shadow-md'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color='red' fontSize={21} className='mr-4' /> Sign in with Google
                    </button>
                  )}*/
                  // onLogoutSuccess={logout}
                //>
                <>
                </>
              )}

            </div>
          </div>
          <div className='flex justify-center my-7'>
            <div className='flex  w-fit text-center  bg-white rounded-full shadow-lg'>
              <button
                type='button'
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveButton('created');
                }}
                className={`${activeButton === 'created' ? activeButtonStyles : notActiveButtonStyles}`}
              >
                My Posts
              </button>
              <button
                type='button'
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveButton('saved');
                }}
                className={`${activeButton === 'saved' ? activeButtonStyles : notActiveButtonStyles}`}
              >
                Likes
              </button>

            </div>
          </div>

          { pins?.length > 0 ? (

            <div className='px-2'>
            <MasonryLayout pins={pins} />
            </div>
          ): (
            <div className='flex justify-center font-bold items-center w-full- text-xl mt-2'>
              No Posts Found
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default UserProfile
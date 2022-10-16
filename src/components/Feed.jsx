import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { IoMdAdd } from 'react-icons/io';

import { feedQuery, searchQuery } from '../utils/data';

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if(categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      })

    }
  }, [categoryId])


  if(loading) return <Spinner message="We are adding new ideas to your feed!" />


  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
      {!pins?.length && (
        <div className='text-center'>
          <h2 className='text-2xl text-center'>Hm... There's nothing here.</h2>
          <p>Select another category or change your search</p>
          <Link
            to='/create-pin' className='bg-sky-900 mt-10 mx-auto text-white rounded-full w-fit h-12 px-5 flex justify-center items-center'>
            <IoMdAdd /><span className=''>Add new post</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Feed
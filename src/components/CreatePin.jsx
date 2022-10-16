import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';


const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];

    if(selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Image upload error ', error);
        })
    } else {
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if(title && about && imageAsset?._id && category) {
      setLoading(true);
      const doc = {
        _type: 'pin',
        title,
        about,
        destination: 'https://google.com',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category
      }

      client.create(doc)
        .then(() => {
          setTimeout(() => setLoading(false), 4000);
          navigate('/');
        })
    } else {
      setFields(true);
      setTimeout(() => setFields(false), 4000);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {loading && (
        <div className='absolute z-500 top-0 left-0 w-full h-screen bg-slate-100 opacity-80'>
          <Spinner />
        </div>
      )}
      <form class="w-full"
        onSubmit={(e) => {
            e.preventDefault();
            savePin();
        }}>
        {fields && (
          <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields.</p>
        )}
        <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
          <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
            <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
              {wrongImageType && <p>Wrong image type</p>}
              {!imageAsset ? (
                <label>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <div className='flex flex-col justify-center items-center'>
                      <p className='font-bold'><AiOutlineCloudUpload fontSize={100} /></p>
                      <p className='text-2xl'>Click to upload</p>
                    </div>
                    <p className='mt-32 text-gray-400'>
                      Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                    </p>
                  </div>
                  <input
                    type='file'
                    name='upload-image'
                    onChange={uploadImage}
                    className='w-0 h-0'
                  />
                </label>
              ): (
                <div className='relative h-full'>
                  <img src={imageAsset?.url} alt="uploaded-pic" className='h-full w-full'/>
                  <button
                    type='button'
                    className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                    onClick={() => setImageAsset(null)}
                    >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title'
              className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
            />
            <input
              type='text'
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder='Enter a description'
              className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
            />
            <div className='flex flex-col'>
              <div>
                <p className='mb-2 font-semibold text-lg sm:text-xl'>Category</p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
                >
                  <option value='other' className='bg-white text-gray-500'>Select A Category</option>
                  {categories.map((category) => (
                    <option
                      className='text-base border-0 outline-none capitalize bg-white text-black'
                      value={category.name}
                      key={category.name}
                    >{category.name}</option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end items-end mt-5'>
                <button type='submit'
                  className='bg-sky-900 text-white font-bold px-5 py-3 rounded-full w-fit outline'
                >
                  Create Post
                </button>

              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePin
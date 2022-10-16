import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiOutlineDelete, AiOutlineLike, AiFillLike, AiOutlineDownload } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();
    const user = fetchUser();

    const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub))?.length;

    const savePin = (id) => {
        if(!alreadySaved) {
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                })
        }
    }

    const unsavePin = (id) => {
        if(alreadySaved) {
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({save: []})
                .unset([`save[userId == "${user?.sub}"]`])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                })
        }
    }

    const deletePin = (id => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    })
  return (
    <div className='m-2 mb-5 rounded-lg'>
        <div
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-t-lg overflow-hidden transition-all duration-500 ease-in-out'
        >
            <img src={(urlFor(image)?.width(250)?.url())} className='rounded-t-lg w-full' alt='user-pin' />

        </div>
        <div className='flex justify-between items-center gap-2 w-full rounded-b-lg pr-3 bg-slate-100 shadow-lg'>
            <Link
                to={`user-profile/${postedBy?._id}`}
                className='flex gap-2 items-center bg-white p-2 pr-5 rounded-r-full rounded-bl-lg'>
                <img
                    className='w-7 h-7 rounded-full object-cover'
                    src={postedBy?.image}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize text-sm'>{postedBy?.userName}</p>
            </Link>

            <div className='flex gap-5 justify-end py-1'>

            {alreadySaved ? (
                <button
                    type='button'
                    className='bg-white px-3 h-9 rounded-full flex gap-2 items-center justify-center opacity-70 hover:opacity-100 text-sky-600 text-base hover:shadow-md outline-none'
                    onClick={(e) => {
                        e.stopPropagation();
                        unsavePin(_id);
                    }}
                    >
                    <AiFillLike className='text-xl'/><span className="sr-only">Like</span> {save?.length > 0 && save.length}
                </button>
            ): (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                }}
                type='button'
                className='bg-white  px-3 h-9 rounded-full flex gap-2 items-center justify-center opacity-70 hover:text-sky-600 text-base hover:shadow-md outline-none'
                >
                    <AiOutlineLike className='text-xl'/><span className="sr-only">Like</span>  {save?.length > 0 && save.length}
                </button>
            )}
            <div className='flex gap-2'>
                <a
                    href={`${image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:text-green-800 hover:shadow-md outline-none'
                >
                    <AiOutlineDownload /><span className="sr-only">Download</span>
                </a>
            </div>
            {postedBy?._id == user?.sub && (
                <button
                    type='button'
                    onClick={(e) => {
                        e.stopPropagation();
                        deletePin(_id);
                    }}
                    className='bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-xl rounded-3xl hover:shadow-md hover:text-red-500 outline-none'
                >
                    <AiOutlineDelete /><span className="sr-only">Delete Post</span>
                </button>
            )}
            </div>
        </div>
    </div>
  )
}

export default Pin
import React from 'react'
import Amenities from './Amenities'

const SpaceInfo = ({space}) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow">

    <h1 className="text-4xl font-bold">
        {space.name}
    </h1>

    {/* <Rating /> */}

    <p className="mt-5 flex items-center gap-2">
        {/* <Users /> */}
        {space.capacity} Seats
    </p>

    <Amenities />

    <div className="mt-8">
        <h2 className="text-xl font-semibold">
            Description
        </h2>

        <p className="mt-3 text-gray-600 leading-7">
            {space.description}
        </p>
    </div>

</div>
  )
}

export default SpaceInfo
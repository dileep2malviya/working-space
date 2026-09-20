import React from 'react'

const SpaceGallery = ({space}) => {
    return (
        <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
                src={space.image}
                alt={space.name}
                className="h-[450px] w-full object-cover"
            />
        </div>
    )
}

export default SpaceGallery
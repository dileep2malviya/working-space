import { Monitor, Snowflake, Tv, Wifi } from 'lucide-react'
import React from 'react'
import Amenity from './Amenity'

const Amenities = () => {
  return (
    <div className="mt-8">

    <h2 className="mb-4 text-xl font-semibold">
        Amenities
    </h2>

    <div className="grid grid-cols-2 gap-4">

        <Amenity icon={<Wifi />} text="WiFi" />

        <Amenity icon={<Monitor />} text="Projector" />

        <Amenity icon={<Tv />} text="TV" />

        <Amenity icon={<Snowflake />} text="Air Conditioning" />

    </div>

</div>
  )
}

export default Amenities
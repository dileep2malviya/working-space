import React from 'react'

const Amenity = ({icon, text}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50 hover:border-blue-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </div>

      <span className="text-sm font-medium text-gray-700">
        {text}
      </span>
    </div>
  )
}

export default Amenity
import React from 'react'

const Loader = ({loadingName=""}) => {
  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="rounded-xl bg-white px-8 py-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <span className="text-lg font-medium text-gray-700">
          {loadingName}
        </span>
      </div>
    </div>
  </div>
  )
}

export default Loader
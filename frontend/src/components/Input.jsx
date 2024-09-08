import React from 'react'

const Input = ({type,name,value,onChange,label}) => {
  return (
    <div>
        <label
              htmlFor="sellerName"
              className="block text-sm font-medium text-gray-300"
            >
            {label}
            </label>
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              className="mt-1 tex-lg py-2 w-full rounded-md px-3 text-gray-300 border-gray-200 shadow-sm sm:text-sm "
            />
    </div>
  )
}

export default Input

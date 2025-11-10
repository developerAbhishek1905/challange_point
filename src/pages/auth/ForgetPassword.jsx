import React from 'react'
import loginImg from '/Art.png'

const ForgetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src={loginImg}
          alt="login"
          className="w-full h-full object-cover rounded-b-3xl md:rounded-none md:rounded-l-3xl"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 pb-[15rem]">
        <h2 className="text-3xl font-semibold mb-2 text-center text-black">Forget Password!</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Today is a new day. It's your day. You shape it.<br />
        </p>

        <form className="w-full max-w-sm space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Example@email.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md"
          >
            Send Link
          </button>
        </form>

        <footer className="mt-10 text-xs text-gray-400 text-center">
          © 2025 ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  )
}

export default ForgetPassword

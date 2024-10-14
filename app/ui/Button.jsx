'use client';

const Button = ({ label, color }) => {
    const colors = {
        green: " hover:bg-green-600 focus:border-green-300",
        blue: "bg-blue-200 hover:bg-blue-600 focus:border-blue-300",
        red: "bg-red-200 hover:bg-red-600 focus:border-red-300",
      };
    
      return (
        <button
          type="submit"
          className={`text-black hover:text-white mx-2 border-2 py-2 px-4 rounded-md focus:outline-none focus:ring ${
            colors[color] || colors.green
          }`}
        >
          {label}
        </button>
      );
}

export default Button

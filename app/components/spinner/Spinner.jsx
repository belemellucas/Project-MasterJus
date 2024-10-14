import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-t-transparent">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
  );
};

export default Spinner;

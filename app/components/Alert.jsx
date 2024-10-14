import { useState, useEffect } from "react";

const CenteredAlert = ({ message, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 text-white w-[300px] h-[120px] px-6 py-4 rounded shadow-md flex items-center justify-center text-center">
        {message}
      </div>
    </div>
  );
};

export default CenteredAlert;

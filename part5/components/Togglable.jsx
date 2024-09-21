import React, { useState } from 'react';

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <button onClick={toggleVisibility}>
        {visible ? 'Hide' : buttonLabel}
      </button>
      {visible && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default Togglable;

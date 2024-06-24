
import React from 'react';

const Notification = ({ message, error = false }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={error ? 'error' : 'message'}>
      {message}
    </div>
  );
};

export default Notification;

import React from 'react';

const successNotification = {
  color: 'green',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const errorNotification = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  if (message.includes('ERROR')) {
    return (
      <div style={errorNotification} className="error">
        {message}
      </div>
    );
  } else {
    return (
      <div style={successNotification} className="success">
        {message}
      </div>
    );
  }
};

export default Notification;


import React from 'react';

const CrashedOutPage = ({ crashedOut }) => {
  return (
    <div>
      <h1>Your Crashed Out Items:</h1>
      {crashedOut.map((item, index) => (
        <div key={index}>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
};
export default CrashedOutPage;

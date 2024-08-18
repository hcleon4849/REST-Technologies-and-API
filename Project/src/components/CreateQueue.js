// import React, { useState } from 'react';
// import axios from 'axios';

// const CreateQueue = () => {
//   const [queueName, setQueueName] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/queues', { name: queueName });
//       setQueueName('');
//       alert('Queue created successfully');
//     } catch (error) {
//       console.error("Error creating queue", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Create Queue</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Queue Name:
//           <input 
//             type="text" 
//             value={queueName} 
//             onChange={(e) => setQueueName(e.target.value)} 
//           />
//         </label>
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// };

// export default CreateQueue;


// CreateQueue.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateQueue = () => {
  const [queueName, setQueueName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token)
        if (!token) {
        throw new Error('No token found');
        }

        await axios.post('http://localhost:5000/api/queues', { name: queueName }, {
        headers: {
            'Authorization': `Bearer ${token}`, 
        }
        });


    setQueueName('');
      alert('Queue created successfully');
    } catch (error) {
      console.error("Error creating queue", error.response?.data || error.message);
      setError('Error creating queue. Please try again.');
    }
  };

  return (
    <div className="login-background1">
       <div className="login-container">
      <h2>Create Queue</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Queue Name:
          <input 
            type="text" 
            value={queueName} 
            onChange={(e) => setQueueName(e.target.value)} 
            required
          />
        </label>
        <button type="submit" className="btn-primary">Create</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
    </div>
   
  );
};

export default CreateQueue;

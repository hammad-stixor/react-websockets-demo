import './App.css';

import { FC, useEffect, useState } from 'react';
import { socket } from './socket';

const App: FC = () => {
  const [id, setId] = useState<number>();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error(error);
    };

    const handleListenId = (data: { message: string }) => {
      alert(data.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('listen-id', handleListenId);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('diconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('listen-id', handleListenId);
    };
  }, []);

  const handleHello = () => {
    if (isSocketConnected) {
      socket.emit('hello', 'Hello from client :)');
    } else {
      alert('Something went wrong with WebSockets :)');
    }
  };

  const handleWorld = (): void => {
    if (isSocketConnected) {
      if (!id) {
        return alert('ID is required!');
      }

      socket.emit('world', { id }, ({ message }: { message: string }) => {
        if (message) {
          alert(message);
        }
      });
    } else {
      alert('Something went wrong with WebSockets :)');
    }
  };

  return (
    <div>
      <h1>WebSockets Demo</h1>
      <div style={{ margin: '2rem 0' }}>
        <input
          style={{ width: '300px' }}
          type="number"
          placeholder="Enter Id"
          value={id}
          onChange={(e) => setId(parseFloat(e.target.value))}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          justifyContent: 'center',
        }}
      >
        <button onClick={handleHello}>Hello</button>
        <button onClick={handleWorld}>World</button>
      </div>
    </div>
  );
};

export default App;

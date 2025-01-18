import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import CameraScreen from './screens/CameraScreen';

export default function App() {
  const [response, setResponse] = useState('');
  const [showCamera, setShowCamera] = useState(false); // Toggle between test screen and camera

  const sendTestMessage = async () => {
    try {
      const res = await fetch('http://192.168.1.168:3001/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello from Expo!' }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
    }
  };

  if (showCamera) {
    // Render CameraScreen if `showCamera` is true
    return <CameraScreen />;
  }

  return (
    <View style={{ marginTop: 50, padding: 20 }}>
      <Button title="Send Test Message" onPress={sendTestMessage} />
      <Text>{response}</Text>
      <Button
        title="Open Camera"
        onPress={() => setShowCamera(true)} // Switch to CameraScreen
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

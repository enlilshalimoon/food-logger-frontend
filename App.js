import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import CameraScreen from './screens/CameraScreen';

export default function App() {
  const [response, setResponse] = useState('');
  const [showCamera, setShowCamera] = useState(false); // Toggle between test screen and camera

  // Test message function
  const sendTestMessage = async () => {
    try {
      const res = await fetch('http://192.168.1.38:3000/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello from Expo!' }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error sending test message:', error);
    }
  };

  // Render the CameraScreen if `showCamera` is true
  if (showCamera) {
    return <CameraScreen />;
  }

  // Default screen
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

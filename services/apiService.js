import * as FileSystem from "expo-file-system";

export const sendPhotoToBackend = async (photoUri) => {
  try {
    // Validate file existence
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    console.log("File info in sendPhotoToBackend:", fileInfo);
    if (!fileInfo.exists) {
      throw new Error("Photo file does not exist: " + photoUri);
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("photo", {
      uri: photoUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    console.log("Sending photo to backend...");

    // Send the photo to the backend
    const response = await fetch("http://192.168.1.38:3000/api/vision", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Log response for debugging
    console.log("Backend response status:", response.status);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Backend response:", result);
    return result;
  } catch (error) {
    console.error("Error in sendPhotoToBackend:", error);
    throw error;
  }
};
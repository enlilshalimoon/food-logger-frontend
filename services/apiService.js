import axios from "axios";
import getEnvVars from "../env";
import * as FileSystem from 'expo-file-system';

const { BASE_URL } = getEnvVars(); // Dynamically get the base URL

// API to calculate macros from a set of responses
export const calculateMacros = async (responses) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/calculate-macros`, {
      responses,
    });
    return response.data; // Return the API response
  } catch (error) {
    console.error('Error in calculateMacros API:', error.response?.data || error.message);
    throw error;
  }
};

// API to send a photo to the backend for processing
export const sendPhotoToBackend = async (photoUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    console.log("File info in sendPhotoToBackend:", fileInfo);
    if (!fileInfo.exists) {
      throw new Error("Photo file does not exist: " + photoUri);
    }

    const formData = new FormData();
    formData.append("photo", {
      uri: photoUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    console.log("Sending photo to backend...");

    const response = await fetch(`${BASE_URL}/api/vision`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

// API to calculate macros from a natural language text description
export const getMacrosFromText = async (text) => {
  console.log("Requesting macros from text:", text);
  console.log("Sending request to:", `${BASE_URL}/api/macros-from-text`);
  try {
    const response = await axios.post(`${BASE_URL}/api/macros-from-text`, {
      text,
    });
    console.log("Response from macros-from-text:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in getMacrosFromText API:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// API to adjust macros based on additional natural language input
export const adjustMacrosFromText = async ({ food, adjustmentText }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/adjust-macros`, {
      food,
      adjustmentText,
    });
    return response.data; // Return the API response
  } catch (error) {
    console.error("Error in adjustMacrosFromText API:", error.response?.data || error.message);
    throw error;
  }
};
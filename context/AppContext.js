import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  onboardingResponses: {},
  macros: { protein: 100, carbs: 300, fats: 70 }, // Example realistic starting values
  caloriesLeft: 2000,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
      case 'SET_MACROS':
      return {
        ...state,
        macros: action.payload.macros,
        caloriesLeft: action.payload.calories, // Set the initial calories
      };
    case 'SET_ONBOARDING_RESPONSES':
      return { ...state, onboardingResponses: action.payload };
      case 'UPDATE_CALORIES':
        return {
          ...state,
          caloriesLeft: state.caloriesLeft - action.payload, // subtract the payload
        };
      
      // or if you want macros too:
      case "UPDATE_MACROS":
        const { foodCalories, foodMacros } = action.payload;
      
        const updatedMacros = {
          protein: Math.max(0, (state.macros?.protein || 0) - (foodMacros?.protein || 0)),
          carbs: Math.max(0, (state.macros?.carbs || 0) - (foodMacros?.carbs || 0)),
          fats: Math.max(0, (state.macros?.fats || 0) - (foodMacros?.fats || 0)),
        };
      
        console.log("Updated macros in reducer:", updatedMacros);
      
        return {
          ...state,
          caloriesLeft: Math.max(0, state.caloriesLeft - (foodCalories || 0)),
          macros: updatedMacros,
        };
    default:
      return state;
  }
};

// 1) Export the created context so you can import { AppContext } elsewhere.
export const AppContext = createContext();

// 2) Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 3) Optional convenience hook to avoid importing useContext + AppContext everywhere
export const useAppContext = () => useContext(AppContext);
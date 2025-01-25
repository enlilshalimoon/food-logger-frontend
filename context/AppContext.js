import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  onboardingResponses: {},
  macros: null,
  caloriesLeft: 2000,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ONBOARDING_RESPONSES':
      return { ...state, onboardingResponses: action.payload };
    case 'SET_MACROS':
      return { ...state, macros: action.payload, caloriesLeft: action.payload.calories };
    case 'UPDATE_CALORIES':
      return { ...state, caloriesLeft: state.caloriesLeft - action.payload };
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
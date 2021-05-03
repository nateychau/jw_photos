import React, { useEffect, useState, useCallback } from 'react';

const AppContext = React.createContext();

// wip

export function AppProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const GET_ALL_URL = '/api';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(GET_ALL_URL);
      const data = await res.json();
      setPhotos(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ photos, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

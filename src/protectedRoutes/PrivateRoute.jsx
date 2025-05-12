import React from 'react'

export const PrivateRoute = ({children}) => {
    const isAuthenticated = true;
    return isAuthenticated  ? children : <Navigate to="/login" replace/>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get the current logged in user
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/api/current-user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

/**
 * Login a user
 */
export async function loginUser(username, password) {
  try {
    console.log('Login request payload:', { username, password: '****' });
    
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      // Remove these lines as they may conflict with credentials handling
      // mode: 'cors',
      // cache: 'no-cache',
    });
    
    console.log('Login response status:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Login failed with response:', data);
      throw new Error(data.error || 'Login failed');
    }
    
    console.log('Login successful, user data:', data.user);
    return data.user;
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
}

/**
 * Logout the current user
 */
export async function logoutUser() {
  try {
    const response = await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Logout failed');
    }

    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}
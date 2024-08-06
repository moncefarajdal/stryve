'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../store/sessionSlice';

export function SessionSwitcher() {
  const dispatch = useDispatch();
  const currentRole = useSelector(state => state.session.role);

  const handleSwitchRole = () => {
    const newRole = currentRole === 'writer' ? 'publisher' : 'writer';
    dispatch(setRole(newRole));
  };

  return (
    <button
      onClick={handleSwitchRole}
      className="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      Switch to {currentRole === 'writer' ? 'Publisher' : 'Writer'}
    </button>
  );
}
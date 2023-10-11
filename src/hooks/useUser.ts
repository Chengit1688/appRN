import {useState} from 'react';

export default function useUser() {
  const [user] = useState({});
  return {...user};
}

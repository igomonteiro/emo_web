import store from '@/store';
import api from '@/services/api';

store.subscribe((mutation) => {
  switch(mutation.type) {
    case 'auth/SET_TOKEN':
      if(mutation.payload) {
        api.defaults.headers.common['Authorization'] = `Bearer ${mutation.payload}`;
        localStorage.setItem('token', mutation.payload);
      } else {
        api.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('token');
      }
    break;
  }
});
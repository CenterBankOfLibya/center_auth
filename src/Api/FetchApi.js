import Swal from 'sweetalert2';

const BASE_URL = 'http://10.9.11.19:6001/api/v1'; // Replace with your actual base URL

const fetchData = async (
  endpoint,
  method = 'GET', // Default to GET method
  body,
  options = {}
) => {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    console.log('Fetching URL:', url);

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
    }

    var headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
if (endpoint == 'user/group/upload') {
  headers = {
    ...headers,
  
  };

}else{
  headers = {
    ...headers,
    'Content-Type': 'application/json',
  };
}
    const response = await fetch(url, {
      method,
      headers,
    body,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();

      if (
        error.message === "invalid signature" ||
        error.msg === "Token has expired" ||
        error.msg === "Not enough segments"
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '#/auth/login';
      }
      

      console.error('API Error:', error);
      return showErrorToast(`Error: ${error.error || error.message || 'An error occurred'}`);

    
    }
    if (["POST", "PATCH", "DELETE"].includes(method)) {
      showSuccessToast('Success: Request was successful');
    }

    return await response.json();
  } catch (error) {
   
    throw error;
  }
};

const showErrorToast = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: 'error',
    title: message,
  });
};

const showSuccessToast = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: 'success',
    title: message,
  });
};

export default fetchData;
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_FILE_URL}`,
  withCredentials: true,
});
const uploadFile = async (formData) => {
  const response = await axiosInstance.post(`/upload`, formData);
  return response.data;
};

export { uploadFile };
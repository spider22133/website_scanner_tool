import { AxiosResponse, AxiosError } from 'axios';

export default async function fetchData(promise: Promise<AxiosResponse<any>>, setter: React.Dispatch<React.SetStateAction<any>>): Promise<void> {
  promise
    .then(response => {
      setter(response.data.data);
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        console.log(error.response.data.message, error.response.status);
      }
    });
}

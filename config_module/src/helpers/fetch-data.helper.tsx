import { AxiosResponse, AxiosError } from 'axios';

export default async function fetchData(
  promise: Promise<AxiosResponse<any>>,
  setter: React.Dispatch<React.SetStateAction<any>>,
  addError: (message: string, status: number) => void,
): Promise<void> {
  promise
    .then(response => {
      setter(response.data.data);
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        addError(error.response.data.message, error.response.status);
      }
    });
}

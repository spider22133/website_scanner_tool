import { useState } from 'react';
import WebsiteDataService from '../../services/website.service';
import { useInput } from '../../helpers/form-input.helper';
import { AxiosError } from 'axios';
import { useAPIError } from '../../contexts/api-error.context';

export default function AddWebsite() {
  const [name, setName] = useInput('');
  const [url, setUrl] = useInput('');
  const [message, setMessage] = useState('');

  const { addError } = useAPIError();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    WebsiteDataService.create({ name: name, url: url })
      .then(response => {
        setMessage(`${response.data.data.name} successfully added!`);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  return (
    <div className="container">
      <div className="my-4">
        <h1>Add website</h1>
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Website name</label>
              <input className="form-control" type="text" name="name" id="name" placeholder="Name" value={name} onChange={setName} />
            </div>
            <div className="mb-3">
              <label className="form-label">Url address</label>
              <input className="form-control" type="text" name="url" id="url" placeholder="example.com" value={url} onChange={setUrl} />
            </div>
            <div className="d-flex justify-content-start">
              <button className="btn btn-warning" type="submit">
                Submit
              </button>
              <div className="m-0 p-2 text-success">{message && <>{message}</>}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

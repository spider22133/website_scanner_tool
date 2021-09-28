import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IWebsite from '../../interfaces/website.interface';
import WebsiteDataService from '../../services/website.service';
import { useInput } from '../../helpers/form-input.helper';
import { AxiosError } from 'axios';

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<IWebsite>();
  const [name, setName] = useInput('');
  const [url, setUrl] = useInput('');
  const [message, setMessage] = useState('');

  const Name = website ? website.name : '';
  const Url = website ? website.url : '';

  useEffect(() => {
    getWebsiteById(id);
  }, []);

  const getWebsiteById = (id: string) => {
    WebsiteDataService.getWebsiteById(id)
      .then(response => {
        setWebsite(response.data.data);
      })
      .catch((error: AxiosError) => {
        setMessage(`Error: ${error.response?.data.message}`);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    WebsiteDataService.update(id, { name: name || Name, url: url || Url })
      .then(response => {
        setWebsite(response.data.data);
        setMessage('Website successfully updated!');
      })
      .catch((error: AxiosError) => {
        setMessage(`Error: ${error.response?.data.message}`);
      });
  };

  return (
    <div className="container">
      <div className="my-4">
        <h1>Edit {website ? website.name : ''}</h1>
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Website name</label>
              <input className="form-control" type="text" name="name" id="name" placeholder="Name" value={name || Name} onChange={setName} />
            </div>
            <div className="mb-3">
              <label className="form-label">Url address</label>
              <input className="form-control" type="text" name="url" id="url" placeholder="name@example.com" value={url || Url} onChange={setUrl} />
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

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IWebsite from '../../interfaces/website.interface';
import WebsiteDataService from '../../services/website.service';

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<IWebsite>();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    getWebsiteById(id);
  }, []);

  const getWebsiteById = (id: string) => {
    WebsiteDataService.getWebsiteById(id).then(response => {
      setWebsite(response.data.data);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    WebsiteDataService.create({ name: name, url: url });
  };

  return (
    <div className="my-4">
      <h1>Edit {website ? website.name : ''}</h1>
      <div className="col-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Website name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={website ? website.name : '' || name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Url address</label>
            <input
              className="form-control"
              type="text"
              name="url"
              id="url"
              placeholder="name@example.com"
              value={website ? website.url : '' || url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>
          <button className="btn btn-warning" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

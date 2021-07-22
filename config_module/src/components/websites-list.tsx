import WebsitesListItem from './webseites-list-item.component';
import WebsiteDataService from '../services/website.service';
import { useEffect, useState } from 'react';
import IWebsite from '../interfaces/website.interface';
import { Link } from 'react-router-dom';

export default function WebsitesList() {
  const [websites, setWebsites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentWebsite, setCurrentWebsite] = useState<IWebsite | null>(null);

  useEffect(() => {
    getWebsites();
  }, []);

  const getWebsites = () => {
    WebsiteDataService.getAll().then(response => {
      setWebsites(response.data.data);
    });
  };

  const setActiveTutorial = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    setCurrentWebsite(website);
  };

  return (
    <div className="my-4">
      <div className="row">
        {' '}
        <div className="col-4">
          <ul className="list-group">
            {websites &&
              websites.map((website: IWebsite, index) => (
                <WebsitesListItem setActiveTutorial={setActiveTutorial} key={index} index={index} currentIndex={currentIndex} website={website} />
              ))}
          </ul>
        </div>
        <div className="col-8">
          {currentWebsite ? (
            <div>
              <h4>{currentWebsite.name}</h4>
              <div>
                <label>
                  <strong>Url:</strong>
                </label>{' '}
                <a href="{currentWebsite.url}">{currentWebsite.url}</a>
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{' '}
                {currentWebsite.is_active ? 'Aktive' : 'Not aktive'}
              </div>

              <Link to={'/websites/' + currentWebsite.id} className="btn btn-warning mt-2">
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please choose a Website...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

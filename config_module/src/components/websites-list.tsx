import WebsitesListItem from './webseites-list-item.component';
import CurrentWebsite from './current-website.component';
import StatesDataService from '../services/states.service';
import StatesTable from './states-table.component';
import WebsiteDataService from '../services/website.service';
import { useEffect, useState } from 'react';
import IWebsite from '../interfaces/website.interface';

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

  const getStatesByWebsiteId = (id: number) => {
    StatesDataService.getByWebsiteId(id).then(response => {
      console.log(response.data.data);
    });
  };

  const setActiveWebsite = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    setCurrentWebsite(website);
    getStatesByWebsiteId(website.id);
  };

  return (
    <div className="my-4">
      <div className="row">
        {' '}
        <div className="col-4">
          <ul className="list-group">
            {websites &&
              websites.map((website: IWebsite, index) => (
                <WebsitesListItem setActiveWebsite={setActiveWebsite} key={index} index={index} currentIndex={currentIndex} website={website} />
              ))}
          </ul>
        </div>
        <div className="col-8">
          <CurrentWebsite website={currentWebsite} />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <h2>Checks list</h2>
          {currentWebsite ? (
            <StatesTable websiteId={currentWebsite.id} />
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

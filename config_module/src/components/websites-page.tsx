import WebsitesListItem from './webseites-list-item.component';
import CurrentWebsite from './current-website.component';
import StatesDataService from '../services/states.service';
import StatesTable from './states-table.component';
import WebsiteDataService from '../services/website.service';
import { useEffect, useState } from 'react';
import IWebsite from '../interfaces/website.interface';
import IState from '../interfaces/website-state.interface';
import PaginationContainer from '../components/elements/pagination-container.component';

export default function WebsitesList() {
  const [websites, setWebsites] = useState<IWebsite[]>([]);
  const [states, setWebsiteStates] = useState<IState[]>([]);
  const [displayedStates, setDisplayedStates] = useState<IState[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWebsite, setCurrentWebsite] = useState<IWebsite | null>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    getWebsites();
  }, [websites.length]);

  useEffect(() => {
    getStatesByWebsiteId(1);
  }, []);

  useEffect(() => {
    onPageChange();
  }, [states]);

  const getWebsites = () => {
    WebsiteDataService.getAll().then(response => {
      setWebsites(response.data.data);
    });
  };

  const getStatesByWebsiteId = (id: number) => {
    StatesDataService.getByWebsiteId(id).then(response => {
      setWebsiteStates(response.data.data);
    });
  };

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;
    setDisplayedStates(states.slice(startItem, endItem));
  };

  const setActiveWebsite = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    setCurrentWebsite(website);
    getStatesByWebsiteId(website.id);
    setCurrentPage(1);
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
          <CurrentWebsite website={currentWebsite ? currentWebsite : websites[0]} />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <h2>Checks list</h2>
          <StatesTable states={displayedStates} />
          <div className="pagination">
            {states.length > 0 ? (
              <PaginationContainer
                totalItems={states.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                pageChange={onPageChange}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

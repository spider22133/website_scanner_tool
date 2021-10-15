import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import IWebsite from '../../interfaces/website.interface';
import IState from '../../interfaces/website-state.interface';
import WebsiteDataService from '../../services/website.service';
import PaginationContainer from './../elements/pagination-container.component';
import WebsitesListItem from './webseites-list-item.component';
import StatesDataService from '../../services/states.service';
import StatesTable from './states-table.component';
import ErrorTable from './error-table.component';
import ErrorsDataService from '../../services/errors.service';
import IWebsiteError from '../../interfaces/error.interface';
import fetchData from '../../helpers/fetch-data.helper';
import { useAPIError } from '../../contexts/api-error.context';
import Chart from '../elements/chart.component';

export default function WebsitesList() {
  const [websites, setWebsites] = useState<IWebsite[]>([]);
  const [states, setWebsiteStates] = useState<IState[]>([]);
  const [displayedStates, setDisplayedStates] = useState<IState[]>([]);
  const [aggrStates, setAggrStates] = useState<{ avg: number; min: number; max: number }>();
  const [errors, setWebsiteErrors] = useState<IWebsiteError[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { addError } = useAPIError();
  const itemsPerPage = 15;

  useEffect(() => {
    getWebsites();
  }, [websites.length]);

  useEffect(() => {
    getStatesByWebsiteId(1);
    getErrorsByWebsiteId(1);
    getAggrStates(1);
  }, []);

  useEffect(() => {
    onPageChange();
  }, [states]);

  const setActiveWebsite = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    getErrorsByWebsiteId(website.id);
    getStatesByWebsiteId(website.id);
    getAggrStates(website.id);
    setCurrentPage(1);
  };

  const getWebsites = async () => {
    await fetchData(WebsiteDataService.getAll(), setWebsites, addError);
  };

  const getAggrStates = (id: number | undefined) => {
    fetchData(StatesDataService.getAggregatedDataByWebsiteId(id), setAggrStates, addError);
  };

  const getStatesByWebsiteId = (id: number | undefined) => {
    fetchData(StatesDataService.getStatesByWebsiteId(id), setWebsiteStates, addError);
  };

  const getErrorsByWebsiteId = (id: number | undefined) => {
    fetchData(ErrorsDataService.getErrorsByWebsiteId(id), setWebsiteErrors, addError);
  };

  const handleRemove = (id: number | undefined) => {
    WebsiteDataService.deleteWebsite(id)
      .then(() => {
        const newList: IWebsite[] = websites.filter(item => item.id !== id);
        setWebsites(newList);
      })
      .catch((error: AxiosError) => {
        console.log('Error: ', error.response?.data.message);
      });
  };

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;
    setDisplayedStates(states.slice(startItem, endItem));
  };

  return (
    <div className="container-fluid">
      <div className="my-4">
        <div className="row">
          <div className="col col-lg-5 mb-3">
            <ul className="list-group list-group-numbered">
              {websites &&
                websites.map((website: IWebsite, index) => (
                  <WebsitesListItem
                    setActiveWebsite={setActiveWebsite}
                    handleRemove={handleRemove}
                    key={index}
                    index={index}
                    currentIndex={currentIndex}
                    website={website}
                  />
                ))}
            </ul>
          </div>
          <div className="col col-lg-7 scrollable">
            {errors.length > 0 ? (
              <div className="border border-danger border-2 rounded-2 p-4 mb-3">
                <h2 className="">Error list</h2>
                <ErrorTable errors={errors} />
              </div>
            ) : (
              ''
            )}
            <div className="border border-gray border-2 rounded-2 p-4 mb-3">
              <Chart states={states} />
              <div className="d-flex aggregates justify-content-center w-100 text-center">
                <div className="me-5">
                  Average
                  <br />
                  <p style={{ color: 'black' }}>{Math.round(aggrStates ? aggrStates.avg : 0) / 1000} Sec(s)</p>
                </div>
                <div className="me-5">
                  The fastest
                  <br />
                  <p style={{ color: 'black' }}>{(aggrStates ? aggrStates.min : 0) / 1000} Sec(s)</p>
                </div>
                <div className="me-5">
                  The slowest
                  <br />
                  <p style={{ color: 'black' }}>{(aggrStates ? aggrStates.max : 0) / 1000} Sec(s)</p>
                </div>
              </div>
            </div>
            <div className="border border-gray border-2 rounded-2 p-4">
              <h2>Check list</h2>
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
      </div>
    </div>
  );
}

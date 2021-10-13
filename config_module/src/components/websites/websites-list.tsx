import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useAPIError } from '../../contexts/api-error.context';
import { getChartData } from '../../helpers/chart.helper';
import IWebsite from '../../interfaces/website.interface';
import IState from '../../interfaces/website-state.interface';
import WebsiteDataService from '../../services/website.service';
import PaginationContainer from './../elements/pagination-container.component';
import WebsitesListItem from './webseites-list-item.component';
import StatesDataService from '../../services/states.service';
import StatesTable from './states-table.component';
import Chart from 'react-apexcharts';

export default function WebsitesList() {
  const [websites, setWebsites] = useState<IWebsite[]>([]);
  const [states, setWebsiteStates] = useState<IState[]>([]);
  const [displayedStates, setDisplayedStates] = useState<IState[]>([]);
  const [aggrStates, setAggrStates] = useState<{ avg: number; min: number; max: number }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { series, options } = getChartData(states);
  const { addError } = useAPIError();
  const itemsPerPage = 15;

  useEffect(() => {
    getWebsites();
  }, [websites.length]);

  useEffect(() => {
    getStatesByWebsiteId(1);
    getAggrStates(1);
  }, []);

  useEffect(() => {
    onPageChange();
  }, [states]);

  const setActiveWebsite = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    getStatesByWebsiteId(website.id);
    getAggrStates(website.id);
    setCurrentPage(1);
  };

  const getWebsites = () => {
    WebsiteDataService.getAll()
      .then(response => {
        setWebsites(response.data.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  const getAggrStates = (id: number | undefined) => {
    StatesDataService.getAggregatedDataByWebsiteId(id)
      .then(response => {
        setAggrStates(response.data.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  const getStatesByWebsiteId = (id: number | undefined) => {
    StatesDataService.getStatesByWebsiteId(id)
      .then(response => {
        setWebsiteStates(response.data.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;
    setDisplayedStates(states.slice(startItem, endItem));
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

  return (
    <div className="container">
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
          <div className="col col-lg-7">
            <div className="border border-danger border-2 rounded-2 p-4 mb-3">
              <h2 className=" text-danger">Error list</h2>
            </div>
            <div className="border border-gray border-2 rounded-2 p-4 mb-3">
              <Chart options={options} series={series} type="area" height={350} />
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
      </div>
    </div>
  );
}

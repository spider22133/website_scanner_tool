import { useEffect, useState } from 'react';
import IWebsite from '../../interfaces/website.interface';
import IState from '../../interfaces/website-state.interface';
import PaginationContainer from './../elements/pagination-container.component';
import WebsitesListItem from './webseites-list-item.component';
import StatesDataService from '../../services/states.service';
import StatesTable from './states-table.component';
import ErrorTable from './error-table.component';
import ErrorsDataService from '../../services/errors.service';
import IWebsiteError from '../../interfaces/error.interface';
import fetchData from '../../helpers/fetch-data.helper';
import Chart from '../elements/chart.component';
import { IoAdd } from 'react-icons/io5';
import AddWebsite from './add-website.component';
import { motion } from 'framer-motion';

import { retrieveWebsites } from '../../slices/websites.slice';
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { getStatesByWebsiteId, selectAllStates } from '../../slices/states.slice';

const variants = {
  open: { height: '100%', opacity: 1 },
  closed: { height: '0px', opacity: 0 },
};

export default function WebsitesList() {
  const itemsPerPage = 15;
  const dispatch = useAppDispatch();

  const { websites } = useSelector((state: RootState) => state.websites);
  const { user } = useSelector((state: RootState) => state.auth);
  const states = useSelector(selectAllStates);

  const [displayedStates, setDisplayedStates] = useState<IState[]>([]);
  const [aggrStates, setAggrStates] = useState<{ avg: number; min: number; max: number }>();
  const [errors, setWebsiteErrors] = useState<IWebsiteError[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(retrieveWebsites());
    dispatch(getStatesByWebsiteId('1'));
    getAggrStates('1');
  }, [dispatch]);

  useEffect(() => {
    onPageChange();
  }, [states]);

  const setActiveWebsite = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    setCurrentPage(1);

    dispatch(getStatesByWebsiteId(website.id));

    getErrorsByWebsiteId(website.id);
    getAggrStates(website.id);
  };

  const getAggrStates = (id: string) => {
    fetchData(StatesDataService.getAggregatedDataByWebsiteId(id), setAggrStates);
  };

  const getErrorsByWebsiteId = (id: string) => {
    fetchData(ErrorsDataService.getErrorsByWebsiteId(id), setWebsiteErrors);
  };

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;
    console.log(states);
    setDisplayedStates(states.slice(startItem, endItem));
  };

  // TODO Search Component

  return (
    <div className="container">
      <div className="my-4">
        <div className="row">
          <div className="col col-lg-5 mb-3 d-flex flex-column list-component">
            <ul className="list-group list-group-numbered">
              {websites &&
                websites.map((website: IWebsite, index) => (
                  <WebsitesListItem setActiveWebsite={setActiveWebsite} key={index} index={index} currentIndex={currentIndex} website={website} />
                ))}
            </ul>

            <motion.div
              animate={showAddForm ? 'open' : 'closed'}
              variants={variants}
              initial="closed"
              transition={{ ease: 'easeOut', duration: '0.5' }}
            >
              <AddWebsite showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
            </motion.div>

            {user.roles &&
              (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR')) &&
              (!showAddForm ? (
                <button
                  className="btn btn-outline-primary btn-sm rounded-2 mb-1"
                  style={{ zIndex: 1 }}
                  type="button"
                  title="Add"
                  onClick={() => setShowAddForm(showAddForm => !showAddForm)}
                >
                  <IoAdd size="1.7em" />
                </button>
              ) : null)}
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
            <div className="border border-gray border-2 rounded-2 p-4 mb-3">{<Chart states={states} aggrStates={aggrStates} />}</div>
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

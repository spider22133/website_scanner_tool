import IWebsite from '../../interfaces/website.interface';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import { RootState, useAppDispatch } from '../../store';
import { deleteWebsite } from '../../slices/websites.slice';
import EditWebsite from './edit-website.component';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

type Props = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  setActiveWebsite: SetActiveTutorial;
};

type SetActiveTutorial = (website: IWebsite, index: number) => void;

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export default function WebsitesListItem({ website, index, currentIndex, setActiveWebsite }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  const [showAddForm, setShowAddForm] = useState(false);
  const dispatch = useAppDispatch();

  const handleRemove = (id: string) => {
    dispatch(deleteWebsite({ id }));
  };

  return (
    <>
      <li
        className={`list-group-item border-2 d-flex flex-column list-group-item-action ${index === currentIndex ? 'active' : ''}`}
        onClick={() => setActiveWebsite(website, index)}
      >
        <div className="d-flex justify-content-between align-items-start align-items-center w-100" style={{ paddingLeft: '15px' }}>
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              {website.name}{' '}
              {website.is_active ? <span className="badge bg-success ms-2">Online</span> : <span className="badge bg-danger ms-2">Offline</span>}
            </div>
            <a href={website.url}>{website.url}</a>
          </div>
          <div className="">
            {(user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR')) && (
              <button className="btn btn-outline-warning rounded-2 ms-2" onClick={() => setShowAddForm(showAddForm => !showAddForm)}>
                <IoCreateOutline />
              </button>
            )}
            {user.roles.includes('ROLE_ADMIN') && (
              <button
                className="btn btn-outline-danger rounded-2 ms-2"
                type="button"
                title="Delete"
                onClick={() => {
                  window.confirm('Are you sure you wish to delete this item?') ? handleRemove(website.id) : '';
                }}
              >
                <IoTrashOutline />
              </button>
            )}
          </div>
        </div>

        <motion.div
          className="w-100"
          animate={showAddForm ? 'open' : 'closed'}
          variants={variants}
          initial="closed"
          transition={{ ease: 'easeOut', duration: '0.5' }}
        >
          <EditWebsite showAddForm={showAddForm} setShowAddForm={setShowAddForm} website={website} />
        </motion.div>
      </li>
    </>
  );
}

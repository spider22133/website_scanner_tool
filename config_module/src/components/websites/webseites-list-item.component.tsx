import { Link } from 'react-router-dom';
import IWebsite from '../../interfaces/website.interface';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import { useAppDispatch } from '../../store';
import { deleteWebsite } from '../../slices/websites.slice';

type Props = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  setActiveWebsite: SetActiveTutorial;
};

type SetActiveTutorial = (website: IWebsite, index: number) => void;

export default function WebsitesListItem({ website, index, currentIndex, setActiveWebsite }: Props) {
  const dispatch = useAppDispatch();
  const handleRemove = (id: string) => {
    dispatch(deleteWebsite({ id }));
  };

  return (
    <>
      <li
        className={`list-group-item border-2 d-flex justify-content-between list-group-item-action align-items-start ${
          index === currentIndex ? 'active' : ''
        }`}
        onClick={() => setActiveWebsite(website, index)}
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">
            {website.name}{' '}
            {website.is_active ? <span className="badge bg-success ms-2">Online</span> : <span className="badge bg-danger ms-2">Offline</span>}
          </div>
          <a href={website.url}>{website.url}</a>
        </div>

        <Link to={'/websites/' + website.id} className="btn btn-outline-warning rounded-2 ms-2">
          <IoCreateOutline />
        </Link>
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
      </li>
    </>
  );
}

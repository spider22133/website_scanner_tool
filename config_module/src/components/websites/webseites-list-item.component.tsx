import { Link } from 'react-router-dom';
import IWebsite from '../../interfaces/website.interface';

type Props = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  setActiveWebsite: SetActiveTutorial;
};

type SetActiveTutorial = (website: IWebsite, index: number) => void;

export default function WebsitesListItem({ website, index, currentIndex, setActiveWebsite }: Props) {
  return (
    <>
      <li
        className={`list-group-item d-flex justify-content-between list-group-item-action align-items-start ${
          index === currentIndex ? 'active' : ''
        }`}
        onClick={() => setActiveWebsite(website, index)}
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{website.name}</div>
          <a href={website.url}>{website.url}</a>
        </div>
        {website.is_active ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Offline</span>}
        <Link to={'/websites/' + website.id} className="badge bg-warning text-dark link-secondary ms-2">
          Edit
        </Link>
      </li>
    </>
  );
}

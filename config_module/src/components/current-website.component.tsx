import { Link } from 'react-router-dom';
import IWebsite from '../interfaces/website.interface';
type CurrentWebsiteProps = {
  website: IWebsite | null;
};

export default function currentWebsite({ website }: CurrentWebsiteProps) {
  return (
    <>
      {website ? (
        <div>
          <h4>{website.name}</h4>
          <div>
            <label>
              <strong>Url:</strong>
            </label>{' '}
            <a href={website.url}>{website.url}</a>
          </div>
          <div>
            <label>
              <strong>Status:</strong>
            </label>{' '}
            {website.is_active ? 'Aktive' : 'Not aktive'}
          </div>

          <Link to={'/websites/' + website.id} className="btn btn-warning mt-2">
            Edit
          </Link>
        </div>
      ) : (
        <div>
          <br />
          <p>Please choose a Website...</p>
        </div>
      )}
    </>
  );
}

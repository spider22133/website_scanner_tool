import IWebsite from '../interfaces/website.interface';

type ItemProps = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  setActiveWebsite: SetActiveTutorial;
};

type SetActiveTutorial = (website: IWebsite, index: number) => void;

export default function WebsitesListItem({ website, index, currentIndex, setActiveWebsite }: ItemProps) {
  return (
    <>
      <li className={`list-group-item ${index === currentIndex ? 'active' : ''}`} onClick={() => setActiveWebsite(website, index)}>
        {website.name}
      </li>
    </>
  );
}

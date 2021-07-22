import IWebsite from '../interfaces/website.interface';

type ItemProps = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  setActiveTutorial: SetActiveTutorial;
};

type SetActiveTutorial = (website: IWebsite, index: number) => void;

export default function WebsitesListItem({ website, index, currentIndex, setActiveTutorial }: ItemProps) {
  return (
    <>
      <li className={`list-group-item ${index === currentIndex ? 'active' : ''}`} onClick={() => setActiveTutorial(website, index)}>
        {website.name}
      </li>
    </>
  );
}

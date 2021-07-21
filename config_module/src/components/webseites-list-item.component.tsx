import IWebsite from '../interfaces/website.interface';

type ItemProps = {
    key: number;
    website: IWebsite;
}
export default function WebsitesListItem({website, key}: ItemProps) {
    return (
        <>
            <li key={key} className="list-group-item active">{website.name}</li>
        </>
    );
}
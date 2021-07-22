import WebsitesListItem from "./webseites-list-item.component";
import WebsiteDataService from "../services/website.service";
import { useEffect, useState } from "react";
import IWebsite from '../interfaces/website.interface';

export default function WebsitesList() {
    const [websites, setWebsites] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        getWebsites();
    }, []);

    const getWebsites = () => {
        WebsiteDataService.getAll()
            .then(response => {
                setWebsites(response.data.data)
            })
    }

    const setActiveTutorial = (website: IWebsite, index: number) => {
        setCurrentIndex(index);
    }

    return (
        <div className="my-4">
            <div className="col-4">
                <ul className="list-group">
                    {websites && websites.map((website: IWebsite, index) => (
                        <WebsitesListItem setActiveTutorial={setActiveTutorial}
                            key={index}
                            index={index}
                            currentIndex={currentIndex}
                            website={website} />
                    ))}
                </ul>
            </div>
            <div className="col-8">

            </div>
        </div>
    );
}
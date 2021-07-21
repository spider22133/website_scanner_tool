import WebsitesListItem from "./webseites-list-item.component";
import WebsiteDataService from "../services/website.service";
import { useEffect, useState } from "react";
import IWebsite from '../interfaces/website.interface'

export default function WebsitesList() {
    const [websites, setWebsites] = useState([]);

    useEffect(() => {
        getWebsites();
      }, []);

    const getWebsites = () => {
        WebsiteDataService.getAll()
        .then(response => {
            setWebsites(response.data.data)
            console.log(response.data.data);
        })
    }
    return (
        <>
            <div className="col-4">
                <ul className="list-group">
                    {websites && websites.map((website: IWebsite, index) => (
                        <WebsitesListItem key={index} website={website}/>
                    ))}
                </ul>
            </div>
            <div className="col-8">

            </div>
        </>
    );
}
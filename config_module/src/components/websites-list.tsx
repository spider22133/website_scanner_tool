import WebsitesListItem from "./webseites-list-item.component";
import WebsiteDataService from "../services/website.service";
import { useEffect, useState } from "react";

export default function WebsitesList() {
    const [websites, setWebsites] = useState([]);

    useEffect(() => {
        getWebsites();
      }, []);

    const getWebsites = () => {
        WebsiteDataService.getAll()
        .then(response => {
            setWebsites(response.data)
            console.log(response.data);
        })
    }
    return (
        <>
            <div className="col-6">
                <ul className="list-group">
                    <WebsitesListItem />
                </ul>
            </div>
            <div className="col-6">

            </div>
        </>
    );
}
import IWebsite from '../../interfaces/website.interface';
import WebsitesListItem from './webseites-list-item.component';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { List } from '@mui/material';

type Props = {
  currentIndex: number;
  setActiveWebsite: (website: IWebsite, index: number) => void;
};

const WebsitesList: React.FC<Props> = ({ setActiveWebsite, currentIndex }) => {
  const { websites } = useSelector((state: RootState) => state.websites);
  const dispatch = useAppDispatch();

  return (
    <List>
      {websites &&
        websites.map((website: IWebsite, index) => (
          <WebsitesListItem key={index} index={index} currentIndex={currentIndex} website={website} setActiveWebsite={setActiveWebsite} />
        ))}
    </List>
  );
};

export default WebsitesList;

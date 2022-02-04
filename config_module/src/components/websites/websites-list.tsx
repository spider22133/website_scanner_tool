import IWebsite from '../../interfaces/website.interface';
import WebsitesListItem from './webseites-list-item.component';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Box, List, Typography } from '@mui/material';

type Props = {
  currentIndex: number;
  showHidden: boolean;
  setActiveWebsite: (website: IWebsite, index: number) => void;
};

const WebsitesList: React.FC<Props> = ({ setActiveWebsite, currentIndex, showHidden }) => {
  const { websites } = useSelector((state: RootState) => state.websites);

  const countByVisibility = (isHidden: boolean) => {
    return websites.filter(website => website.is_hidden === isHidden).length;
  };

  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Typography variant="body2">
          Hidden: {countByVisibility(true)} / Visible: {countByVisibility(false)} / Total: {websites.length}
        </Typography>
      </Box>
      <List>
        {websites &&
          websites.map((website: IWebsite, index) => (
            <WebsitesListItem
              key={index}
              index={index}
              currentIndex={currentIndex}
              website={website}
              showHidden={showHidden}
              setActiveWebsite={setActiveWebsite}
            />
          ))}
      </List>
    </>
  );
};

export default WebsitesList;

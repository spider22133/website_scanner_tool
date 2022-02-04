import IWebsite from '../../interfaces/website.interface';
import { RootState, useAppDispatch } from '../../store';
import { deleteWebsite } from '../../slices/websites.slice';
import EditWebsite from './edit-website.component';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { IconButton, ListItem, Stack, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

type Props = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  setActiveWebsite: (website: IWebsite, index: number) => void;
};

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export default function WebsitesListItem({ website, index, currentIndex, setActiveWebsite }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const [value, setValue] = useState({
    toggleVisible: false,
  });

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleRemove = (id: string) => {
    dispatch(deleteWebsite({ id }));
  };

  return (
    <>
      <ListItem
        className={`d-flex flex-column`}
        sx={{ my: 0.5, border: `2px solid ${index === currentIndex ? theme.palette.info.main : theme.palette.grey.A200}`, borderRadius: 1 }}
        onClick={() => setActiveWebsite(website, index)}
      >
        <div className="d-flex justify-content-between align-items-start align-items-center w-100">
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              {website.name}{' '}
              {website.is_active ? <span className="badge bg-success ms-2">Online</span> : <span className="badge bg-danger ms-2">Offline</span>}
            </div>
            <a href={website.url}>{website.url}</a>
          </div>
          <div className="">
            <Stack direction="row" alignItems="center">
              <IconButton
                aria-label="toggle visibility"
                onClick={e => {
                  e.stopPropagation();
                  setValue({ toggleVisible: !value.toggleVisible });
                }}
              >
                {value.toggleVisible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              {user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR')) && (
                <IconButton aria-label="edit" onClick={() => setShowAddForm(showAddForm => !showAddForm)}>
                  <EditIcon />
                </IconButton>
              )}
              {user.roles && user.roles.includes('ROLE_ADMIN') && (
                <IconButton
                  aria-label="edit"
                  color="error"
                  onClick={() => {
                    window.confirm('Are you sure you wish to delete this item?') ? handleRemove(website.id) : '';
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          </div>
        </div>

        <motion.div
          className="w-100"
          animate={showAddForm ? 'open' : 'closed'}
          variants={variants}
          initial="closed"
          transition={{ ease: 'easeOut', duration: '0.5' }}
        >
          <EditWebsite showAddForm={showAddForm} setShowAddForm={setShowAddForm} website={website} />
        </motion.div>
      </ListItem>
    </>
  );
}

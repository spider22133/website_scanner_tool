import IWebsite from '../../interfaces/website.interface';
import { RootState, useAppDispatch } from '../../store';
import { deleteWebsite, updateWebsite } from '../../slices/websites.slice';
import EditWebsite from './edit-website.component';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Chip, IconButton, Link, ListItem, Stack, Tooltip, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

type Props = {
  index: number;
  website: IWebsite;
  currentIndex: number;
  showHidden: boolean;
  setActiveWebsite: (website: IWebsite, index: number) => void;
};

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export default function WebsitesListItem({ website, index, currentIndex, setActiveWebsite, showHidden }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const timeAgo = new TimeAgo('en-US');

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleRemove = (id: string) => {
    dispatch(deleteWebsite({ id }));
  };

  const listItem = () => {
    return (
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
            <Link href={website.url} underline="none" variant="body2">
              {website.url}
            </Link>
          </div>
          <div className="">
            <Stack direction="column" alignItems="flex-end">
              <Stack direction="row" alignItems="center">
                <Tooltip title="Check" arrow>
                  <IconButton aria-label="check">
                    <SensorsOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={website.is_hidden ? 'Show' : 'Hide'} arrow>
                  <IconButton
                    aria-label="toggle visibility"
                    onClick={e => {
                      e.stopPropagation();
                      dispatch(updateWebsite({ ...website, is_hidden: !website.is_hidden }));
                    }}
                  >
                    {website.is_hidden ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
                {user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR')) && (
                  <Tooltip title="Edit" arrow>
                    <IconButton aria-label="edit" onClick={() => setShowAddForm(showAddForm => !showAddForm)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {user.roles && user.roles.includes('ROLE_ADMIN') && (
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      aria-label="edit"
                      color="error"
                      onClick={() => {
                        window.confirm('Are you sure you wish to delete this item?') ? handleRemove(website.id) : '';
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
              {website.updatedAt && (
                <Chip
                  icon={<DoneAllOutlinedIcon />}
                  sx={{ '& .MuiChip-iconSmall': { ml: '5px' } }}
                  variant="outlined"
                  size="small"
                  label={timeAgo.format(new Date(website.updatedAt))}
                />
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
    );
  };

  return <>{showHidden ? listItem() : !website.is_hidden && listItem()}</>;
}

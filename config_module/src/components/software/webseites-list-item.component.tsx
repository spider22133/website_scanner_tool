import { WinGetSoftwareEntry } from '../../../../types/common'
import { RootState, useAppDispatch } from '../../store'
import { deleteWebsite, updateWebsite } from '../../slices/software.slice'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Chip, IconButton, Link, ListItem, Stack, Tooltip, useTheme } from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import fetchData from '../../helpers/fetch-data.helper'
import IState from '../../interfaces/website-state.interface'
import WebsiteDataService from '../../services/website.service'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined'

TimeAgo.addDefaultLocale(en)

type Props = {
  index: number
  software: WinGetSoftwareEntry
  currentIndex: number
  showHidden: boolean
  setActiveWebsite: (software: WinGetSoftwareEntry, index: number) => void
}

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
}

export default function WebsitesListItem({ software, index, currentIndex, setActiveWebsite, showHidden }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [showAddForm, setShowAddForm] = useState(false)
  const [latestState, setLatestState] = useState<IState>()

  const timeAgo = new TimeAgo('en-US')
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const handleRemove = (id: string) => {
    dispatch(deleteWebsite({ id }))
  }

  const checkStatus = (id: string) => {
    fetchData(WebsiteDataService.checkStatus(id), setLatestState)
  }

  const listItem = () => {
    return (
      <ListItem
        className={`d-flex flex-column`}
        sx={{
          my: 0.5,
          border: `2px solid ${index === currentIndex ? theme.palette.info.main : theme.palette.grey.A200}`,
          borderRadius: 1,
        }}
        onClick={() => setActiveWebsite(software, index)}
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="ms-2 me-auto">
            <div className="d-flex align-items-center fw-bold">
              {software.name}
              {software.is_current ? (
                <CheckCircleOutlineOutlinedIcon className={`ms-2`} sx={{ color: 'success.main', fontSize: 20 }} />
              ) : (
                <UnpublishedOutlinedIcon className={`ms-2`} sx={{ color: 'error.main', fontSize: 20 }} />
              )}
            </div>
            <Link href={software.details?.homepage} underline="none" variant="body2" target="_blank">
              {software.details?.homepage}
            </Link>
          </div>
          <div className="">
            <Stack direction="column" alignItems="flex-end">
              <Stack direction="row" alignItems="center">
                <Tooltip title="Check" arrow>
                  <IconButton
                    aria-label="check"
                    onClick={e => {
                      e.stopPropagation()
                      checkStatus(software.winget_id)
                    }}
                  >
                    <SensorsOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={software.is_hidden ? 'Show' : 'Hide'} arrow>
                  <IconButton
                    aria-label="toggle visibility"
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(updateWebsite({ ...software, is_hidden: !software.is_hidden }))
                    }}
                  >
                    {software.is_hidden ? <VisibilityOff /> : <Visibility />}
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
                        window.confirm('Are you sure you wish to delete this item?') ? handleRemove(software.winget_id) : ''
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
              {latestState && (
                <Chip
                  icon={<DoneAllOutlinedIcon />}
                  sx={{ '& .MuiChip-iconSmall': { ml: '5px' } }}
                  variant="outlined"
                  size="small"
                  label={timeAgo.format(new Date(latestState.createdAt))}
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
          {/*<EditWebsite showAddForm={showAddForm} setShowAddForm={setShowAddForm} software={software} />*/}
        </motion.div>
      </ListItem>
    )
  }

  return <>{showHidden ? listItem() : !software.is_hidden && listItem()}</>
}

import { SoftwareEntry } from '../../../../types/common'
import { RootState, useAppDispatch } from '../../store'
import { checkSoftware, deleteWebsite, updateSoftware } from '../../slices/software.slice'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Chip, IconButton, ListItem, Stack, Tooltip, Typography, useTheme, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/de.json'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'

TimeAgo.addDefaultLocale(en)

type Props = {
  index: number
  software: SoftwareEntry
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
}

export default function WebsitesListItem({ software, index, currentIndex, setActiveWebsite }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isChecking, setIsChecking] = useState(false) // Local state to track loading for this item

  const timeAgo = new TimeAgo('de-DE')
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const handleRemove = (id: string) => {
    dispatch(deleteWebsite({ id }))
  }

  const checkStatus = async (id: string) => {
    setIsChecking(true)
    await dispatch(checkSoftware(id))
    setIsChecking(false)
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
          <Stack direction="row" alignItems="center" spacing={2}>
            <Inventory2OutlinedIcon />
            <div className="me-auto">
              <div className="d-flex align-items-center fw-bold">
                {software.name}
                {software.is_current ? (
                  <CheckCircleOutlineOutlinedIcon className={`ms-2`} sx={{ color: 'success.main', fontSize: 20 }} />
                ) : (
                  <UnpublishedOutlinedIcon className={`ms-2`} sx={{ color: 'error.main', fontSize: 20 }} />
                )}
              </div>
              <Typography variant="body2">{software.details?.publisher}</Typography>
            </div>
          </Stack>

          <div className="">
            <Stack direction="column" alignItems="flex-end">
              <Stack direction="row" alignItems="center">
                <Tooltip title="Prüfen" arrow>
                  {isChecking ? (
                    <CircularProgress color="inherit" size="16px" sx={{ m: '12px' }} />
                  ) : (
                    <IconButton
                      aria-label="prüfen"
                      onClick={e => {
                        e.stopPropagation()
                        checkStatus(software.winget_id)
                      }}
                    >
                      <SensorsOutlinedIcon />
                    </IconButton>
                  )}
                </Tooltip>
                <Tooltip title={software.is_hidden ? 'Anzeigen' : 'Ausblenden'} arrow>
                  <IconButton
                    aria-label="Sichtbarkeit umschalten"
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(updateSoftware({ ...software, is_hidden: !software.is_hidden }))
                    }}
                  >
                    {software.is_hidden ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
                {/* {user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR')) && (
                  <Tooltip title="Bearbeiten" arrow>
                    <IconButton aria-label="bearbeiten" onClick={() => setShowAddForm(showAddForm => !showAddForm)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )} */}
                {user.roles && user.roles.includes('ROLE_ADMIN') && (
                  <Tooltip title="Löschen" arrow>
                    <IconButton
                      aria-label="löschen"
                      color="error"
                      onClick={() => {
                        window.confirm('Sind Sie sicher, dass Sie dieses Element löschen möchten?') ? handleRemove(software.winget_id) : ''
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
              {software.updatedAt && (
                <Chip
                  icon={<DoneAllOutlinedIcon />}
                  sx={{ '& .MuiChip-iconSmall': { ml: '5px' } }}
                  variant="outlined"
                  size="small"
                  label={timeAgo.format(new Date(software.updatedAt))}
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

  return <>{listItem()}</>
}

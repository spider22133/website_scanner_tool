import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  IconButtonProps,
  Link,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import ReactJson from 'react-json-view'
import IWebsiteControlStep from '../../interfaces/website_control_step.interface'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import TimeAgo from 'javascript-time-ago'
import IState from '../../interfaces/website-state.interface'
import fetchData from '../../helpers/fetch-data.helper'
import StatesDataService from '../../services/states.service'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useAppDispatch } from '../../store'
import { updateWebsiteControlStep } from '../../slices/websites_control_steps.slice'

type Props = {
  step: IWebsiteControlStep
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const ApiStepComponent: React.FC<Props> = ({ step }) => {
  const [latestState, setLatestState] = useState<IState>()
  const [expanded, setExpanded] = React.useState(true)
  const timeAgo = new TimeAgo('en-US')

  const { id, website_id, path, description, api_call_data } = step

  const dispatch = useAppDispatch()

  const getLatestState = (id: string) => {
    fetchData(StatesDataService.getLatestStateByStepId(id), setLatestState)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    step && getLatestState(step.id)
  }, [])

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardHeader subheader="Parse current software version:" />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box>
            <Typography variant="body2">Use JSON Profile:</Typography>
            <ReactJson
              src={JSON.parse(step.api_call_data)}
              collapsed={false}
              iconStyle="circle"
              onEdit={({ updated_src }) =>
                dispatch(
                  updateWebsiteControlStep({
                    id,
                    website_id,
                    path,
                    description,
                    api_call_data: JSON.stringify(updated_src),
                  }),
                )
              }
              onAdd={({ updated_src }) =>
                dispatch(
                  updateWebsiteControlStep({
                    id,
                    website_id,
                    path,
                    description,
                    api_call_data: JSON.stringify(updated_src),
                  }),
                )
              }
              onDelete={({ updated_src }) =>
                dispatch(
                  updateWebsiteControlStep({
                    id,
                    website_id,
                    path,
                    description,
                    api_call_data: JSON.stringify(updated_src),
                  }),
                )
              }
            />
          </Box>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
        {latestState && (
          <Chip
            icon={<DoneAllOutlinedIcon />}
            sx={{ '& .MuiChip-iconSmall': { ml: '5px' }, ml: 1 }}
            variant="outlined"
            size="small"
            label={timeAgo.format(new Date(latestState.createdAt))}
          />
        )}
        <ExpandMore expand={expanded} onClick={handleExpandClick}>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  )
}

export default ApiStepComponent

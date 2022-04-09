import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import ReactJson from 'react-json-view';
import IWebsiteControlStep from '../../interfaces/website_control_step.interface';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import TimeAgo from 'javascript-time-ago';
import IState from '../../interfaces/website-state.interface';
import fetchData from '../../helpers/fetch-data.helper';
import StatesDataService from '../../services/states.service';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch } from '../../store';
import { updateWebsiteControlStep } from '../../slices/websites_control_steps.slice';
import { log } from 'util';

type Props = {
  step: IWebsiteControlStep;
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ApiStepComponent: React.FC<Props> = ({ step }) => {
  const [latestState, setLatestState] = useState<IState>();
  const [expanded, setExpanded] = React.useState(false);
  const timeAgo = new TimeAgo('en-US');

  const { id, website_id, path, description, api_call_data } = step;

  const dispatch = useAppDispatch();

  const getLatestState = (id: string) => {
    fetchData(StatesDataService.getLatestStateByStepId(id), setLatestState);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    step && getLatestState(step.id);
  }, []);

  return (
    <Card sx={{ width: '50%', height: 'fit-content' }}>
      <CardHeader
        sx={{ '& .MuiCardHeader-subheader': { fontSize: '0.875rem', pr: 1 } }}
        subheader={step.description}
        action={
          <>
            <Tooltip title="Check" arrow>
              <IconButton
                aria-label="check"
                onClick={e => {
                  e.stopPropagation();
                  // checkStatus(website.id);
                }}
              >
                <SensorsOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <IconButton aria-label="edit" onClick={() => false}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                aria-label="edit"
                color="error"
                onClick={() => {
                  window.confirm('Are you sure you wish to delete this item?') ? 'handleRemove(website.id)' : '';
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box>
            <Typography variant="body2">Path:</Typography>
            <Link href={step.path} underline="none" variant="body2" sx={{ wordBreak: 'break-word' }}>
              {step.path}
            </Link>
          </Box>
          {step.type !== 'MAIN' && (
            <Box mt={2}>
              <Typography variant="body2">Api data:</Typography>
              <ReactJson
                src={JSON.parse(step.api_call_data)}
                collapsed={true}
                iconStyle="circle"
                onEdit={({ updated_src }) =>
                  dispatch(updateWebsiteControlStep({ id, website_id, path, description, api_call_data: JSON.stringify(updated_src) }))
                }
                onAdd={({ updated_src }) =>
                  dispatch(updateWebsiteControlStep({ id, website_id, path, description, api_call_data: JSON.stringify(updated_src) }))
                }
                onDelete={({ updated_src }) =>
                  dispatch(updateWebsiteControlStep({ id, website_id, path, description, api_call_data: JSON.stringify(updated_src) }))
                }
              />
            </Box>
          )}
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
  );
};

export default ApiStepComponent;

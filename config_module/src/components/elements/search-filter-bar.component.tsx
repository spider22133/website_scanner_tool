import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { queryWebsites } from '../../slices/websites.slice';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import React, { useState } from 'react';
import { useAppDispatch } from '../../store';

type Props = {};

const SearchFilterBar: React.FC<Props> = ({}) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState({
    toggleVisible: false,
  });

  const handleClickToggle = () => {
    setValue({ toggleVisible: !value.toggleVisible });
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <TextField
        variant="outlined"
        label="Search"
        onChange={e => dispatch(queryWebsites(e.target.value))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
        fullWidth
      />
      <Typography variant="body2" sx={{ width: 135 }}>
        Show hidden:
      </Typography>
      <Box sx={{ ml: '0 !important' }}>
        <IconButton aria-label="toggle visibility" onClick={handleClickToggle} edge="end" sx={{ mr: 1 }}>
          {value.toggleVisible ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>
    </Stack>
  );
};

export default SearchFilterBar;

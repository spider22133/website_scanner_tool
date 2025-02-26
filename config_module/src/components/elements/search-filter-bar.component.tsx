import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography, Autocomplete, Button } from '@mui/material';
import { queryWebsites, createWebsite } from '../../slices/websites.slice';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import React, { useState } from 'react';
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

type Props = {
  value: boolean;
  handleClickToggle?: () => void;
};

type SoftwareEntry = {
  name: string;
  id: string;
  version: string;
  source: string;
};

const SearchFilterBar: React.FC<Props> = ({ handleClickToggle, value }) => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const softwareList: SoftwareEntry[] = useSelector((state: RootState) => state.websites); // Adjust state path
  const [inputValue, setInputValue] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareEntry | null>(null);

  const handleAddToList = () => {
    if (selectedSoftware) {
      // dispatch(createWebsite(selectedSoftware));
      setSelectedSoftware(null); // Reset selection after adding
      setInputValue(''); // Clear input
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Autocomplete
        options={softwareList || []}
        getOptionLabel={option => `${option.name} (${option.version})`}
        onChange={(_, newValue) => setSelectedSoftware(newValue)}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        renderInput={params => (
          <TextField
            variant="outlined"
            label="Search"
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
        )}
        fullWidth
      />
      <Box alignItems="center" justifyContent="center" sx={{ display: 'flex', height: '100%' }}>
        <IconButton disabled={!selectedSoftware} onClick={handleAddToList} color="primary" size="large" title="Add to List">
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ ml: '0 !important' }}>
        <Tooltip title={value ? 'Hide' : 'Show'} arrow>
          <IconButton aria-label="toggle visibility" onClick={handleClickToggle} edge="end" sx={{ mr: 1 }}>
            {value ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
};

export default SearchFilterBar;

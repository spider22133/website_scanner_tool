import { useForm, SubmitHandler } from 'react-hook-form';
import IWebsite from '../../interfaces/website.interface';
import { sleep } from '../../helpers/animation.helper';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RootState, useAppDispatch } from '../../store';
import { createWebsite } from '../../slices/websites.slice';
import { useSelector } from 'react-redux';
import { clearMessage } from '../../slices/message.slice';
import { APIErrorNotification } from '../elements/error-notification.component';
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Paper, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react';

type Props = {
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddForm: boolean;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(4),
  url: Yup.string().required('Username is required').url('Url is invalid'),
});

export default function AddWebsite({ setShowAddForm, showAddForm }: Props) {
  const { loading } = useSelector((state: RootState) => state.websites);
  const messages = useSelector((state: RootState) => state.messages);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IWebsite> = async data => {
    dispatch(createWebsite({ data, id: 'add' })).then(async response => {
      if (createWebsite.fulfilled.match(response)) {
        dispatch(clearMessage('add'));
        await sleep(1000);
        setShowAddForm(false);
        reset();
      }
    });
  };
  return (
    <>
      {showAddForm ? (
        <Paper sx={{ p: 3, mb: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} direction="column">
              <FormControl size="small" error={!!errors.name}>
                <InputLabel htmlFor="name">Website name</InputLabel>
                <OutlinedInput id="name" size="small" label="Website name" {...register('name')} />
                <FormHelperText id="name-error-text">{errors.name?.message}</FormHelperText>
              </FormControl>
              <FormControl size="small" error={!!errors.url}>
                <InputLabel htmlFor="url">Url address</InputLabel>
                <OutlinedInput id="url" size="small" label="Url address" placeholder="http://example.com" {...register('url')} />
                <FormHelperText id="url-error-text">{errors.url?.message}</FormHelperText>
              </FormControl>
            </Stack>
            <Stack spacing={2} mt={2} direction="row">
              <LoadingButton variant="contained" type="submit" color="primary" endIcon={<SendIcon />} loading={loading} loadingPosition="end">
                {loading ? 'Loading...' : 'Submit'}
              </LoadingButton>
              <Button variant="outlined" type="submit" color="primary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </Stack>
            <APIErrorNotification messages={messages} websiteId="add" />
          </form>
        </Paper>
      ) : (
        ''
      )}
    </>
  );
}

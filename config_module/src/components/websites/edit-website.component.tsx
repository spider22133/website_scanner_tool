import React, { useEffect } from 'react';
import IWebsite from '../../interfaces/website.interface';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { clearMessage } from '../../slices/message.slice';
import { updateWebsite } from '../../slices/websites.slice';
import { sleep } from '../../helpers/animation.helper';
import { APIErrorNotification } from '../elements/error-notification.component';
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(4),
  url: Yup.string().required('Username is required').url('Url is invalid'),
});

type Props = {
  website: IWebsite;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddForm: boolean;
};

export default function EditWebsite({ website, setShowAddForm, showAddForm }: Props) {
  const { loading } = useSelector((state: RootState) => state.websites);
  const messages = useSelector((state: RootState) => state.messages);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(website);
  }, [website]);

  const onSubmit: SubmitHandler<IWebsite> = data => {
    const { name, url } = data;
    dispatch(updateWebsite({ id: website.id, name: name || website.name, url: url || website.url })).then(async response => {
      if (updateWebsite.fulfilled.match(response)) {
        dispatch(clearMessage(website.id));
        await sleep(1000);
        setShowAddForm(false);
        reset();
      }
    });
  };
  return (
    <>
      {showAddForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="my-4">
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
            <Button variant="outlined" type="submit" color="primary" onClick={() => reset()}>
              Reset
            </Button>
          </Stack>
          <APIErrorNotification messages={messages} websiteId={website.id} />
        </form>
      ) : (
        ' '
      )}
    </>
  );
}

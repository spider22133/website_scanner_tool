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
import { Button, Paper, Stack } from '@mui/material';
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
            <div className="form-group mb-3">
              <label className="form-label">Website name</label>
              <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" id="name" {...register('name')} />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Url address</label>
              <input
                className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                type="text"
                id="url"
                placeholder="http://example.com"
                {...register('url')}
              />
              <div className="invalid-feedback">{errors.url?.message}</div>
            </div>
            <Stack spacing={2} direction="row">
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

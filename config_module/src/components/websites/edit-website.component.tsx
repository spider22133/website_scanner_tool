import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IWebsite from '../../interfaces/website.interface';
import WebsiteDataService from '../../services/website.service';
import { AxiosError } from 'axios';
import { useAPIError } from '../../contexts/api-error.context';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { clearMessage } from '../../slices/message.slice';
import { updateWebsite } from '../../slices/websites.slice';
import { type } from 'os';
import { sleep } from '../../helpers/animation.helper';
import { APIErrorNotification } from '../elements/error-notification.component';

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
          <div className="form-group mb-3">
            <label className="form-label">Website name</label>
            <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" id="name" placeholder="Name" {...register('name')} />
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
          <div className="d-flex justify-content-start">
            <button className="btn btn-warning me-1" type="submit">
              {loading ? 'Loading...' : 'Submit'}
            </button>
            <button type="button" onClick={() => reset()} className="btn btn-secondary">
              Reset
            </button>
          </div>
          <APIErrorNotification messages={messages} websiteId={website.id} />
        </form>
      ) : (
        ' '
      )}
    </>
  );
}

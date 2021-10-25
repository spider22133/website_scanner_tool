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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(4),
  url: Yup.string().required('Username is required').url('Url is invalid'),
});

export default function EditWebsite() {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<IWebsite>();
  const [message, setMessage] = useState('');

  const { addError } = useAPIError();
  const dispatch = useAppDispatch();
  const Name = website ? website.name : '';
  const Url = website ? website.url : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    getWebsiteById(id);
  }, []);

  useEffect(() => {
    reset(website);
  }, [website]);

  const getWebsiteById = (id: string) => {
    WebsiteDataService.getWebsiteById(id)
      .then(response => {
        setWebsite(response.data.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  const onSubmit: SubmitHandler<IWebsite> = data => {
    const { name, url } = data;
    console.log(data);
    dispatch(updateWebsite({ id, name: name || Name, url: url || Url })).then(async response => {
      if (updateWebsite.fulfilled.match(response)) {
        setMessage('Website successfully updated!');
      }
    });
  };

  return (
    <div className="container">
      <div className="my-4">
        <h1>Edit {website ? website.name : ''}</h1>
        <div className="col-6">
          <form onSubmit={handleSubmit(onSubmit)}>
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
                Submit
              </button>
              <button type="button" onClick={() => reset()} className="btn btn-secondary">
                Reset
              </button>
              <div className="m-0 p-2 text-success">{message && <>{message}</>}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

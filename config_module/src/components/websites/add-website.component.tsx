import { useState } from 'react';
import { AxiosError } from 'axios';
import { useAPIError } from '../../contexts/api-error.context';
import { useForm, SubmitHandler } from 'react-hook-form';

import IWebsite from '../../interfaces/website.interface';
import { sleep } from '../../helpers/animation.helper';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { RootState, useAppDispatch } from '../../store';
import { createWebsite } from '../../slices/websites.slice';
import { useSelector } from 'react-redux';

type Props = {
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(4),
  url: Yup.string().required('Username is required').url('Url is invalid'),
});

export default function AddWebsite({ setShowAddForm }: Props) {
  const { loading } = useSelector((state: RootState) => state.websites);
  const [message, setMessage] = useState('');
  const { addError } = useAPIError();
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
    dispatch(createWebsite(data))
      .then(async response => {
        if (createWebsite.fulfilled.match(response)) {
          const website = response.payload;
          setMessage(`${website.name} successfully added!`);

          await sleep(1500);
          setMessage('');
          await sleep(500);

          setShowAddForm(false);
          reset();
        }
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  return (
    <div className=" p-4">
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
        <div className="d-flex justify-content-start">
          <button className="btn btn-warning" type="submit">
            {loading ? 'Loading...' : 'Submit'}
          </button>
          <button className="btn btn-outline-warning ms-2" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
          <div className="m-0 p-2 text-success">{message && <>{message}</>}</div>
        </div>
      </form>
    </div>
  );
}

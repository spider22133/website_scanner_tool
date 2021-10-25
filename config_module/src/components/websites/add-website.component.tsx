import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import IWebsite from '../../interfaces/website.interface';
import { sleep } from '../../helpers/animation.helper';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { RootState, useAppDispatch } from '../../store';
import { createWebsite } from '../../slices/websites.slice';
import { useSelector } from 'react-redux';
import { clearMessage } from '../../slices/message.slice';

type Props = {
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(4),
  url: Yup.string().required('Username is required').url('Url is invalid'),
});

export default function AddWebsite({ setShowAddForm }: Props) {
  const { loading } = useSelector((state: RootState) => state.websites);
  const { message } = useSelector((state: RootState) => state.message);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const onSubmit: SubmitHandler<IWebsite> = async data => {
    dispatch(createWebsite(data)).then(async response => {
      if (createWebsite.fulfilled.match(response)) {
        await sleep(1000);

        setShowAddForm(false);
        reset();
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
        </div>
        {message && (
          <div className="form-group mt-3">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

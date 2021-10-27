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
        <form onSubmit={handleSubmit(onSubmit)} className="my-4">
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
          <APIErrorNotification messages={messages} websiteId="add" />
        </form>
      ) : (
        ''
      )}
    </>
  );
}

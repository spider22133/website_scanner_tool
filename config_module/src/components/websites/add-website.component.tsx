import { useState } from 'react';
import WebsiteDataService from '../../services/website.service';
import { AxiosError } from 'axios';
import { useAPIError } from '../../contexts/api-error.context';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import IWebsite from '../../interfaces/website.interface';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(4),
  url: Yup.string().required('Username is required').url('Url is invalid'),
});

export default function AddWebsite() {
  const [message, setMessage] = useState('');
  const { addError } = useAPIError();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IWebsite> = data => {
    const { name, url } = data;
    WebsiteDataService.create({ name, url })
      .then(response => {
        setMessage(`${response.data.data.name} successfully added!`);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          addError(error.response.data.message, error.response.status);
        }
      });
  };

  return (
    <div className="container">
      <div className="my-4">
        <h1>Add website</h1>
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
              <button className="btn btn-warning" type="submit">
                Submit
              </button>
              <div className="m-0 p-2 text-success">{message && <>{message}</>}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

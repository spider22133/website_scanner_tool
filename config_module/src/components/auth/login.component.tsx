import React, { useState } from 'react';
import AuthService from '../../services/auth.service';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import { setUserSession } from '../../helpers/session.helper';
import { useAuth } from '../../contexts/auth.context';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import IUser from '../../interfaces/user.interface';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
});

export default function LogIn() {
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IUser> = data => {
    const { email, password } = data;
    setLoading(true);

    AuthService.login({ email, password })
      .then(response => {
        setLoading(false);
        setCurrentUser(response.data.user);
        setUserSession(response.data.token, response.data.user);

        history.push('/websites');
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data.message, error.response.status);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="vh-100-c" style={{ backgroundColor: '#508bfc' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-4">
            <div className="bg-light p-5 border shadow" style={{ borderRadius: '1rem' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-4">
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter Email"
                    {...register('email')}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                <div className="form-group mb-4">
                  <input
                    type="password"
                    placeholder="Enter Password"
                    {...register('password')}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                {/*<div className="mb-4 form-check w-100">
                   <a href="#" className="float-end">
                    Reset Password
                  </a>
                </div> */}
                <button type="submit" className="btn btn-primary w-100 my-3 shadow" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </button>
                <p className="text-center m-0">
                  No account yet, <a href="/signup">Please Signup</a>
                </p>
              </form>

              <br />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

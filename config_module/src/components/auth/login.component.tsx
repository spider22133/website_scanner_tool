import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import IUser from '../../interfaces/user.interface';
import { RootState, useAppDispatch } from '../../store';
import { login } from '../../slices/auth.slice';
import { useSelector } from 'react-redux';
import { APIErrorNotification } from '../elements/error-notification.component';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
});

export default function LogIn() {
  const { loading } = useSelector((state: RootState) => state.auth);
  const messages = useSelector((state: RootState) => state.messages);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IUser> = data => {
    dispatch(login({ data, id: 'login' })).then(response => login.fulfilled.match(response) && history.push('/websites'));
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
              <APIErrorNotification messages={messages} websiteId="login" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

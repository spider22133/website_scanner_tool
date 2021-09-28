import { useInput } from '../../helpers/form-input.helper';
import React, { useState } from 'react';
import AuthService from '../../services/auth.service';
import { useHistory } from 'react-router-dom';
import { setUserSession } from '../../helpers/session.helper';
import { useAuth } from '../../contexts/auth.context';
import { AxiosError } from 'axios';

export default function SignUp() {
  const [firstName, setFirstname] = useInput('');
  const [lastName, setLastname] = useInput('');
  const [email, setEmail] = useInput('');
  const [password, setPassword] = useInput('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const history = useHistory();

  const handleSignUp = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    AuthService.signup({ firstName, lastName, email, password })
      .then(() => {
        setLoading(false);
        history.push('/login');
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        setError(error.response?.data.message);
      });
  };

  return (
    <section className="vh-100" style={{ backgroundColor: '#508bfc' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-4">
            <div className="bg-light p-5 border shadow" style={{ borderRadius: '1rem' }}>
              <form>
                <div className="mb-4">
                  <input type="text" className="form-control" placeholder="Enter Firstname" value={firstName} onChange={setFirstname} />
                </div>
                <div className="mb-4">
                  <input type="text" className="form-control" placeholder="Enter Lastname" value={lastName} onChange={setLastname} />
                </div>
                <div className="mb-4">
                  <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={setEmail} />
                </div>
                <div className="mb-4">
                  <input type="password" className="form-control" placeholder="Enter Password" value={password} onChange={setPassword} />
                </div>

                <button type="submit" className="btn btn-primary w-100 my-3 shadow" onClick={handleSignUp} disabled={loading}>
                  {loading ? 'Loading...' : 'Signup'}
                </button>

                {error && (
                  <p className="text-center m-0 pt-3">
                    <small style={{ color: 'red' }}>{error}</small>
                    <br />
                  </p>
                )}
              </form>
              <br />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

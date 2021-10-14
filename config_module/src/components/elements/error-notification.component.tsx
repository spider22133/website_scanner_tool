import { useAPIError } from '../../contexts/api-error.context';

export const APIErrorNotification = () => {
  const { error, removeError } = useAPIError();
  return (
    <div
      className={`toast position-absolute align-items-center fade ${error ? 'show' : 'hide'} bottom-0 end-0 m-3`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          {error && (
            <>
              <small style={{ color: 'red' }}>
                Status code: {error.status}
                <br />
                Error: {error.message}
              </small>
              <br />
            </>
          )}
        </div>
        <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={removeError}></button>
      </div>
    </div>
  );
};

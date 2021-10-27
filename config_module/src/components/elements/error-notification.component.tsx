import { iniState } from '../../slices/message.slice';

type Props = {
  websiteId: string;
  messages: iniState[];
};
export const APIErrorNotification = ({ messages, websiteId }: Props) => {
  return (
    <>
      {messages.length !== 0 ? (
        <div className="form-group mt-3">
          {messages.map(({ message, id }, index) => {
            return id === websiteId ? (
              <div key={index} className="alert alert-danger" role="alert">
                <div>{message}</div>
              </div>
            ) : (
              ''
            );
          })}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

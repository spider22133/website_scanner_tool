import { addZero } from '../../helpers/chart.helper';
import IState from '../../interfaces/website-state.interface';

type Props = {
  errors: IState[];
};

export default function ErrorTable({ errors }: Props) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Code</th>
            <th>Error message</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {errors &&
            errors.map((error: IState, index) => {
              const date = new Date(error.createdAt);
              const time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
              return (
                <tr key={index}>
                  <td>{error.id}</td>
                  <td>{error.response_code}</td>
                  <td>{error.response_text}</td>
                  <td>{time}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

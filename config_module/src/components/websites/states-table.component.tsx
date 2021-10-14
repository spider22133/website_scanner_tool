import IState from '../../interfaces/website-state.interface';

type Props = {
  states: IState[];
};

export default function StatesTable({ states }: Props) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Answer code</th>
            <th>Answer time</th>
          </tr>
        </thead>
        <tbody>
          {states &&
            states.map((state: IState, index) => (
              <tr key={index}>
                <td>{state.id}</td>
                <td>{state.answer_code}</td>
                <td>{state.answer_time} ms</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

import { useState } from 'react';

type Props = {
  totalItems: number;
  pageChange: (page: number, itemsPerPage: number) => void;
};

export default function PaginationContainer(props: Props) {
  const [page, setPage] = useState(1);

  const { totalItems, pageChange } = props;

  const itemsPerPage = 15;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" href="#">
            Previous
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            {totalItems}
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

import { useEffect } from 'react';

type Props = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  pageChange: (page: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function PaginationContainer(props: Props) {
  const { totalItems, pageChange, itemsPerPage, currentPage, setCurrentPage } = props;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    pageChange(currentPage);
  }, [currentPage]);

  const onFirstPage = (): void => {
    setCurrentPage(1);
  };

  const onLastPage = (): void => {
    setCurrentPage(totalPages);
  };

  const onNextPage = (): void => {
    setCurrentPage(currentPage + 1);
  };

  const onPreviousPage = (): void => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
          <a className="page-link" onClick={() => onFirstPage()} href="#">
            First
          </a>
        </li>
        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
          <a className="page-link" onClick={() => onPreviousPage()} href="#">
            Previous
          </a>
        </li>
        <li className="page-item disabled">
          <a className="page-link">
            {currentPage} from {totalPages}
          </a>
        </li>
        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
          <a className="page-link" onClick={() => onNextPage()} href="#">
            Next
          </a>
        </li>
        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
          <a className="page-link" onClick={() => onLastPage()} href="#">
            Last
          </a>
        </li>
      </ul>
    </nav>
  );
}

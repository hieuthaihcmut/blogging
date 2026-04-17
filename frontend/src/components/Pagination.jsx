import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const pushPage = (page) => {
    if (!pages.includes(page)) {
      pages.push(page);
    }
  };

  if (totalPages <= 4) {
    for (let page = 1; page <= totalPages; page += 1) {
      pushPage(page);
    }
  } else if (currentPage <= 2) {
    pushPage(1);
    pushPage(2);
    pushPage("ellipsis-start");
    pushPage(totalPages);
  } else if (currentPage >= totalPages - 1) {
    pushPage(1);
    pushPage("ellipsis-start");
    pushPage(totalPages - 1);
    pushPage(totalPages);
  } else {
    pushPage(1);
    pushPage("ellipsis-start");
    pushPage(currentPage - 1);
    pushPage(currentPage);
    pushPage(currentPage + 1);
    pushPage("ellipsis-end");
    pushPage(totalPages);
  }

  return (
    <nav className="pagination-wrap" aria-label="Pagination">
      <div className="pagination-bar">
        <button
          type="button"
          className="pagination-button pagination-nav"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          &laquo;
        </button>

        {pages.map((page) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={page}
                className="pagination-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              type="button"
              className={`pagination-button ${page === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="pagination-button pagination-nav"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          &raquo;
        </button>
      </div>
    </nav>
  );
}

export default Pagination;

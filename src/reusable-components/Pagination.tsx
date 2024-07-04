import React from 'react';
import { Button, Group } from '@mantine/core';

interface PaginationProps {
  active: number;
  totalPages: number;
  setPage: (page: number) => void;
  next: () => void;
  previous: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ active, totalPages, setPage, next, previous }) => {
  const renderPaginationButtons = () => {
    const buttons = [];

    // Show "First" button
    if (totalPages > 1) {
      buttons.push(
        <Button onClick={() => setPage(1)} disabled={active === 1} key="first">
          First
        </Button>
      );
    }

    // Show "Previous" button
    buttons.push(
      <Button onClick={previous} disabled={active === 1} key="previous">
        <span>{`<<`}</span>
      </Button>
    );

    // Show page numbers with ellipsis
    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        buttons.push(
          <Button
            key={page}
            onClick={() => setPage(page)}
            variant={page === active ? "filled" : "outline"}
          >
            {page}
          </Button>
        );
      }
    } else {
      buttons.push(
        <Button
          key={1}
          onClick={() => setPage(1)}
          variant={1 === active ? "filled" : "outline"}
        >
          1
        </Button>
      );

      if (active > 3) {
        buttons.push(
          <span className="text-blue-600 " key="left-ellipsis">
            . . .{" "}
          </span>
        );
      }

      const startPage = Math.max(2, active - 1);
      const endPage = Math.min(totalPages - 1, active + 1);

      for (let page = startPage; page <= endPage; page++) {
        buttons.push(
          <Button
            key={page}
            onClick={() => setPage(page)}
            variant={page === active ? "filled" : "outline"}
          >
            {page}
          </Button>
        );
      }

      if (active < totalPages - 2) {
        buttons.push(
          <span className="text-blue-600 " key="right-ellipsis">
            . . .
          </span>
        );
      }

      buttons.push(
        <Button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          variant={totalPages === active ? "filled" : "outline"}
        >
          {totalPages}
        </Button>
      );
    }

    // Show "Next" button
    buttons.push(
      <Button onClick={next} disabled={active === totalPages} key="next">
        <span>{`>>`}</span>
      </Button>
    );

    // Show "Last" button
    if (totalPages > 1) {
      buttons.push(
        <Button
          onClick={() => setPage(totalPages)}
          disabled={active === totalPages}
          key="last"
        >
          Last
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Group position="center" mt="md">
      {renderPaginationButtons()}
    </Group>
  );
};

export default Pagination;

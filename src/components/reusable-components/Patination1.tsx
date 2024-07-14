import React from 'react';
import { Button, Group } from '@mantine/core';

interface PaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
}

const Pagination1: React.FC<PaginationProps> = ({ total, page, onChange }) => {
  const renderPaginationButtons = () => {
    const buttons = [];

    // Show "First" button
    if (total > 1) {
      buttons.push(
        <Button onClick={() => onChange(1)} disabled={page === 1} key="first">
          First
        </Button>
      );
    }

    // Show "Previous" button
    buttons.push(
      <Button onClick={() => onChange(page - 1)} disabled={page === 1} key="previous">
        <span>{`<<`}</span>
      </Button>
    );

    // Show page numbers with ellipsis
    if (total <= 5) {
      for (let p = 1; p <= total; p++) {
        buttons.push(
          <Button
            key={p}
            onClick={() => onChange(p)}
            variant={p === page ? "filled" : "outline"}
          >
            {p}
          </Button>
        );
      }
    } else {
      buttons.push(
        <Button
          key={1}
          onClick={() => onChange(1)}
          variant={1 === page ? "filled" : "outline"}
        >
          1
        </Button>
      );

      if (page > 3) {
        buttons.push(
          <span className="text-blue-600 " key="left-ellipsis">
            . . .{" "}
          </span>
        );
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(total - 1, page + 1);

      for (let p = startPage; p <= endPage; p++) {
        buttons.push(
          <Button
            key={p}
            onClick={() => onChange(p)}
            variant={p === page ? "filled" : "outline"}
          >
            {p}
          </Button>
        );
      }

      if (page < total - 2) {
        buttons.push(
          <span className="text-blue-600 " key="right-ellipsis">
            . . .
          </span>
        );
      }

      buttons.push(
        <Button
          key={total}
          onClick={() => onChange(total)}
          variant={total === page ? "filled" : "outline"}
        >
          {total}
        </Button>
      );
    }

    // Show "Next" button
    buttons.push(
      <Button onClick={() => onChange(page + 1)} disabled={page === total} key="next">
        <span>{`>>`}</span>
      </Button>
    );

    // Show "Last" button
    if (total > 1) {
      buttons.push(
        <Button onClick={() => onChange(total)} disabled={page === total} key="last">
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

export default Pagination1;

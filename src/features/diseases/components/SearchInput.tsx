import React from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, value, onChange }) => {
  return (
    <TextInput
      className="w-80"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      mb="md"
      icon={<IconSearch size={16} />}
      autoFocus
    />
  );
};

export default SearchInput;

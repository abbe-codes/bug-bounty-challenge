import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang.split('-')[0]);
  };

  const currentLang = i18n.language.split('-')[0];

  return (
    <FormControl size='small' fullWidth>
      <Select
        value={currentLang}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Select language' }}
        sx={{
          color: 'inherit',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.8)',
          },
          '& .MuiSelect-icon': {
            color: 'inherit',
          },
        }}
      >
        <MenuItem value='en'>English</MenuItem>
        <MenuItem value='de'>Deutsch</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;

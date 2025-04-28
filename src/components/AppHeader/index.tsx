import { Grow, Box, Theme, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../api/services/User/store';
import AvatarMenu from '../AvatarMenu';
import LanguageSelector from '../LanguageSelector';

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height,
}));

const AppHeader = React.forwardRef((props: AppHeaderProps, ref) => {
  const { user, pageTitle } = props;
  const { t } = useTranslation('app');
  const theme = useTheme();

  // more efficient way of this countdown that directly uses Date.now()
  // Instead of counting seconds manually, store the start time
  // and always calculate the remaining time based on the real clock (Date.now())
  const [now, setNow] = useState(Date.now());
  const targetDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
  const startTime = React.useRef(Date.now()); // we use ref to persist across renders
  const remaining = Math.max(0, targetDuration - (now - startTime.current));
  const countdownMinutes = `${Math.floor(remaining / 60000)}`.padStart(2, '0');
  const countdownSeconds = `${Math.floor((remaining % 60000) / 1000)}`.padStart(
    2,
    '0'
  );

  // The countdown glitch comes from useEffect. We call setInterval, but never clear it
  // Every time React hot reloads, or the component re-mounts,
  // another setInterval starts, and the previous one is not cleaned up
  // Solution: clean it up when the component unmounts
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar ref={ref} position='fixed' sx={{ width: '100vw' }}>
      <Toolbar sx={{ background: '#08140C 0% 0% no-repeat padding-box' }}>
        <Box sx={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
          <Box>
            <Typography variant='h6' component='div' color='primary'>
              {countdownMinutes}:{countdownSeconds}
            </Typography>
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5),
              }}
              variant='h6'
              component='div'
            >
              {t('appTitle').toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ ...typoStyle }}
              variant='overline'
              component='div'
              noWrap
            >
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 120, marginRight: 2 }}>
            <LanguageSelector />
          </Box>
          <Box sx={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
            {user && user.eMail && (
              // Here we conditionally rendering components based on user
              // but Grow still tries to animate even when user wasn't ready yet !!!
              // even though we check user && user.eMail, <Grow> still tries to render the child during mount
              // <Grow> needs a DOM node inside immediately,
              // solution: we wrap AvatarMenu inside a plain <div>
              // Why? <Grow> expects the first child to be a real DOM element (<div>), not a React component
              // Now <Grow> always animates a simple <div>, which exists immediately
              <Grow in={Boolean(user && user.eMail)}>
                <div>
                  <AvatarMenu user={user} />
                </div>
              </Grow>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;

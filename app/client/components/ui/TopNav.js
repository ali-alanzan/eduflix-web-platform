import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

export default function TopNav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Typography sx={{ minWidth: 100 }}>
            <Link href="/">
                <Typography component="h3">
                    App
                </Typography>
            </Link>
        </Typography>
        <Typography sx={{ minWidth: 100 }}>
            <Link href="/">
                Profile
            </Link>
        </Typography>
      </Box>
    </React.Fragment>
  );
}

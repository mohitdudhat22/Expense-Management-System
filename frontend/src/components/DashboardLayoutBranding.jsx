import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Dashboard from './Dashboard';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import { ExpenseProvider } from '../contexts/ExpenseContext';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'expenses',
    title: 'Expenses',
    icon: <ReceiptIcon />,
  },
  {
    segment: 'charts',
    title: 'Analytics',
    icon: <AssessmentIcon />,
  },
  {
    segment: 'add',
    title: 'Add Expense',
    icon: <AddCircleIcon />,
  },
];

const expenseTrackerTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ExpenseTrackerContent({ pathname }) {
  switch (pathname) {
    case '/dashboard':
      return <Dashboard />;
    case '/expenses':
      return <ExpenseList />;
    case '/charts':
      return <ExpenseChart />;
    case '/add':
      return <ExpenseForm />;
    default:
      return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Page not found</Typography>
        </Box>
      );
  }
}

ExpenseTrackerContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function ExpenseTrackerLayout(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <ExpenseProvider>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <img src="/vite.svg" alt="Expense Tracker Logo" />,
          title: 'Expense Tracker',
        }}
        router={router}
        theme={expenseTrackerTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <ExpenseTrackerContent pathname={pathname} />
        </DashboardLayout>
      </AppProvider>
    </ExpenseProvider>
  );
}

ExpenseTrackerLayout.propTypes = {
  window: PropTypes.func,
};

export default ExpenseTrackerLayout;
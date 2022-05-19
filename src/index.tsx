import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter} from "react-router-dom";
import {QueryClientProvider, QueryClient} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {MantineProvider} from '@mantine/core';
import {ModalsProvider} from "@mantine/modals";
import {NotificationsProvider} from '@mantine/notifications'
import './styles/index.css';
import App from './App';
import { store } from './features/store';

const queryClient = new QueryClient({
    defaultOptions:{
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            cacheTime: Infinity
        }
    }
})

ReactDOM.render(
  <React.StrictMode>
      <MantineProvider>
          <ModalsProvider>
              <NotificationsProvider position='top-right' autoClose={2000} limit={1} zIndex={2088}>
                  <Provider store={store}>
                      <BrowserRouter>
                          <QueryClientProvider client={queryClient}>
                              <App />
                              <ReactQueryDevtools initialIsOpen={true}/>
                          </QueryClientProvider>
                      </BrowserRouter>
                  </Provider>
              </NotificationsProvider>
          </ModalsProvider>
      </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

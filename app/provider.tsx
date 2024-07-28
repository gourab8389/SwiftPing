'use client';

import Loader from '@/components/shared/Loader';
import {ClientSideSuspense, LiveblocksProvider} from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

const provider = ({children}: {children: ReactNode}) => {
  return (
    <LiveblocksProvider authEndpoint='/api/liveblocks-auth'>
        <ClientSideSuspense fallback={<Loader/>}>
          {children}
        </ClientSideSuspense>
      
    </LiveblocksProvider>
  )
}

export default provider

'use client';

import { Portal, Spinner, Stack, Toast, Toaster as ChakraToaster, createToaster } from '@chakra-ui/react';
import { X } from 'lucide-react';

export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id}>
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="colorPalette.solid" />
            ) : (
              <Toast.CloseTrigger>
                <X size={16} />
              </Toast.CloseTrigger>
            )}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};

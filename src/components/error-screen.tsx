import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
const ErrorScreen = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <Alert variant='destructive' className='max-w-md'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          We encountered an issue while loading your profile. Please try again
          later.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorScreen;

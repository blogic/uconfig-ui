import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useWebSocketStore } from 'api/useWebSocketStore';
import { Button } from 'components/Button';
import { LanguageSelector } from 'components/LanguageSelector';
import { ThemeSelector } from 'components/ThemeSelector';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type FormState = z.infer<typeof formSchema>;

const Component = () => {
  const { t: tLogin } = useTranslation('login');
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const { login, status } = useWebSocketStore((state) => ({
    login: state.login,
    status: state.status,
  }));
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'all',
  });
  const [isError, setIsError] = React.useState(false);

  const onSubmit = async (data: FormState) => {
    // Wait 1 second to simulate a network request
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const { result } = await login({ username: data.username, password: data.password });

    if (result === 'success') {
      setIsError(false);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
          router.invalidate();
        }, 500);
      });
    } else {
      setIsError(true);
    }
  };

  const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);

  React.useEffect(() => {
    // if (status === 'authorized') {
    //   router.invalidate();
    //   if (search.redirect) {
    //     router.history.push(search.redirect);
    //   } else {
    //     router.navigate({ to: '/protected/' });
    //   }
    // }
  }, [status]);

  React.useEffect(() => {
    login();
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12  lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            {tLogin('title')}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                {tCommon('username')}
              </label>
              <div className="mt-2">
                <input
                  {...register('username')}
                  id="username"
                  name="username"
                  type="username"
                  placeholder="Your Username"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                {tCommon('password')}
              </label>
              <div className="relative mt-2">
                <input
                  {...register('password')}
                  id="password"
                  name="password"
                  type={isPasswordHidden ? 'password' : 'text'}
                  placeholder="********"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-full items-center pr-3"
                  onClick={() => setIsPasswordHidden((prev) => !prev)}
                >
                  {isPasswordHidden ? <Eye size={24} /> : <EyeSlash size={24} />}
                </button>
              </div>
            </div>
            {isError ? (
              <div className="rounded-lg border border-danger-400 bg-danger-200 px-4 py-1 dark:bg-danger-400 dark:text-white">
                {tLogin('invalidCredentials')}
              </div>
            ) : null}
            <div>
              <Button buttonType="submit" isLoading={isSubmitting} disabled={!isValid}>
                {tLogin('signIn')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute right-4 top-4 z-50 flex">
        <LanguageSelector />
        <ThemeSelector />
      </div>
    </>
  );
};

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().catch('/'),
  }),
  component: Component,
});

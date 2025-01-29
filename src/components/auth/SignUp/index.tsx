import { FC } from 'react'
import { SignUpForm } from './SignUpForm'
import { useNavigate } from 'react-router-dom'

export const SignUpContent: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center">
      <h1 className="tw-mt-6 tw-text-xl tw-font-semibold tw-text-neutrals-700">Bem vindo! 👋🏻</h1>
      <p className="tw-mt-2 tw-text-xs tw-font-light tw-text-neutrals-600 tw-mb-8">
        Bem vindo ao Anamnotes - Vamos criar a sua conta.
      </p>
      <SignUpForm />
      <p className="tw-text-xs tw-font-light tw-text-neutrals-600 tw-mt-8 tw-text-center">
        Já tem uma conta?{' '}
        <a
          className="tw-text-brand-700 tw-font-normal hover:tw-underline hover:tw-cursor-pointer"
          onClick={() => navigate('../sign-in')}
        >
          Faça login
        </a>
        .
      </p>
    </div>
  )
}

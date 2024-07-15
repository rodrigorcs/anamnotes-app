import { FC } from 'react'
import { SignUpForm } from './SignUpForm'
import { useNavigate } from 'react-router-dom'

export const SignUpContent: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-mb-14">
      <p className="tw-text-sm tw-text-neutrals-700">
        Já tem uma conta?{' '}
        <a
          className="tw-text-brand-500 hover:tw-underline hover:tw-cursor-pointer"
          onClick={() => navigate('../sign-in')}
        >
          Faça login aqui
        </a>
        .
      </p>
      <h1 className="tw-mt-14 tw-text-xl tw-font-semibold tw-text-neutrals-700">
        Bem vindo ao Anamnotes! 👋🏻
      </h1>
      <p className="tw-mt-2 tw-text-sm tw-text-neutrals-600">
        Resuma as sessões de anamnese automaticamente, de forma rápida e eficiente.
      </p>
      <SignUpForm />
    </div>
  )
}

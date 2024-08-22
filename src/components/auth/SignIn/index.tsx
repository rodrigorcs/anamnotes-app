import { FC, useState } from 'react'
import { SignInForm } from './SignInForm'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth'
import { getFirstNameFromFullName } from '../../../utils/names'

export const SignInContent: FC = () => {
  const navigate = useNavigate()

  const loginData = useAuthStore((state) => state.loginData)
  const firstName = getFirstNameFromFullName(loginData?.fullName)

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center">
      <h1 className="tw-mt-14 tw-text-xl tw-font-semibold tw-text-neutrals-700">{`Bom te ver${
        firstName ? `, ${firstName}` : ''
      }! 👋🏻`}</h1>
      <p className="tw-mt-2 tw-text-xs tw-font-light tw-text-neutrals-600 tw-mb-8">
        Bem vindo ao Anamnotes! Resuma as sessões de anamnese automaticamente.
      </p>
      <SignInForm />
      <p className="tw-text-xs tw-font-light tw-text-neutrals-600 tw-mt-4 tw-text-center">
        Não tem uma conta?{' '}
        <a
          className="tw-text-brand-700 tw-font-normal hover:tw-underline hover:tw-cursor-pointer"
          onClick={() => navigate('../sign-up')}
        >
          Crie uma conta
        </a>
        .
      </p>
    </div>
  )
}

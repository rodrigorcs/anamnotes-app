import { FC } from 'react'
import { ConfirmSignUpForm } from './ConfirmSignUpForm'
import { Button } from '../../common/Button'
import { NavArrowLeft as BackIcon } from 'iconoir-react'
import { useAuthStore } from '../../../stores/auth'
import { useNavigate } from 'react-router-dom'
import { getFirstNameFromFullName } from '../../../utils/names'

export const ConfirmSignUpContent: FC = () => {
  const navigate = useNavigate()

  const loginData = useAuthStore((state) => state.loginData)
  const firstName = getFirstNameFromFullName(loginData?.fullName)

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-mb-14">
      <div className="tw-flex">
        <Button
          IconLeft={<BackIcon />}
          variant="tertiary"
          text="Voltar"
          className="tw-pl-0"
          onClick={() => navigate(-1)}
        />
      </div>
      <h1 className="tw-mt-14 tw-text-xl tw-font-semibold tw-text-neutrals-700">
        {`Bem vindo${firstName ? `, ${firstName}` : ''}! 👋🏻`}
      </h1>
      <p className="tw-mt-2 tw-text-sm tw-text-neutrals-600">
        Enviamos um código de verificação para{' '}
        <span className="tw-font-semibold">{loginData?.emailAddress}</span>
      </p>
      <ConfirmSignUpForm />
    </div>
  )
}

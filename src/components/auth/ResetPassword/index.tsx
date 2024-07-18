import { FC, useEffect } from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'
import { NavArrowLeft as BackIcon } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../common/Button'
import { useAuthStore } from '../../../stores/auth'

export const ResetPasswordContent: FC = () => {
  const navigate = useNavigate()
  const resetPasswordData = useAuthStore((state) => state.resetPasswordData)

  useEffect(() => {
    if (!resetPasswordData) navigate('..')
  }, [resetPasswordData])

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center">
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
        Crie uma nova senha
      </h1>

      <p className="tw-mt-2 tw-text-sm tw-text-neutrals-600">
        Enviamos um código de verificação para{' '}
        <span className="tw-font-semibold">{resetPasswordData?.emailAddress}</span>
      </p>
      <ResetPasswordForm />
    </div>
  )
}

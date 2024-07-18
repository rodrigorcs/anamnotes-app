import { FC } from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { NavArrowLeft as BackIcon } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../common/Button'

export const ForgotPasswordContent: FC = () => {
  const navigate = useNavigate()

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
        Vamos recuperar a sua senha
      </h1>
      <p className="tw-mt-2 tw-text-sm tw-text-neutrals-600">
        Esqueceu a sua senha? Nos informe o seu email abaixo e receba as instruções para criar uma
        nova senha.
      </p>
      <ForgotPasswordForm />
    </div>
  )
}

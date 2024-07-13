import { FC, useState } from 'react'
import { Amplify } from 'aws-amplify'
import { Input } from '../components/common/Input'
import { confirmSignUp, signIn, signUp } from 'aws-amplify/auth'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../components/common/Button'
import signUpImage from '../../public/assets/images/sign-up.png'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
})

export const LoginPage: FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOTP] = useState('')

  const handleSignUp = async () => {
    return signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email,
          name,
        },
      },
    })
  }

  const handleConfirmSignUp = async () => {
    return confirmSignUp({
      username: email,
      confirmationCode: otp,
    })
  }

  const handleSignIn = async () => {
    return signIn({
      username: email,
      password: password,
    })
  }
  const formMethods = useForm()
  const onSubmit = (data: unknown) => console.log(data)

  return (
    <div className="tw-flex-1 tw-flex tw-p-4 tw-justify-end">
      <div className="tw-flex-1 tw-flex tw-pl-24 tw-pr-28 tw-pt-16 tw-py-28 tw-max-w-[42rem]">
        <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-mb-14">
          <p className="tw-text-sm tw-text-neutrals-700">
            Já tem uma conta?{' '}
            <a className="tw-text-brand-500 hover:tw-underline hover:tw-cursor-pointer">
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
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="tw-flex tw-flex-col tw-mt-12"
            >
              <Input
                id="name"
                register={formMethods.register}
                title="Nome"
                placeholder="Qual o seu nome?"
                className="tw-mt-2"
              />
              <Input
                id="email"
                register={formMethods.register}
                title="E-mail"
                placeholder="exemplo@email.com"
                className="tw-mt-2"
              />
              <Input
                id="password"
                register={formMethods.register}
                title="Senha"
                placeholder="Crie uma senha"
                className="tw-mt-2"
              />
              <Button text="Inscreva-se" type="submit" className="tw-mt-12" />
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="tw-flex-1 tw-flex tw-flex-col tw-bg-[#EDF2FF] tw-max-w-[56rem]">
        <h2 className="tw-text-brand-500 tw-text-4xl tw-leading-[3rem] tw-px-24 tw-mt-16 tw-text-center">
          Resuma as suas anamneses <span className="tw-font-semibold">automaticamente</span>.
        </h2>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-end">
          <div className="tw-flex-1 tw-flex tw-align-end tw-pl-8 tw-mt-8 tw-max-w-[56rem] tw-items-center">
            <img
              src={signUpImage}
              alt="Anamnotes demo"
              className="tw-object-right tw-object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

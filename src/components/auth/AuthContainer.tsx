import { FC, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import signUpImage from '/assets/images/sign-up.png'
import { useAuthStore } from '../../stores/auth'

export const AuthContainer: FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const hasFetchedAuthSession = useAuthStore((state) => state.hasFetchedAuthSession)

  useEffect(() => {
    if (hasFetchedAuthSession && user) navigate('/app')
  }, [user])

  return (
    <div className="tw-flex-1 tw-flex tw-p-4 tw-justify-end">
      <div className="tw-flex-1 tw-flex tw-pl-24 tw-pr-28 tw-pt-16 tw-py-28 tw-max-w-[42rem]">
        <Outlet />
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

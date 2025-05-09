import { FC, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth'
import { cn } from '../../utils/className'
import signUpImage from '/assets/images/sign-up.png'
import logoIconNameVec from '/assets/vectors/logo-icon-name.svg'

export const AuthContainer: FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const hasFetchedAuthSession = useAuthStore((state) => state.hasFetchedAuthSession)

  useEffect(() => {
    if (hasFetchedAuthSession && user) navigate('/app')
  }, [user])

  return (
    <div className="tw-flex-1 tw-flex tw-p-4 tw-justify-end max-lg:tw-justify-center">
      <div className="tw-absolute tw-top-8 tw-left-8 xs:tw-left-[4.5rem] sm:tw-left-12">
        <img src={logoIconNameVec} alt="Anamnotes" className="tw-h-6 xs:tw-h-7" />
      </div>
      <div
        className={cn(
          'tw-flex-1 tw-pl-24 tw-pr-28 tw-py-16 tw-max-w-[42rem]',
          'max-sm:tw-pl-14 max-sm:tw-pr-14',
          'max-xs:tw-pl-4 max-xs:tw-pr-4 tw-py-0',
        )}
      >
        <div className="tw-flex tw-flex-col tw-relative tw-top-[calc(50%-4.75rem)] tw-transform tw-translate-y-[calc(-50%+2.375rem)]">
          <Outlet />
        </div>
      </div>
      <div className="tw-flex-1 tw-flex tw-flex-col tw-bg-[#EDF2FF] tw-max-w-[56rem] max-lg:tw-hidden">
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
